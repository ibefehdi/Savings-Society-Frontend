import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../constants/axiosInstance';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import PrintDataGrid from '../../printablePages/PrintDataGrid';
import ReactToPrint, { useReactToPrint } from 'react-to-print';

import Typography from '@mui/material/Typography';
import { Table, TableBody, TableRow, TableCell, Tab, Tabs, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import MoveInterestToSavings from '../Withdrawals/MoveInterestToSavings';
import { t } from 'i18next';
import MoveSavingsToAmanatModal from '../Withdrawals/MoveSavingsToAmanatModal';
import { useFetchNoPagination } from '../../hooks/useFetchNoPagination';
import ChangeBalanceModal from '../Withdrawals/ChangeBalanceModal';
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
const ShareholderDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const componentRef = useRef();
    const handleBackClick = () => {
        const searchParams = new URLSearchParams(location.search);
        const page = searchParams.get('page') || 0;
        const pageSize = searchParams.get('pageSize') || 10;
        navigate(`/shareholder/shareholders?page=${page}&pageSize=${pageSize}`);
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const { id } = useParams();
    const { data, fetchData, count, updateFilters, filters, grandTotal } = useFetchNoPagination(`/financialreportofuser/${id}`);
    useEffect(() => { fetchData() }, [])
    const [shareholderDetails, setShareholderDetails] = useState()
    useEffect(() => {
        console.log("This is the id: ", id)
    }, [id])
    const [editOpen, setEditOpen] = useState(false);
    const [moveToAmanatOpen, setMoveToAmanatOpen] = useState(false);

    const [value, setValue] = useState(0);
    const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')))
    const [permissions, setPermissions] = useState(userData?.permissions)

    const { t, i18n } = useTranslation();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // const savingsOfYear = shareholderDetails?.savings?.filter(s => parseInt(s.year, 10) === selectedYear);
    // const sharesOfYear = shareholderDetails?.share?.filter(s => s.year === selectedYear);
    const fetchShareholderDetails = async () => {
        try {
            const response = await axiosInstance.get(`shareholder/${id}`);
            setShareholderDetails(response.data.shareholder);
            if (response.data.shareholder.share.length > 0) {
                setSelectedYear(response.data.shareholder.share[0].year);
            }
        } catch (error) {
            console.error("Failed to fetch shareholder details:", error);
        }
    };
    useEffect(() => {

        fetchShareholderDetails();
    }, [id]);
    const [changeBalanceOpen, setChangeBalanceOpen] = useState(false);
    const [newBalance, setNewBalance] = useState('');


    // useEffect(() => {
    //     console.log("Shares", sharesOfYear);
    // }, [sharesOfYear]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    if (!shareholderDetails) {
        return <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
            <Typography variant='h2'>Loading...</Typography>
        </Box>;
    }
    if (!permissions?.shareholder?.view) {
        return <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
            <Typography variant='h2'>You Don't Have Permission To View This Information</Typography>
        </Box>;
    }
    const DetailRow = ({ label, value }) => (
        <TableRow>
            <TableCell component="th" scope="row" sx={{ border: 0, fontWeight: 'bold', minWidth: '14rem', textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                {label}
            </TableCell>
            <TableCell sx={{ border: 0, minWidth: '14rem', textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{value}</TableCell>
        </TableRow>
    );
    const FormatDate = (dob) => {
        const date = new Date(dob);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }
    const StatusDetail = (status) => {
        if (status === 0) {
            return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>{t('active')}</Typography>
        }
        else if (status === 1) {
            return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>{t('inactive')}</Typography>
        }
        else if (status === 2) {
            return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>{t('death')}</Typography>
        }
    }

    return (
        <React.Fragment>

            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', display: 'flex' }}>
                {/* <Button variant='contained' onClick={handlePrint}>{t('print_form')}</Button> */}

                <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0, display: 'none' }}>


                    <PrintDataGrid ref={componentRef} data={data} grandTotal={grandTotal} filters={filters} />
                </Box>

                <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography variant='h2' style={{ direction: 'rtl', unicodeBidi: 'embed', textAlign: 'start' }}>
                            {shareholderDetails.fName} {shareholderDetails.lName} - #{shareholderDetails.membersCode}
                        </Typography>
                        <Button variant='contained' onClick={handlePrint}>{t('print_form')}</Button>
                        <Button variant="contained" onClick={handleBackClick} sx={{ marginRight: '1rem' }}>
                            {t('back')}
                        </Button>
                    </Box>


                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>


                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label={t('overview')} {...a11yProps(0)} />
                            <Tab label={t('contact_details')} {...a11yProps(1)} />
                            <Tab label={t('address')} {...a11yProps(2)} />
                            <Tab label={t('investment')} {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Box>
                            <Table >
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>{t('personal_details')}</Typography>} />
                                    <DetailRow label={t('full_name')} value={`${shareholderDetails.fName} ${shareholderDetails.lName}`} />
                                    <DetailRow label={t('serial')} value={shareholderDetails.membersCode} />
                                    <DetailRow label={t('status')} value={StatusDetail(shareholderDetails.status)} />
                                    <DetailRow label={t('civil_id')} value={shareholderDetails.civilId} />
                                    <DetailRow label={t('nationality')} value={shareholderDetails.Country} />
                                    <DetailRow label={t('dob')} value={FormatDate(shareholderDetails.DOB)} />
                                    <DetailRow label={t('bankName')} value={shareholderDetails.bankName} />
                                    <DetailRow label={t('iban')} value={shareholderDetails.ibanNumber} />
                                    <DetailRow label={t('join_date')} value={FormatDate(shareholderDetails.joinDate)} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell variant="head">{t('savings')}</TableCell>
                                </TableRow>

                                <TableRow >
                                    <TableCell>{t('current_amount')}</TableCell>
                                    <TableCell>{shareholderDetails?.savings?.totalAmount ? shareholderDetails?.savings?.totalAmount : "N/A"}</TableCell>
                                    <TableCell>{t('savings_increase')}</TableCell>
                                    <TableCell>{shareholderDetails?.savings?.savingsIncrease ? shareholderDetails?.savings?.savingsIncrease : "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{t('total')}</TableCell>
                                    <TableCell>{shareholderDetails?.savings?.alraseed ? shareholderDetails?.savings?.alraseed : "N/A"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setChangeBalanceOpen(true)}
                                        >
                                            {t('change_balance')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: '10px', marginLeft: '10px' }}
                                            onClick={() => setMoveToAmanatOpen(true)}
                                        >
                                            {t('move_to_amanat')}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setEditOpen(true)}
                                        >
                                            {t('move_interest_to_savings')}
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell variant="head">{t('share')}</TableCell>
                                </TableRow>

                                <TableRow >
                                    <TableCell>{t('amount_of_shares')}</TableCell>
                                    <TableCell>{shareholderDetails?.share?.totalShareAmount ? shareholderDetails?.share?.totalShareAmount : "N/A"}</TableCell>
                                    <TableCell>{t('current_amount')}</TableCell>
                                    <TableCell>{shareholderDetails?.share?.totalAmount ? shareholderDetails?.share?.totalAmount : "N/A"}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell variant="head">{t('amanat')}</TableCell>
                                    <TableCell>{shareholderDetails?.savings?.amanat ? shareholderDetails?.savings?.amanat?.amount : "N/A"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>{t('contact_details')}</Typography>} />
                                    <DetailRow label={t('email')} value={shareholderDetails.email} />
                                    <DetailRow label={t('phone_number')} value={shareholderDetails.mobileNumber} />
                                    <DetailRow label={t('zipCode')} value={shareholderDetails.zipCode} />
                                    <DetailRow label={t('iban')} value={shareholderDetails.ibanNumber} />
                                    <DetailRow label={t('area')} value={shareholderDetails.Area} />
                                    <DetailRow label={t('workplace')} value={shareholderDetails.workplace} />

                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>{t('address')}</Typography>} />
                                    <DetailRow label={t('block')} value={shareholderDetails.address.block} />
                                    <DetailRow label={t('street')} value={shareholderDetails.address.street} />
                                    <DetailRow label={t('house')} value={shareholderDetails.address.house} />
                                    <DetailRow label={t('area')} value={shareholderDetails.address.area} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
            <MoveInterestToSavings
                savings={true}
                id={id}
                open={editOpen}
                setOpen={setEditOpen}
                fetchData={() => { window.location.reload(); }}
            />
            <MoveSavingsToAmanatModal
                id={id}
                open={moveToAmanatOpen}
                setOpen={setMoveToAmanatOpen}
                fetchData={() => { window.location.reload(); }}

            />
            <ChangeBalanceModal
                open={changeBalanceOpen}
                setOpen={setChangeBalanceOpen}
                currentBalance={shareholderDetails?.savings?.alraseed || 0}
                shareholderId={shareholderDetails._id}
                onSuccess={fetchShareholderDetails}
            />
        </React.Fragment>
    );
}

export default ShareholderDetails;
