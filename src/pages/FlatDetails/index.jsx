import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../constants/axiosInstance';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableRow, TableCell, Tab, Tabs, Link, TablePagination, TableHead, Button } from '@mui/material';
import BackButton from '../../components/BackButton';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const FlatDetails = () => {
    const { id } = useParams();
    const [flatDetails, setFlatDetails] = useState(null);
    const [value, setValue] = useState(0);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [vouchers, setVouchers] = useState([]);
    const [voucherPage, setVoucherPage] = useState(0);
    const [voucherRowsPerPage, setVoucherRowsPerPage] = useState(10);
    const [voucherCount, setVoucherCount] = useState(0);
    const [voucherPageSize, setVoucherPageSize] = useState(10);

    const handleBackClick = () => {
        const searchParams = new URLSearchParams(location.search);
        const buildingId = searchParams.get('buildingId');
        const page = searchParams.get('page') || 0;
        const pageSize = searchParams.get('pageSize') || 10;

        navigate(`/rental/flats?buildingId=${buildingId}&page=${page}&pageSize=${pageSize}`);
    };
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axiosInstance.get(`/vouchers-flat/${id}`, {
                    params: {
                        page: voucherPage + 1,
                        resultsPerPage: voucherRowsPerPage
                    }
                });
                setVouchers(response.data.data);
                setVoucherCount(response.data.count);
            } catch (error) {
                console.error("Failed to fetch vouchers:", error);
            }
        };

        if (value === 4) {
            fetchVouchers();
        }
    }, [id, value, voucherPage, voucherRowsPerPage]);
    const columns = [
        {
            field: 'description',
            headerName: t('description'),
            flex: 1,
            renderCell: (params) => {
                const buildingInfo = params.row.flatId ? params.row.flatId?.buildingId : params.row.buildingId;
                const flatNumber = params.row.flatId ? `, Flat Number: ${params.row.flatId?.flatNumber}` : "";
                return `${buildingInfo.name}${flatNumber}`;
            }
        },
        {
            field: 'name',
            headerName: t('tenantName'),
            flex: 1,
            valueGetter: (params) => params.row.tenantId?.name
        },
        {
            field: 'amount',
            headerName: t('rentAmount'),
            flex: 1,
            renderCell: (params) => `${params.value} (Status: ${params.row?.status})`
        },
        {
            field: 'pendingDate',
            headerName: t('pendingDate'),
            flex: 1,
            renderCell: (params) => {
                const pendingDate = params.value ? moment(params.value).format('MMMM') : '';
                const hasPaidDate = params.row.paidDate;
                const color = hasPaidDate ? 'black' : 'red';
                return <span style={{ color }}>{pendingDate}</span>;
            }
        },
        {
            field: 'paidDate',
            headerName: t('paidDate'),
            flex: 1,
            renderCell: (params) => {
                if (!params.value) return '';
                const paidDate = moment(params.value).format('DD-MM-YYYY');
                return <span style={{ color: 'green' }}>{paidDate}</span>;
            }
        },
        {
            field: 'voucherNo',
            headerName: t('voucherNo'),
            flex: 1,
            valueGetter: (params) => {
                if (!params.value) return '';
                return params.value
            }
        },
    ];
    const handleChangePage = (event, newPage) => {
        setVoucherPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setVoucherRowsPerPage(parseInt(event.target.value, 10));
        setVoucherPage(0);
    };
    const getVoucherCSV = () => {
        const queryString = `voucher-flat-csv/${id}`;
        axiosInstance.get(queryString, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                saveAs(blob, `voucher_report_flat_${id}.csv`);
            })
            .catch(error => {
                console.error('Download error!', error);
                // You might want to show an error message to the user here
            });
    };
    useEffect(() => {
        const fetchFlatDetails = async () => {
            try {
                const response = await axiosInstance.get(`flat/${id}`);
                setFlatDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch flat details:", error);
            }
        };
        fetchFlatDetails();
    }, [id]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (!flatDetails) {
        return (
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Typography variant='h2'>Loading...</Typography>
            </Box>
        );
    }

    const DetailRow = ({ label, value }) => (
        <TableRow>
            <TableCell component="th" scope="row" sx={{ border: 0, fontWeight: 'bold', minWidth: '14rem' }}>
                {label}
            </TableCell>
            <TableCell sx={{ border: 0, minWidth: '14rem' }}>{value}</TableCell>
        </TableRow>
    );
    const DocumentRow = ({ label, document }) => {
        if (!document) return null;

        return (
            <TableRow>
                <TableCell component="th" scope="row" sx={{ border: 0, fontWeight: 'bold', minWidth: '14rem' }}>
                    {label}
                </TableCell>
                <TableCell>
                    <Link href={document.path} target="_blank" rel="noopener noreferrer">
                        {t('view')}
                    </Link>

                </TableCell>
            </TableRow>
        );
    };
    return (
        <React.Fragment>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', display: 'flex' }}>
                <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                    <Typography variant='h2' style={{ direction: 'rtl', unicodeBidi: 'embed', textAlign: 'start' }}>
                        {flatDetails?.buildingId?.name ?? 'N/A'} - Flat {flatDetails?.flatNumber}
                        <BackButton onClick={handleBackClick} />

                    </Typography>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label={t('buildings')} {...a11yProps(0)} />
                            <Tab label={t('tenants')} {...a11yProps(1)} />
                            <Tab label={t('contracts')} {...a11yProps(2)} />
                            <Tab label={t('flats')} {...a11yProps(3)} />
                            <Tab label={t('transaction_history')} {...a11yProps(4)} />

                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>{t('building_details')}</Typography>} />
                                    <DetailRow label={t('name')} value={flatDetails.buildingId?.name} />
                                    <DetailRow label={t('floors')} value={flatDetails.buildingId?.floors} />
                                    <DetailRow label={t('block')} value={flatDetails.buildingId?.address?.block} />
                                    <DetailRow label={t('street')} value={flatDetails.buildingId?.address?.street} />
                                    <DetailRow label={t('house')} value={flatDetails.buildingId?.address?.house} />
                                    <DetailRow label={t('avenue')} value={flatDetails.buildingId?.address?.avenue} />
                                    <DetailRow label={t('city')} value={flatDetails.buildingId?.address?.city} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>{t('tenant_details')}</Typography>} />
                                    <DetailRow label={t('name')} value={flatDetails.tenant?.name} />
                                    <DetailRow label={t('contact_number')} value={flatDetails.tenant?.contactNumber} />
                                    <DetailRow label={t('civil_id')} value={flatDetails.tenant?.civilId} />
                                    <DetailRow label={t('type')} value={flatDetails.tenant?.type} />
                                    <DocumentRow label={t('civil_id')} document={flatDetails.tenant?.civilIdDocument} />

                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>{t('contract_details')}</Typography>} />
                                    <DetailRow label={t('start_date')} value={flatDetails.contract?.startDate ? new Date(flatDetails.contract.startDate).toLocaleDateString() : 'N/A'} />
                                    <DetailRow label={t('end_date')} value={flatDetails.contract?.endDate ? new Date(flatDetails.contract.endDate).toLocaleDateString() : 'N/A'} />
                                    <DetailRow label={t('rent_amount')} value={flatDetails.contract?.rentAmount} />
                                    <DetailRow label={t('collection_day')} value={flatDetails.contract?.collectionDay} />
                                    <DetailRow label={t('expired')} value={flatDetails.contract?.expired ? 'Yes' : 'No'} />
                                    <DocumentRow label={t('contract')} document={flatDetails.contract?.contractDocument} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>{t('flat_details')}</Typography>} />
                                    <DetailRow label={t('flat_number')} value={flatDetails.flatNumber} />
                                    <DetailRow label={t('floorNumber')} value={flatDetails?.floorNumber} />
                                    <DetailRow label={t('vacant')} value={flatDetails.vacant ? 'Yes' : 'No'} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Button
                            variant="contained"
                            onClick={getVoucherCSV}
                            style={{ marginBottom: '2rem' }}
                        >
                            {t('export_csv')}
                        </Button>

                        <Box style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={vouchers}
                                columns={columns}
                                pageSize={voucherPageSize}
                                rowCount={voucherCount}
                                paginationMode="server"
                                onPageChange={(newPage) => setVoucherPage(newPage)}
                                onPageSizeChange={(newPageSize) => setVoucherPageSize(newPageSize)}
                                rowsPerPageOptions={[5, 10, 20]}
                                pagination
                                getRowId={(row) => row._id}
                            />
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default FlatDetails;