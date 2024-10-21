import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteFlatModal from './DeleteFlatModal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import AddNewFlat from './AddNewFlat';
import RemoveTenantModal from './RemoveTenantModal';
import AssignTenantModal from './AssignTenantModal';
import BackButton from '../../components/BackButton';
import { saveAs } from 'file-saver';
const Flats = () => {
    const { id } = useParams();
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });
    const [openModal, setOpenModal] = useState(false);
    const [openRemoveTenantModal, setOpenRemoveTenantModal] = useState(false);
    const [openDeleteFlatModal, setOpenDeleteFlatModal] = useState(false);
    const [selectedFlatId, setSelectedFlatId] = useState(null);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
    const cacheLtr = createCache({ key: 'muilt' });
    const navigate = useNavigate();
    const [openAssignTenantModal, setOpenAssignTenantModal] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [editFlatData, setEditFlatData] = useState(null);
    const handleEdit = (flatData) => {
        setEditFlatData(flatData);
        setOpenModal(true);
    };
    const location = useLocation();
    const { data, fetchData, count } = useFetch(`/flatsbybuildingid/${selectedBuilding}`, pageNo + 1, pageSize);
    useEffect(() => { fetchData() }, [selectedBuilding, paginationModel])
    // Flats.jsx
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const buildingId = searchParams.get('buildingId');
        const page = parseInt(searchParams.get('page'), 10);
        const size = parseInt(searchParams.get('pageSize'), 10);

        if (buildingId) setSelectedBuilding(buildingId);
        if (!isNaN(page)) setPageNo(page);
        if (!isNaN(size)) setPageSize(size);

        setPaginationModel({
            pageSize: !isNaN(size) ? size : 10,
            page: !isNaN(page) ? page : 0,
        });
    }, [location.search]);
    const columns = [
        {
            field: 'flatNumber',
            headerName: t('flatNumber'),
            flex: 0.25,
            valueGetter: (params) => `${params?.row?.flatNumber ? params?.row?.flatNumber : "N/A"}`
        },
        {
            field: 'floorNumber',
            headerName: t('floorNumber'),
            flex: 0.25,
            valueGetter: (params) => `${params?.row?.floorNumber ? params?.row?.floorNumber : "N/A"}`
        },
        {
            field: 'vacant',
            headerName: t('vacant'),
            flex: 0.25,
            valueGetter: (params) => params.row.vacant ? 'Yes' : 'No'
        },
        {
            field: 'contract.expired',
            headerName: t('expired'),
            flex: 0.25,
            valueGetter: (params) => params.row.contract?.expired,
            renderCell: (params) => (
                <span style={{
                    color: params.value ? 'green' : 'red',
                    fontWeight: 'bold'
                }}>
                    {params.value ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            field: 'tenant.name',
            headerName: t('tenantName'),
            flex: 1,
            valueGetter: (params) => params.row.tenant ? `${params.row.tenant.name}` : ''
        },
        {
            field: 'contract.rentAmount',
            headerName: t('rentAmount'),
            flex: 0.3,
            valueGetter: (params) => params.row.contract ? `${params.row.contract.rentAmount}` : ''
        },
        {
            field: 'contract.startDate',
            headerName: t('startDate'),
            flex: 0.4,
            valueGetter: (params) => {
                const date = params?.row?.contract?.startDate;
                return date ? new Date(date).toLocaleDateString('en-GB') : '';
            }
        },
        {
            field: 'contract.endDate',
            headerName: t('endDate'),
            flex: 0.4,
            valueGetter: (params) => {
                const date = params?.row?.contract?.endDate;
                return date ? new Date(date).toLocaleDateString('en-GB') : '';
            }
        },
        {
            field: 'actions',
            headerName: t('actions'),
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/rental/flat/${params.row._id}?buildingId=${params.row.buildingId}`)}
                    >
                        {t('view')}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEdit(params.row)}
                        sx={{ marginLeft: '1rem' }}
                    >
                        {t('edit')}
                    </Button>
                    {params.row.vacant && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setSelectedFlatId(params.row._id);
                                setOpenAssignTenantModal(true);
                            }}
                            sx={{ marginLeft: '1rem', marginRight: '1rem' }}
                        >
                            {t('assignTenant')}
                        </Button>
                    )}
                    {!params.row.vacant && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setSelectedFlatId(params.row._id);
                                setOpenRemoveTenantModal(true);
                            }}
                            sx={{ marginLeft: '1rem', marginRight: '1rem' }}
                        >
                            {t('removeTenant')}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setSelectedFlatId(params.row._id);
                            setOpenDeleteFlatModal(true);
                        }}
                        sx={{ marginLeft: '1rem' }}
                    >
                        {t('delete')}
                    </Button>
                </Box>
            ),
        },
    ];
    const downloadCSV = () => {
        if (!selectedBuilding) {
            // Optionally, show an alert or notification that a building must be selected
            return;
        }

        axiosInstance.get(`/flatcsv/${selectedBuilding}`, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveAs(blob, `flats_building_${selectedBuilding}.xlsx`);
            })
            .catch(error => console.error('Download error!', error));
    };
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('/buildingdropdown');
                setBuildings(response?.data?.data);
                if (id) {
                    setSelectedBuilding(id);
                }
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };

        fetchBuildings();
    }, [id]);

    const handleBuildingChange = (event) => {
        setSelectedBuilding(event.target.value);
    };

    const handleRemoveTenant = async () => {
        try {
            await axiosInstance.get(`/removetenant/${selectedFlatId}`);
            setOpenRemoveTenantModal(false);
            fetchData();
        } catch (error) {
            console.error('Error removing tenant:', error);
        }
    };
    const handleDeleteFlat = async () => {
        try {
            await axiosInstance.delete(`/deleteflat/${selectedFlatId}`);
            setOpenDeleteFlatModal(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting flat:', error);
        }
    };
    const orderedColumns = isRtl ? [...columns].reverse() : columns;

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', }}>
                <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                    {t('flats')}
                </Typography>
                <Box
                    sx={{
                        width: '90%',
                        display: 'flex',
                        gap: '1rem',
                        backgroundColor: '#FFF',
                        marginLeft: '2rem',
                        marginTop: '2rem',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        overflowX: 'auto',
                        marginRight: isRtl ? "2rem" : 0
                    }}
                >
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
                        variant='contained'
                        onClick={() => setOpenModal(true)}
                    >
                        {t('add')}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={downloadCSV}
                        disabled={!selectedBuilding}
                    >
                        {t('export_xlsx')}
                    </Button>
                    <BackButton />

                </Box>

                {selectedBuilding && (
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
                                fontSize: '0.875rem'
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '1rem',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                )}
            </Box>
            <AddNewFlat
                open={openModal}
                setOpen={setOpenModal}
                fetchData={fetchData}
                editMode={!!editFlatData}
                flatData={editFlatData}
            />
            <RemoveTenantModal
                open={openRemoveTenantModal}
                handleClose={() => setOpenRemoveTenantModal(false)}
                handleRemoveTenant={handleRemoveTenant}
            />
            <AssignTenantModal
                open={openAssignTenantModal}
                handleClose={() => setOpenAssignTenantModal(false)}
                flatId={selectedFlatId}
                fetchData={fetchData}
            />
            <DeleteFlatModal
                open={openDeleteFlatModal}
                handleClose={() => setOpenDeleteFlatModal(false)}
                handleDeleteFlat={handleDeleteFlat}
            />
        </CacheProvider>
    );
};

export default Flats;
