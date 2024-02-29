import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../constants/axiosInstance';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Table, TableBody, TableRow, TableCell, Tab, Tabs } from '@mui/material';
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
    const { id } = useParams();
    console.log(id);
    const [shareholderDetails, setShareholderDetails] = useState()
    const [value, setValue] = useState(0);
    const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')))
    const [permissions, setPermissions] = useState(userData?.permissions)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        const fetchShareholderDetails = async () => {
            try {
                const response = await axiosInstance.get(`shareholder/${id}`);
                setShareholderDetails(response?.data?.shareholder);
                console.log(response.data);
            } catch (error) {
                console.error("Failed to fetch shareholder details:", error);
            }
        };

        fetchShareholderDetails();
    }, [id]);

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
            <TableCell component="th" scope="row" sx={{ border: 0, fontWeight: 'bold', minWidth: '14rem' }}>
                {label}
            </TableCell>
            <TableCell sx={{ border: 0, minWidth: '14rem' }}>{value}</TableCell>
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
            return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>Active</Typography>
        }
        else if (status === 1) {
            return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>Inactive</Typography>
        }
        else if (status === 2) {
            return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>Death</Typography>
        }
    }
    return (
        <React.Fragment>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', display: 'flex' }}>

                <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                    <Typography variant='h2' style={{ direction: 'rtl', unicodeBidi: 'embed', textAlign: 'start' }}>
                        {shareholderDetails.fName} {shareholderDetails.lName} - #{shareholderDetails.serial}
                    </Typography>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Overview" {...a11yProps(0)} />
                            <Tab label="Contact Details" {...a11yProps(1)} />
                            <Tab label="Address" {...a11yProps(2)} />
                            <Tab label="Investment" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Box>
                            <Table >
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>Personal Details</Typography>} />
                                    <DetailRow label="Full Name" value={`${shareholderDetails.fName} ${shareholderDetails.lName}`} />
                                    <DetailRow label="Membership ID" value={shareholderDetails.serial} />
                                    <DetailRow label="Category" value="Shareholder" />
                                    <DetailRow label="Status" value={StatusDetail(shareholderDetails.status)} />
                                    <DetailRow label="Civil Id" value={shareholderDetails.civilId} />
                                    <DetailRow label="Nationality" value={shareholderDetails.Country} />
                                    <DetailRow label="Date Of Birth" value={FormatDate(shareholderDetails.DOB)} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Box sx={{ display: 'flex' }}>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>Savings</Typography>} />
                                    <DetailRow label="Initial Investment" value={shareholderDetails.savings.initialAmount} />
                                    <DetailRow label="Current Amount" value={shareholderDetails.savings.currentAmount.toFixed(3)} />
                                    <DetailRow label="Initial Investment Date" value={FormatDate(shareholderDetails.savings.date)} />
                                    <DetailRow label="Interest Calculation Date" value={FormatDate(shareholderDetails.savings.updatedAt)} />
                                </TableBody>
                            </Table>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>Shares</Typography>} />
                                    {shareholderDetails?.share?.map(share => (
                                        <div key={share._id}>
                                            <DetailRow label="Share Amount" value={share.amount} />
                                            <DetailRow label="Initial Amount Paid" value={share.initialAmount} />
                                            <DetailRow label="Current Amount " value={share.currentAmount.toFixed(3)} />
                                            <DetailRow label="Investment Date" value={FormatDate(share.date)} />

                                        </div>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>Contact Details</Typography>} />
                                    <DetailRow label="Email Address" value={shareholderDetails.email} />
                                    <DetailRow label="Phone Number" value={shareholderDetails.mobileNumber} />
                                    <DetailRow label="Zip Code" value={shareholderDetails.zipCode} />
                                    <DetailRow label="IBAN Number" value={shareholderDetails.ibanNumber} />
                                    <DetailRow label="Area" value={shareholderDetails.Area} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Box>
                            <Table>
                                <TableBody>
                                    <DetailRow label={<Typography variant="h5" sx={{ fontWeight: '600' }}>Address</Typography>} />
                                    <DetailRow label="Block" value={shareholderDetails.address.block} />
                                    <DetailRow label="Street Number" value={shareholderDetails.address.street} />
                                    <DetailRow label="House" value={shareholderDetails.address.house} />
                                    <DetailRow label="City" value={shareholderDetails.address.city} />
                                </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default ShareholderDetails;
