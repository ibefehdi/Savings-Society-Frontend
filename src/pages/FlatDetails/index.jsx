import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../constants/axiosInstance';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableRow, TableCell, Tab, Tabs, Link } from '@mui/material';

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
                    </Typography>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label={t('building')} {...a11yProps(0)} />
                            <Tab label={t('tenant')} {...a11yProps(1)} />
                            <Tab label={t('contract')} {...a11yProps(2)} />
                            <Tab label={t('flat')} {...a11yProps(3)} />
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
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default FlatDetails;