import React, { useEffect, useState } from 'react';
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
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AddNewFlat from './AddNewFlat';

const Flats = () => {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [openModal, setOpenModal] = useState(false);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
    const cacheLtr = createCache({ key: 'muilt' });
    const navigate = useNavigate();

    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const { data, fetchData, count } = useFetch(`/flatsbybuildingid/${selectedBuilding}`, pageNo, pageSize);
    useEffect(() => { fetchData() }, [selectedBuilding])
    const columns = [
        {
            field: 'flatNumber',
            headerName: t('flatNumber'),
            flex: 1,
            valueGetter: (params) => `${params.row.flatNumber}`
        },
        {
            field: 'vacant',
            headerName: t('vacant'),
            flex: 1,
            valueGetter: (params) => params.row.vacant ? 'Yes' : 'No'
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
            flex: 1,
            valueGetter: (params) => params.row.contract ? `${params.row.contract.rentAmount}` : ''
        },
        {
            field: 'actions',
            headerName: t('actions'),
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/rental/flat/${params.row._id}`)}
                >
                    {t('view')}
                </Button>
            ),
        },
    ];

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

    const handleBuildingChange = (event) => {
        setSelectedBuilding(event.target.value);
    };

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
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
                    >
                        <MenuItem value="">----{t('select_building')}----</MenuItem>
                        {buildings.map((building) => (
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
                </Box>

                {selectedBuilding && (
                    <DataGrid
                        rows={data}
                        columns={columns.map((column) => ({
                            ...column,
                            disableColumnMenu: true,
                        }))}
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
                        }}
                    />
                )}
            </Box>
            <AddNewFlat
                open={openModal}
                setOpen={setOpenModal}
                fetchData={fetchData}
                editMode={false}
            />        </CacheProvider>
    );
};

export default Flats;