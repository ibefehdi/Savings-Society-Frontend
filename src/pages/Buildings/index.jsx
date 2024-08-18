import React, { useEffect, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { DataGrid } from '@mui/x-data-grid';
import AddNewBuilding from './AddNewBuilding';
import EditBuilding from './EditBuilding';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import axiosInstance from '../../constants/axiosInstance';
import { saveAs } from 'file-saver';

const Buildings = () => {
    const [pageNo, setPageNo] = useState(0);
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(10);
    const { t, i18n } = useTranslation();
    const { data, fetchData, count } = useFetch('/buildings', pageNo + 1, pageSize);
    const isRtl = i18n.dir() === 'rtl';
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedBuildingId, setSelectedBuildingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const cacheLtr = createCache({
        key: 'muilt',
    });

    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });

    const columns = [
        {
            field: 'name',
            headerName: t('name'),
            flex: 1,
            valueGetter: (params) => `${params.row.name}`,
        },
        {
            field: 'floors',
            headerName: t('floors'),
            flex: 1,
            valueGetter: (params) => `${params.row.floors}`,
        },
        {
            field: 'type',
            headerName: t('type'),
            flex: 1,
            valueGetter: (params) => `${params.row.type}`,
        },
        {
            field: 'address',
            headerName: t('address'),
            flex: 1,
            renderCell: (params) => {
                const { block, street, house, avenue, city } = params.value;
                return `Block ${block}, Street ${street}, House ${house}, Avenue ${avenue}, City ${city}`;
            },
        },
        {
            field: 'actions',
            headerName: t('actions'),
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBuildingId(params.row._id);
                        setEditOpen(true);
                    }}
                >
                    {t('edit')}
                </Button>
            ),
        },
        // {
        //     field: 'gotoAddress',
        //     headerName: t('actions'),
        //     flex: 1,
        //     renderCell: (params) => (
        //         <Button
        //             variant="contained"
        //             onClick={() => {
        //                 navigate(`/rental/flats/${params.row._id}`);
        //             }}
        //         >
        //             {t('view_flats')}
        //         </Button>
        //     ),
        // },
    ];
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const getCSV = () => {
        const filterParams = new URLSearchParams().toString();
        const queryString = `building-export/?${filterParams}`;
        axiosInstance.get(queryString, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                saveAs(blob, "buildings.csv");
            })
            .catch(error => console.error('Download error!', error));
    };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600,
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('buildings')}
                    </Typography>
                    <Button onClick={() => setOpen(true)} variant="contained">
                        {t('add')}
                    </Button>
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
                    onRowClick={(params) => {
                        navigate(`/rental/flats/${params.row._id}`);
                    }}
                    rowCount={count}
                    paginationMode="server"
                    sx={{
                        backgroundColor: '#FFF',
                        padding: '1rem',
                        border: 'none',
                        direction: isRtl ? 'rtl' : 'ltr',
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
                        '& .MuiDataGrid-row': {
                            cursor: 'pointer',
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
            <AddNewBuilding fetchData={fetchData} setOpen={setOpen} open={open} />
            <EditBuilding
                fetchData={fetchData}
                setOpen={setEditOpen}
                open={editOpen}
                buildingId={selectedBuildingId}
            />
        </CacheProvider>
    );
};

export default Buildings;