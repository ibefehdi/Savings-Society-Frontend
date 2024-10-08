import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useReactToPrint } from 'react-to-print';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MoveSavingsToAmanatModal from './MoveSavingsToAmanatModal';
import { saveAs } from 'file-saver';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { MenuItem, TextField } from '@mui/material';
import axiosInstance from '../../constants/axiosInstance';
import WithdrawalForm from '../../printablePages/WithdrawalForm';
import { useTranslation } from 'react-i18next';
import WithdrawalModal from './WithdrawalModal';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import MoveInterestToSavings from './MoveInterestToSavings';
import BackButton from '../../components/BackButton';
import MoveCurrentSavingsToAmanatModal from './MoveCurrentSavingsToAmanatModal';
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
const MoveToAmanatButton = ({ id, setMoveToAmanatOpen, setSelectedShareholderId }) => {
    const handleClick = () => {
        setSelectedShareholderId(id);
        setMoveToAmanatOpen(true);
    };

    return (
        <IconButton onClick={handleClick}>
            <CompareArrowsIcon />
        </IconButton>
    );
};
const MoveCurrentSavingsToAmanatButton = ({ id, setMoveCurrentSavingsToAmanatOpen, setSelectedShareholderId }) => {
    const handleClick = () => {
        setSelectedShareholderId(id);
        setMoveCurrentSavingsToAmanatOpen(true);
    };

    return (
        <IconButton onClick={handleClick}>
            <CompareArrowsIcon />
        </IconButton>
    );
};
const SavingsWithdrawalPage = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [selectedShareholderId, setSelectedShareholderId] = useState(null);
    const [moveToAmanatOpen, setMoveToAmanatOpen] = useState(false);
    const [moveCurrentSavingsToAmanatOpen, setMoveCurrentSavingsToAmanatOpen] = useState(false)
    const [filters, setFilters] = useState({
        fName: '',
        lName: '',
        status: '0',
        membershipStatus: '0',
        civilId: '',
        membersCode: ''
    });
    const { data, fetchData, count } = useFetch('/shareholders', pageNo + 1, pageSize, filters);

    const navigate = useNavigate();
    const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')))
    const [admin, setAdmin] = useState(userData?.isAdmin)
    const [adminId, setAdminId] = useState(userData?.id);
    const { i18n, t } = useTranslation()
    const columns = [
        {
            field: 'membersCode',
            headerName: t('serial'),
            flex: 1,
        },
        {
            field: 'Full Name',
            headerName: t('full_name'),
            flex: 1,
            renderCell: (params) => {
                return `${params.row.fName} ${params.row.lName}`
            }
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
            field: 'joinDate',
            headerName: t('join_date'),
            flex: 1.5,
            renderCell: (params) => {
                const date = new Date(params.value);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear().toString();
                const formattedDate = `${day}/${month}/${year}`;
                return formattedDate;
            }
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
            renderCell: (params) => {
                return params.row.mobileNumber && params.row.mobileNumber ? params.row.mobileNumber : "N/A"
            }
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
            field: 'savingsForShareholder',
            headerName: t('savings'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savings && params.row.savings?.totalAmount
            }
        },
        {
            field: 'savingsIncrease',
            headerName: t('savingsIncrease'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savings && params.row.savings?.savingsIncrease
            }
        },
        // {
        //     field: 'initialInvestment',
        //     headerName: t('initial_investment'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         return params.row.savings && params.row.savings.initialAmount 
        //     }
        // },
        // {
        //     field: 'currentAmount',
        //     headerName: t('current_amount'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         return params.row.savings && params.row.savings.currentAmount 
        //     }
        // },
        // {
        //     field: 'membershipStatus',
        //     headerName: t('membership_status'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         if (params.value === 0) {
        //             return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>{t('active')}</Typography>
        //         }
        //         else if (params.value === 1) {
        //             return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>{t('inactive')}</Typography>
        //         }
        //     }
        // },
        // {
        //     field: 'status',
        //     headerName: t('status'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         if (params.value === 0) {
        //             return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>{t('active')}</Typography>
        //         }
        //         else if (params.value === 1) {
        //             return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>{t('inactive')}</Typography>
        //         }
        //         else if (params.value === 2) {
        //             return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>{t('death')}</Typography>
        //         }
        //     }
        // },
        ...(admin ? [
            {
                field: 'withdrawal',
                headerName: t('withdrawal'),
                sortable: false,
                width: 55,
                renderCell: (params) => {
                    return <ViewButton id={params.id} edit={true} setEditOpen={setEditOpen} setSelectedShareholderId={setSelectedShareholderId} />;
                },
            },
            {
                field: 'moveToAmanat',
                headerName: t('move_to_amanat'),
                sortable: false,
                width: 55,
                renderCell: (params) => {
                    return <MoveToAmanatButton id={params.id} setMoveToAmanatOpen={setMoveToAmanatOpen} setSelectedShareholderId={setSelectedShareholderId} />;
                },
            },
            {
                field: 'transfer_saving_amount_to_amanat',
                headerName: t('transfer_saving_amount_to_amanat'),
                sortable: false,
                width: 55,
                renderCell: (params) => {
                    return <MoveCurrentSavingsToAmanatButton
                        id={params.id}
                        setMoveCurrentSavingsToAmanatOpen={setMoveCurrentSavingsToAmanatOpen}
                        setSelectedShareholderId={setSelectedShareholderId}
                    />;
                },
            }
        ] : []),


    ];

    const [editOpen, setEditOpen] = useState(false);
    const handleWithdraw = (user) => {
        setSelectedShareholderId(user);
        setEditOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData, pageNo, pageSize]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });

    const handleClose = () => {
        setEditOpen(false)
        setSelectedShareholderId(null)
        fetchData();
    }
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    const confirmWithdraw = async () => {
        if (selectedShareholderId) {
            try {
                const response = await axiosInstance.post(`/shareholder/withdrawsavings/${selectedShareholderId}`, { adminId: adminId });
                //console.log("response: " + JSON.stringify(response));
                // Close dialog and refresh data or any additional state updates
                setEditOpen(false);
                setSelectedShareholderId(null);


            } catch (error) {
                console.error("Deletion error:", error);
                setEditOpen(false);
                setSelectedShareholderId(null);
            }
        }
    };

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const isRtl = i18n.dir() === 'rtl';
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const getCSV = () => {
        const filterParams = new URLSearchParams(filters).toString();
        const queryString = `shareholder-savings/?${filterParams}`;
        axiosInstance.get(queryString, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                saveAs(blob, "savings_shareholder.csv");
            })
            .catch(error => console.error('Download error!', error));
    };
    const handleSearch = () => {
        setFilters(filters);
        fetchData();
    };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>
            {showFilters && (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
                <TextField
                    label={t('serial')}
                    variant="outlined"
                    value={filters.membersCode}
                    onChange={(e) => setFilters({ ...filters, membersCode: e.target.value })}
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
                <Button variant="contained" onClick={handleSearch}>
                    {t('search')}
                </Button>
            </Box>)}
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600,
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('savings_withdrawal')}
                    </Typography>
                    <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0, display: 'none' }}>
                        <WithdrawalForm ref={componentRef} />
                    </Box>

                    {/* <Button variant='contained' onClick={() => { handlePrint() }}>{t('print_form')}</Button> */}
                    <Button variant='contained' onClick={() => { getCSV() }}>{t('export_csv')}</Button>
                    <BackButton />


                </Box>


                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newModel) => {
                        setPageNo(newModel.page);
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
                        direction: isRtl ? 'rtl' : 'ltr',
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
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: '1.25rem',
                            color: '#667085',
                            fontSize: '0.875rem'
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Box>
            {/* <WithdrawalModal savings={true} id={selectedShareholderId} open={editOpen} setOpen={setEditOpen} fetchData={fetchData} /> */}
            <MoveInterestToSavings savings={true} id={selectedShareholderId} open={editOpen} setOpen={setEditOpen} fetchData={fetchData} />

            <MoveSavingsToAmanatModal
                id={selectedShareholderId}
                open={moveToAmanatOpen}
                setOpen={setMoveToAmanatOpen}
                fetchData={fetchData}
            />
            <MoveCurrentSavingsToAmanatModal
                fetchData={fetchData}
                id={selectedShareholderId}
                open={moveCurrentSavingsToAmanatOpen}
                setOpen={setMoveCurrentSavingsToAmanatOpen}
            />
        </CacheProvider>

    )
}

export default SavingsWithdrawalPage