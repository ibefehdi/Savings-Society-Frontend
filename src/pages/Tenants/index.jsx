import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { saveAs } from 'file-saver';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GetAppIcon from '@mui/icons-material/GetApp';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Link } from '@mui/material';
import BackButton from '../../components/BackButton';
import { useFetchTenant } from '../../hooks/useFetchTenant';
const Tenants = () => {
    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [openModal, setOpenModal] = useState(false);
    const { t, i18n } = useTranslation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingTenant, setDeletingTenant] = useState(null);
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
    const cacheLtr = createCache({ key: 'muilt' });
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [civilIdFile, setCivilIdFile] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchContactNumber, setSearchContactNumber] = useState('');
    const handleEditClick = (tenant) => {
        setEditingTenant(tenant);
        setEditModalOpen(true);
    };
    const buttonSx = {
        fontSize: '1.1rem',
        fontWeight: 600
    };

    // Updated styles for text fields
    const textFieldSx = {
        '& .MuiInputLabel-root': {
            fontSize: '1.1rem',
            fontWeight: 500
        },
        '& .MuiInputBase-input': {
            fontSize: '1.1rem',
            fontWeight: 500
        }
    };

    // Updated styles for select
    const selectSx = {
        '& .MuiSelect-select': {
            fontSize: '1.1rem',
            fontWeight: 500
        },
        '& .MuiMenuItem-root': {
            fontSize: '1.1rem',
            fontWeight: 500
        }
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', editingTenant.name);
            formData.append('contactNumber', editingTenant.contactNumber);
            formData.append('civilId', editingTenant.civilId);
            formData.append('flatId', editingTenant.flatId._id);

            if (civilIdFile) {
                formData.append('civilIdDocument', civilIdFile);
            }

            const response = await axiosInstance.put(`/editTenant/${editingTenant._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setEditModalOpen(false);
            setCivilIdFile(null);
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Error updating tenant:", error);
        }
    };
    const [searchCivilId, setSearchCivilId] = useState('');
    const [filters, setFilters] = useState({});
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const { data, fetchData, count, loading } = useFetchTenant(
        `/active_tenants?sortField=name&sortOrder=asc`,
        pageNo + 1,
        pageSize,
        { ...filters, searchCivilId, searchName, searchContactNumber, buildingId: selectedBuilding }
    );
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
    const handleSearchChange = (event) => {
        setSearchCivilId(event.target.value);
        setPageNo(0);
        setFilters(prevFilters => ({ ...prevFilters, searchCivilId: event.target.value }));
    };

    const handleNameSearchChange = (event) => {
        setSearchName(event.target.value);
        setPageNo(0);
        setFilters(prevFilters => ({ ...prevFilters, searchName: event.target.value }));
    };

    const handleContactNumberSearchChange = (event) => {
        setSearchContactNumber(event.target.value);
        setPageNo(0);
        setFilters(prevFilters => ({ ...prevFilters, searchContactNumber: event.target.value }));
    };

    // const handleSearch = () => {
    //     fetchData();
    // };
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });
    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageNo(1);
        setPaginationModel({ ...paginationModel, pageSize: event.target.value });
    };
    const handlePageChange = (newPage) => {
        setPageNo(newPage);
        setPaginationModel({ ...paginationModel, page: newPage });
    };
    const handleViewDocument = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleBuildingChange = (event) => {
        setSelectedBuilding(event.target.value);
        setPageNo(0);
    };
    const columns = [
        {
            field: 'name',
            headerName: t('tenant_name'),
            flex: 1,
            valueGetter: (params) => params.row.name || '',
        },
        {
            field: 'contactNumber',
            headerName: t('contact_number'),
            flex: 1,
            valueGetter: (params) => params.row.contactNumber || '',
        },
        {
            field: 'civilId',
            headerName: t('civil_id'),
            flex: 1,
            valueGetter: (params) => params.row.civilId || '',
        },
        {
            field: 'tenantFrom',
            headerName: t('tenant_from'),
            flex: 1,
            valueGetter: (params) => {
                const tenantFrom = params.row.tenantFrom || '';
                if (tenantFrom === 'Hall') {
                    return t('halls');
                } else if (tenantFrom === 'Flat') {
                    return t('flats');
                }
                return tenantFrom;
            },
        },
        {
            field: "flatId.buildingId.name",
            headerName: t('building_name'),
            flex: 1,
            valueGetter: (params) => params.row.flatId?.buildingId?.name
        },
        {
            field: 'flatId.number',
            headerName: t('flat_number'),
            flex: 1,
            valueGetter: (params) => params.row.flatId?.flatNumber || '',
        },
        // {
        //     field: 'civilIdDocument',
        //     headerName: t('civil_id_document'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         if (params.row.civilIdDocument && Object.keys(params.row.civilIdDocument).length > 0) {
        //             return <IconButton
        //                 component="a"
        //                 href={params.row.civilIdDocument.path}
        //                 download
        //                 title={t('download_civil_id')}
        //             >
        //                 <GetAppIcon />
        //             </IconButton>
        //         }
        //         return null;
        //     },
        // },
        {
            field: 'actions',
            headerName: t('actions'),
            flex: 1,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },

    ];
    const handleDeleteClick = (tenant) => {
        setDeletingTenant(tenant);
        setDeleteModalOpen(true);
    };
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setSearchCivilId('');
        setSearchName('');
        setSearchContactNumber('');
        setSelectedBuilding('');
        setFilters({});
        fetchData();
    };

    const handleDeleteSubmit = async () => {
        try {
            await axiosInstance.delete(`/deleteTenant/${deletingTenant._id}`);
            setDeleteModalOpen(false);
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Error deleting tenant:", error);
        }
    };
    const handleFileChange = (e) => {
        setCivilIdFile(e.target.files[0]);
    };
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const DeleteTenantModal = () => (
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
            <DialogTitle>{t('delete_tenant')}</DialogTitle>
            <DialogContent>
                <Typography>{t('are_you_sure_delete_tenant')}</Typography>
            </DialogContent>
            <DialogActions>
                <Button sx={{
                    ...buttonSx,

                }} onClick={() => setDeleteModalOpen(false)}>{t('cancel')}</Button>
                <Button sx={{
                    ...buttonSx,

                }} onClick={handleDeleteSubmit} variant="contained" color="error">{t('delete')}</Button>
            </DialogActions>
        </Dialog>
    );
    const EditTenantModal = () => (
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <DialogTitle>{t('edit_tenant')}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleEditSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('building_name')}
                        value={editingTenant?.flatId?.buildingId?.name || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('tenant_name')}
                        value={editingTenant?.name || ''}
                        onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('phone_number')}
                        value={editingTenant?.contactNumber || ''}
                        onChange={(e) => setEditingTenant({ ...editingTenant, contactNumber: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('civil_id')}
                        value={editingTenant?.civilId || ''}
                        onChange={(e) => setEditingTenant({ ...editingTenant, civilId: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('flat_number')}
                        value={editingTenant?.flatId?.flatNumber || ''}
                        onChange={(e) => setEditingTenant({ ...editingTenant, flatId: { ...editingTenant.flatId, flatNumber: e.target.value } })}
                    />
                    <Box sx={{ mt: 2 }}>
                        <input
                            accept="image/*,application/pdf"
                            style={{ display: 'none' }}
                            id="civilIdDocument"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="civilIdDocument">
                            <Button sx={{
                                ...buttonSx,

                            }} variant="contained" component="span">
                                {t('civil_id_document')}
                            </Button>
                        </label>
                        {civilIdFile && <Typography variant="body2">{civilIdFile.name}</Typography>}
                    </Box>
                    {editingTenant?.civilIdDocument?.path && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">{t('current_document')}:</Typography>
                            <Link href={editingTenant.civilIdDocument.path} target="_blank" rel="noopener noreferrer">
                                {t('view_current_document')}
                            </Link>
                        </Box>
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button sx={{
                    ...buttonSx,

                }} onClick={() => setEditModalOpen(false)}>{t('cancel')}</Button>
                <Button sx={{
                    ...buttonSx,

                }} onClick={handleEditSubmit} variant="contained">{t('save')}</Button>
            </DialogActions>
        </Dialog>
    );
    const getCSV = () => {
        const filterParams = new URLSearchParams();
        
        // Add all current filter parameters to the export request
        if (searchCivilId) filterParams.append('searchCivilId', searchCivilId);
        if (searchName) filterParams.append('searchName', searchName);
        if (searchContactNumber) filterParams.append('searchContactNumber', searchContactNumber);
        if (selectedBuilding) filterParams.append('buildingId', selectedBuilding);
        
        const queryString = `activetenants/export/?${filterParams.toString()}`;
        axiosInstance.get(queryString, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveAs(blob, "active_tenants.xlsx");
            })
            .catch(error => console.error('Download error!', error));
    };
    const handleSearchInputChange = (event) => {
        setSearchCivilId(event.target.value);
    };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Button onClick={toggleFilters} variant="outlined" sx={{ ...buttonSx, backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>
            {showFilters && (
                <Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
                    <TextField
                        label={t('civil_id')}
                        variant="outlined"
                        value={searchCivilId}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                    <TextField
                        label={t('tenant_name')}
                        variant="outlined"
                        value={searchName}
                        onChange={handleNameSearchChange}
                        fullWidth
                    />
                    <TextField
                        label={t('phone_number  ')}
                        variant="outlined"
                        value={searchContactNumber}
                        onChange={handleContactNumberSearchChange}
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
                        sx={{
                            ...buttonSx,

                        }}
                    >
                        {t('search')}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        sx={{
                            ...buttonSx,

                        }}
                    >
                        {t('clear_filters')}
                    </Button>
                </Box>
            )}

            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>

                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>

                    <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                        {t('tenants')}
                    </Typography>



                    {/* <Button onClick={() => setOpen(true)} variant="contained">
                        {t('add')}
                    </Button> */}
                    <Button sx={{
                        ...buttonSx,

                    }} variant='contained' onClick={() => { getCSV() }}>{t('export_xlsx')}</Button>

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
                            fontStyle: 'normal', // Sets the font style
                            fontWeight: 600, // Sets the font weight
                            lineHeight: '1.25rem',
                            color: '#667085',
                            fontSize: '0.875rem'
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '1rem', // Increase the font size of the data cells
                            fontWeight: 'bold', // Make the data text bolder
                        },
                    }}
                />

            </Box>
            <EditTenantModal />
            <DeleteTenantModal />

        </CacheProvider >
    )
}

export default Tenants