import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { saveAs } from 'file-saver';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Modal, FormControl, InputLabel, Alert, Switch, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const TenantHistory = () => {
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
    const cacheLtr = createCache({ key: 'muilt' });
    const navigate = useNavigate();

    const [searchTenantName, setSearchTenantName] = useState('');
    const [searchFlatNumber, setSearchFlatNumber] = useState('');
    const [filters, setFilters] = useState({});
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingHistory, setEditingHistory] = useState(null);
    const [flats, setFlats] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [apiError, setApiError] = useState('');

    const [isNewTenant, setIsNewTenant] = useState(false);
    const [civilIdFile, setCivilIdFile] = useState(null);

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

    const selectedBuildingId = watch('buildingId');
    const selectedFlatId = watch('flatId');


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/tenant-histories', {
                params: {
                    page: pageNo + 1,
                    resultsPerPage: pageSize,
                    ...filters,
                    tenantName: searchTenantName,
                    flatNumber: searchFlatNumber,
                    buildingId: selectedBuilding
                }
            });
            setData(response.data.data);
            setCount(response.data.count);
        } catch (error) {
            console.error('Error fetching tenant history:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [pageNo, pageSize]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('/buildingdropdown');
                setBuildings(response?.data?.data);
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };

        fetchBuildings();
    }, []);

    useEffect(() => {
        const fetchFlats = async () => {
            try {
                if (selectedBuildingId) {
                    const response = await axiosInstance.get(`/flatsbybuildingid/${selectedBuildingId}`);
                    setFlats(response.data?.data);
                } else {
                    setFlats([]);
                }
            } catch (error) {
                console.error('Error fetching flats:', error);
            }
        };

        fetchFlats();
    }, [selectedBuildingId]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                if (selectedFlatId) {
                    const response = await axiosInstance.get(`/tenantsbyflatid/${selectedFlatId}`);
                    setTenants(response.data?.data);
                } else {
                    setTenants([]);
                }
            } catch (error) {
                console.error('Error fetching tenants:', error);
            }
        };

        fetchTenants();
    }, [selectedFlatId]);

    const handleSearchChange = (event, setter) => {
        setter(event.target.value);
        setPageNo(0);
        setFilters(prevFilters => ({ ...prevFilters, [event.target.name]: event.target.value }));
    };

    const handleBuildingChange = (event) => {
        setSelectedBuilding(event.target.value);
        setPageNo(0);
    };

    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageNo(0);
        setPaginationModel({ ...paginationModel, pageSize: event.target.value });
    };

    const handlePageChange = (newPage) => {
        setPageNo(newPage);
        setPaginationModel({ ...paginationModel, page: newPage });
    };

    const columns = [
        {
            field: 'tenantId.name',
            headerName: t('tenant_name'),
            flex: 1,
            valueGetter: (params) => params.row.tenantId?.name || '',
        },
        {
            field: 'flatId.flatNumber',
            headerName: t('flat_number'),
            flex: 1,
            valueGetter: (params) => params.row.flatId?.flatNumber || '',
        },
        {
            field: 'flatId.buildingId.name',
            headerName: t('building_name'),
            flex: 1,
            valueGetter: (params) => params.row.flatId?.buildingId?.name || '',
        },
        // {
        //     field: 'createdAt',
        //     headerName: t('date'),
        //     flex: 1,
        //     valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
        // },
        // {
        //     field: 'actions',
        //     headerName: t('actions'),
        //     flex: 1,
        //     renderCell: (params) => (
        //         <IconButton onClick={() => handleEditClick(params.row)}>
        //             <EditIcon />
        //         </IconButton>
        //     ),
        // },
    ];

    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setSearchTenantName('');
        setSearchFlatNumber('');
        setSelectedBuilding('');
        setFilters({});
        fetchData();
    };

    const getCSV = () => {
        const filterParams = new URLSearchParams(filters).toString();
        const queryString = `tenant-histories/export/?${filterParams}`;
        axiosInstance.get(queryString, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                saveAs(blob, "tenant_history.csv");
            })
            .catch(error => console.error('Download error!', error));
    };

    const handleEditClick = (history) => {
        setEditingHistory(history);
        setValue('buildingId', history.flatId.buildingId._id);
        setValue('flatId', history.flatId._id);
        setValue('tenantId', history.tenantId._id);
        setModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingHistory(null);
        setIsNewTenant(false);
        reset();
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        setCivilIdFile(e.target.files[0]);
    };
    const orderedColumns = isRtl ? [...columns].reverse() : columns;

    const onSubmit = async (data) => {
        setApiError('');
        try {
            if (editingHistory) {
                // Handle editing existing tenant history
                await axiosInstance.put(`/tenant-histories/${editingHistory._id}`, data);
            } else {
                // Handle creating new tenant and history
                const payload = {
                    name: data.name,
                    contactNumber: data.contactNumber,
                    civilId: data.civilId,
                    flatId: data.flatId
                };

                const response = await axiosInstance.post('/createTenantAndHistory', payload);

                console.log('New tenant and history created:', response.data);
            }
            setModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving tenant history:', error);
            setApiError(t('errorSavingTenantHistory'));
        }
    };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>
            {showFilters && (
                <Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
                    <TextField
                        label={t('tenant_name')}
                        variant="outlined"
                        name="tenantName"
                        value={searchTenantName}
                        onChange={(e) => handleSearchChange(e, setSearchTenantName)}
                        fullWidth
                    />
                    <TextField
                        label={t('flat_number')}
                        variant="outlined"
                        name="flatNumber"
                        value={searchFlatNumber}
                        onChange={(e) => handleSearchChange(e, setSearchFlatNumber)}
                        fullWidth
                    />
                    <Select
                        label={t('building')}
                        variant="outlined"
                        fullWidth
                        value={selectedBuilding || ""}
                        onChange={handleBuildingChange}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            ----{t('select_building')}----
                        </MenuItem>
                        {buildings
                            .filter(building => building.type === "Building")
                            .map((building) => (
                                <MenuItem key={building._id} value={building._id}>
                                    {building.name}
                                </MenuItem>
                            ))}
                    </Select>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                    >
                        {t('search')}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                    >
                        {t('clear_filters')}
                    </Button>
                </Box>
            )}

            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                        {t('tenant_history')}
                    </Typography>

                    <Button variant='contained' onClick={handleAddClick}>{t('add')}</Button>
                    {/* <Button variant='contained' onClick={() => { getCSV() }}>{t('export_csv')}</Button> */}

                    <BackButton />

                    <Select value={pageSize} onChange={handlePageSizeChange} sx={{ ml: '1rem', mr: '1rem' }}>
                        <MenuItem value={10}>10 {t('per_page')}</MenuItem>
                        <MenuItem value={25}>25 {t('per_page')}</MenuItem>
                        <MenuItem value={50}>50 {t('per_page')}</MenuItem>
                    </Select>
                </Box>

                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newModel) => {
                        handlePageChange(newModel.page);
                    }}
                    getRowId={(row) => row._id}
                    rowCount={count}
                    paginationMode="server"
                    loading={loading}
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
                            fontSize: '0.875rem'
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Box>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '2rem',
                    outline: 'none',
                    maxWidth: '90%',
                    maxHeight: '90%',
                    overflow: 'auto',
                    width: '500px',
                }}>
                    <Typography variant="h6" component="h2">
                        {editingHistory ? t('edit_tenant_history') : t('add_tenant_history')}
                    </Typography>
                    {apiError && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{apiError}</Alert>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth margin="normal" error={!!errors.buildingId}>
                            <InputLabel>{t('buildings')}</InputLabel>
                            <Controller
                                name="buildingId"
                                control={control}
                                rules={{ required: t('buildingRequired') }}
                                render={({ field }) => (
                                    <Select {...field}>
                                        {buildings.map((building) => (
                                            <MenuItem key={building._id} value={building._id}>
                                                {building.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.buildingId && <Typography color="error">{errors.buildingId.message}</Typography>}
                        </FormControl>
                        <FormControl fullWidth margin="normal" error={!!errors.flatId}>
                            <InputLabel>{t('flats')}</InputLabel>
                            <Controller
                                name="flatId"
                                control={control}
                                rules={{ required: t('flatRequired') }}
                                render={({ field }) => (
                                    <Select {...field} disabled={!selectedBuildingId}>
                                        {flats.map((flat) => (
                                            <MenuItem key={flat._id} value={flat._id}>
                                                {flat.flatNumber}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.flatId && <Typography color="error">{errors.flatId.message}</Typography>}
                        </FormControl>

                        {!editingHistory && (
                            <FormControlLabel
                                control={<Switch checked={isNewTenant} onChange={(e) => setIsNewTenant(e.target.checked)} />}
                                label={t('create_new_tenant')}
                            />
                        )}

                        
                            <>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: t('nameRequired') }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('tenant_name')}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="contactNumber"
                                    control={control}
                                    rules={{ required: t('contactNumberRequired') }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('contact_number')}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.contactNumber}
                                            helperText={errors.contactNumber?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="civilId"
                                    control={control}
                                    rules={{ required: t('civilIdRequired') }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('civil_id')}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.civilId}
                                            helperText={errors.civilId?.message}
                                        />
                                    )}
                                />
                               
                                
                            </>
                        

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setModalOpen(false)} sx={{ mr: 1 }}>{t('cancel')}</Button>
                            <Button type="submit" variant="contained">
                                {editingHistory ? t('save') : t('add')}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </CacheProvider>
    );
};

export default TenantHistory;