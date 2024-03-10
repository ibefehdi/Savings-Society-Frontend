import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useReactToPrint } from 'react-to-print';

import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from '@mui/material';
import axiosInstance from '../../constants/axiosInstance';
import WithdrawalForm from '../../printablePages/WithdrawalForm';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Select from '@mui/material/Select';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
const ViewButton = ({ id, edit, setEditOpen, setSelectedShareholderId }) => {

    const handleEditClick = () => {
        setSelectedShareholderId(id); // Set the selected shareholder ID
        setEditOpen(true); // Open the edit modal
    };

    return (


        <IconButton onClick={handleEditClick}>
            <LocalAtmIcon />
        </IconButton>

    );
};

const SharesWithdrawalPage = () => {
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [filters, setFilters] = useState({
        fName: '',
        lName: '',
        status: '',
        membershipStatus: '',
        civilId: '',
        serial: ''
    });
    const { data, fetchData, count } = useFetch('/shareholders', pageNo, pageSize, filters);
    const [selectedShareholderId, setSelectedShareholderId] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')))
    const [admin, setAdmin] = useState(userData?.isAdmin)
    const [adminId, setAdminId] = useState(userData?.id)
    const columns = [
        {
            field: 'serial',
            headerName: t('serial'),
            flex: 1,
        },
        {
            field: 'fName',
            headerName: t('first_name'),
            flex: 1,
        },
        {
            field: 'lName',
            headerName: t('last_name'),
            flex: 1,
        },
        {
            field: 'DOB',
            headerName: t('date_of_birth'),
            flex: 1,
            renderCell: (params) => {
                // Parse the date string from params.value
                const date = new Date(params.value);

                // Extract day, month, and year
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                const year = date.getFullYear().toString(); // Get last two digits of year

                // Formatted date string in "DD/MM/YY" format
                const formattedDate = `${day}/${month}/${year}`;

                // Return the formatted date
                return formattedDate;
            }
        },
        {
            field: 'civilId',
            headerName: t('civil_id'),
            flex: 1,

        },

        {
            field: 'ibanNumber',
            headerName: t('iban'),
            flex: 1,
        },
        {
            field: 'mobileNumber',
            headerName: t('phone_number'),
            flex: 1,
        },
        {
            field: 'address',
            headerName: t('address'),
            flex: 1,
            renderCell: (params) => {
                const { block, street, house, avenue, city } = params.value;
                return `Block ${block}, Street ${street}, House ${house}, Avenue ${avenue}, City ${city}`;
            }
        },
        {
            field: 'initialInvestment',
            headerName: t('initial_investment'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savings && params.row.savings.initialAmount.toFixed(3);
            }
        },
        {
            field: 'currentAmount',
            headerName: t('current_amount'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savings && params.row.savings.currentAmount.toFixed(3);
            }
        },
        {
            field: 'membershipStatus',
            headerName: t('membership_status'),
            flex: 1,
            renderCell: (params) => {
                if (params.value === 0) {
                    return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>Active</Typography>
                }
                else if (params.value === 1) {
                    return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>Inactive</Typography>
                }
            }
        },
        {
            field: 'status',
            headerName: t('status'),
            flex: 1,
            renderCell: (params) => {
                if (params.value === 0) {
                    return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>Active</Typography>
                }
                else if (params.value === 1) {
                    return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>Inactive</Typography>
                }
                else if (params.value === 2) {
                    return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>Death</Typography>
                }
            }
        },
        ...(admin ? [{
            field: 'deposit',
            headerName: t('withdrawal'),
            sortable: false,
            width: 55,
            renderCell: (params) => {
                return <ViewButton id={params.id} edit={true} setEditOpen={setEditOpen} setSelectedShareholderId={setSelectedShareholderId} />;

            },
        }] : []),


    ];

    const [editOpen, setEditOpen] = useState(false);
    const handleWithdraw = (user) => {
        setSelectedShareholderId(user);
        setEditOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: pageNo,
    });
    const handleCloseConfirmDialog = () => {
        setEditOpen(false);
        setSelectedShareholderId(null)
    }
    const confirmWithdraw = async () => {
        if (selectedShareholderId) {
            try {
                const response = await axiosInstance.post(`/shareholder/withdrawshares/${selectedShareholderId}`, { adminId: adminId });
                //console.log("response: " + JSON.stringify(response));
                // Close dialog and refresh data or any additional state updates
                setEditOpen(false);
                setSelectedShareholderId(null);
                navigate(response?.data?.response?.link)
                fetchData(); // Assuming you have a fetchData function to refresh the list
            } catch (error) {
                console.error("Deletion error:", error);
                setEditOpen(false);
                setSelectedShareholderId(null);
            }
        }
    };
    const ConfirmWithdrawDialog = () => (
        <Dialog
            open={editOpen}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to withdraw savings for this user?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirmDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmWithdraw} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    return (
        <React.Fragment>
            <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto' }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>
            {showFilters && (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <TextField
                    label={t('serial')}
                    variant="outlined"
                    value={filters.serial}
                    onChange={(e) => setFilters({ ...filters, serial: e.target.value })}
                    fullWidth
                    autoComplete='off'
                />
                <TextField
                    label={t('first_name')}
                    variant="outlined"
                    value={filters.fName}
                    onChange={(e) => setFilters({ ...filters, fName: e.target.value })}
                    fullWidth
                    autoComplete='off'

                />
                <TextField
                    label={t('last_name')}
                    variant="outlined"
                    value={filters.lName}
                    onChange={(e) => setFilters({ ...filters, lName: e.target.value })}
                    fullWidth
                    autoComplete='off'

                />
                <TextField
                    label={t('civil_id')}
                    variant="outlined"
                    value={filters.civilId}
                    onChange={(e) => setFilters({ ...filters, civilId: e.target.value })}
                    fullWidth
                    autoComplete='off'

                />
                <TextField
                    label={t('status')}
                    variant="outlined"
                    select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    fullWidth
                    autoComplete='off'

                >
                    {/* Replace these with your actual status options */}
                    <MenuItem value={0}>{t('active')}</MenuItem>
                    <MenuItem value={1}>{t('inactive')}</MenuItem>
                    <MenuItem value={2}>{t('death')}</MenuItem>
                </TextField>
                <TextField
                    label={t('membership_status')}
                    variant="outlined"
                    select
                    value={filters.membershipStatus}
                    onChange={(e) => setFilters({ ...filters, membershipStatus: e.target.value })}
                    fullWidth
                    autoComplete='off'
                >
                    <MenuItem value={0}>{t('active')}</MenuItem>
                    <MenuItem value={1}>{t('inactive')}</MenuItem>
                </TextField>
            </Box>)}
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600,
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        Shares Withdrawal
                    </Typography>
                    <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>
                        <WithdrawalForm ref={componentRef} />
                    </Box>

                    <Button variant='contained' onClick={() => { handlePrint() }}>{t('print_form')}</Button>
                </Box>
                <DataGrid
                    rows={data}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newModel) => {
                        setPageNo(newModel.page + 1);
                        setPaginationModel(newModel);
                    }}
                    getRowId={(row) => row._id}
                    rowCount={count}
                    paginationMode="server"
                    sx={{
                        backgroundColor: '#FFF',
                        padding: '1rem',
                        border: 'none',
                        width: '100%',
                        '& .MuiDataGrid-columnHeadersInner': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-virtualScrollerContent': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            border: 'none',
                            fontStyle: 'normal', // Sets the font style
                            fontWeight: 600, // Sets the font weight
                            lineHeight: '1.25rem',
                            color: '#667085',
                            fontSize: '0.875rem'
                        },
                    }}
                />
            </Box>
            <ConfirmWithdrawDialog />
        </React.Fragment>

    )
}

export default SharesWithdrawalPage