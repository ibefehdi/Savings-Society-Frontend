import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import AddShareholderModal from './AddShareholderModal';
import { useNavigate } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditShareholderModal from './EditShareholderModal';
import { useTranslation } from 'react-i18next';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import axiosInstance from '../../constants/axiosInstance';
import { saveAs } from 'file-saver';
import DisableShareholderModal from './DisableShareholderModal';
import PersonAddAlt1 from '@mui/icons-material/PersonAddAlt1';
import EnableShareholder from './EnableShareholder';
import BackButton from '../../components/BackButton';
const DisabledShareholders = () => {
    const navigate = useNavigate();

    const ViewButton = ({ id, edit, setEditOpen, setSelectedShareholderId }) => {
        const navigate = useNavigate();

        const handleEditClick = () => {
            setSelectedShareholderId(id);
            setEditOpen(true);
        };

        return (
            <div>
                {edit ? (
                    <IconButton onClick={handleEditClick}>
                        <ModeEditIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={() => navigate(`/shareholderno/${id}`)}>
                        <VisibilityIcon />
                    </IconButton>
                )}
            </div>
        );
    };
    const DisableButton = ({ id, setDisableOpen, setSelectedShareholderId }) => {
        const handleDisableClick = () => {
            setSelectedShareholderId(id);
            setDisableOpen(true);
        };

        return (
            <IconButton onClick={handleDisableClick}>
                <PersonAddAlt1 />
            </IconButton>
        );
    };


    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [disableOpen, setDisableOpen] = useState(false);
    const [filters, setFilters] = useState({
        fName: '',
        lName: '',
        membershipStatus: 1,
        workplace: '',
        civilId: '',
        membersCode: ''
    });
    const { data, fetchData, count } = useFetch('/shareholders', pageNo + 1, pageSize, filters);
    const [selectedShareholderId, setSelectedShareholderId] = useState(null);
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    // const { data: workplaces, fetchData: workplaceFetchData, count: workplaceCount, updateFilters, filters: workplaceFilters } = useFetchNoPagination('/financialreportbyworkplace');
    const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')));
    const [permissions, setPermissions] = useState(userData?.permissions);
    const [showFilters, setShowFilters] = useState(false);
    const [workplaces, setWorkplaces] = useState();
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });

    const columns = [
        // define your columns here
        {
            field: 'membersCode',
            headerName: t('serial'),
            flex: 1,
        },
        {
            field: 'Full Name',
            headerName: t('full_name'),
            flex: 3.2,
            renderCell: (params) => `${params?.row?.fName} ${params?.row?.lName}`,
        },
        {
            field: 'DOB',
            headerName: t('date_of_birth'),
            flex: 1.5,
            renderCell: (params) => {
                const date = new Date(params.value);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear().toString();
                return `${day}/${month}/${year}`;
            },
        },
        {
            field: 'civilId',
            headerName: t('civil_id'),
            flex: 2,
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
                return `${day}/${month}/${year}`;
            },
        },
        {
            field: 'ibanNumber',
            headerName: t('iban'),
            flex: 2,
            renderCell: (params) => <Typography variant='p' sx={{ color: "#10A760" }}>{params.value}</Typography>,
        },
        {
            field: 'mobileNumber',
            headerName: t('phone_number'),
            flex: 1.50,
            renderCell: (params) => params?.row?.mobileNumber || "N/A",
        },
        {
            field: 'address',
            headerName: t('address'),
            flex: 2,
            renderCell: (params) => {
                const { block, street, house, avenue, city } = params.value;
                return `Block ${block}, Street ${street}, House ${house}, Avenue ${avenue}, City ${city}`;
            },
        },
        {
            field: 'savingsForShareholder',
            headerName: t('savings'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savings && params.row.savings?.totalAmount
            }
        },
        // {
        //     field: 'initialInvestment',
        //     headerName: t('initial_investment'),
        //     flex: 1,
        //     renderCell: (params) => params?.row.savings?.initialAmount?  || "N/A",
        // },
        // {
        //     field: 'currentAmount',
        //     headerName: t('current_amount'),
        //     flex: 1,
        //     renderCell: (params) => params?.row?.savings?.currentAmount?  || "N/A",
        // },
        {
            field: 'status',
            headerName: t('status'),
            flex: 1,
            renderCell: (params) => {
                if (params.value === 0) {
                    return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>{t('active')}</Typography>
                }
                else if (params.value === 1) {
                    return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>{t('inactive')}</Typography>
                }
                else if (params.value === 2) {
                    return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>{t('death')}</Typography>
                }
            }
        },
        ...(permissions?.shareholder?.view ? [{
            field: 'view',
            headerName: t('view'),
            sortable: false,
            width: 55,
            renderCell: (params) => <ViewButton id={params.id} />,
        }] : []),
        ...(permissions?.shareholder?.edit ? [{
            field: 'edit',
            headerName: t('edit'),
            sortable: false,
            width: 55,
            renderCell: (params) => <ViewButton id={params.id} edit={true} setEditOpen={setEditOpen} setSelectedShareholderId={setSelectedShareholderId} />,
        }] : []),
        {
            field: 'enable',
            headerName: t('enable'),
            sortable: false,
            width: 55,
            renderCell: (params) => <DisableButton id={params.id} setDisableOpen={setDisableOpen} setSelectedShareholderId={setSelectedShareholderId} />
        },

    ];

    useEffect(() => {
        fetchData();
    }, [pageNo, pageSize]);

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageNo(1);
        setPaginationModel({ ...paginationModel, pageSize: event.target.value });
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const getCSV = () => {
        const filterParams = new URLSearchParams(filters).toString();
        const queryString = `shareholdercsv/?${filterParams}`;
        axiosInstance.get(queryString, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                saveAs(blob, "inactive_shareholder.csv");
            })
            .catch(error => console.error('Download error!', error));
    };

    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const orderedColumns = isRtl ? [...columns].reverse() : columns;

    useEffect(() => {
        async function fetchWorkplaces() {
            const response = await axiosInstance.get('/workplacesdropdown');
            setWorkplaces(response?.data?.data);
        }
        fetchWorkplaces();
    }, []);
    const handleSearch = () => {
        setFilters(filters);
        fetchData();
      };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>
            {showFilters &&
                (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
                    <TextField
                        label={t('serial')}
                        variant="outlined"
                        value={filters.membersCode}
                        onChange={(e) => setFilters({ ...filters, membersCode: e.target.value })}
                        fullWidth
                        autoComplete='off'
                    />
                    <TextField
                        label={t('full_name')}
                        variant="outlined"
                        value={filters.fName}
                        onChange={(e) => setFilters({ ...filters, fName: e.target.value })}
                        fullWidth
                        autoComplete='off'

                    />
                    {/* <TextField
                    label={t('last_name')}
                    variant="outlined"
                    value={filters.lName}
                    onChange={(e) => setFilters({ ...filters, lName: e.target.value })}
                    fullWidth
                    autoComplete='off'
        
                  /> */}
                    <TextField
                        label={t('civil_id')}
                        variant="outlined"
                        value={filters.civilId}
                        onChange={(e) => setFilters({ ...filters, civilId: e.target.value })}
                        fullWidth
                        autoComplete='off'

                    />

                    <TextField
                        label={t('workplace')}
                        variant="outlined"
                        select
                        onChange={(e) => setFilters({ ...filters, workplace: e.target.value })}
                        fullWidth
                        autoComplete='off'
                        value={filters.workplace}
                    >
                        {workplaces.map((place) => (
                            <MenuItem key={place.description} value={place.description}>
                                {place.description}
                            </MenuItem>
                        ))}
                    </TextField>
                    {/* <TextField
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
                  </TextField> */}
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
                        {t('shareholders')}
                    </Typography>
                    <Box>
                        <Select value={pageSize} onChange={handlePageSizeChange} sx={{ ml: '1rem', mr: '1rem' }}>
                            <MenuItem value={10}>10 {t('per_page')}</MenuItem>
                            <MenuItem value={25}>25 {t('per_page')}</MenuItem>
                            <MenuItem value={50}>50 {t('per_page')}</MenuItem>
                        </Select>
                        <Button variant='contained' onClick={() => { getCSV() }}>{t('export_csv')}</Button>
                        <BackButton />


                    </Box>



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
                        direction: isRtl ? 'rtl' : 'ltr',
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
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: '1.25rem',
                            color: '#667085',
                            fontSize: '0.875rem',
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '1rem',
                            fontWeight: 'bold',

                        },

                    }}
                />
            </Box>
            <AddShareholderModal open={open} setOpen={setOpen} fetchData={fetchData} />
            <EditShareholderModal open={editOpen} setOpen={setEditOpen} fetchData={fetchData} id={selectedShareholderId} />
            <EnableShareholder open={disableOpen} setOpen={setDisableOpen} fetchData={fetchData} id={selectedShareholderId} />

        </CacheProvider >)

}
export default DisabledShareholders