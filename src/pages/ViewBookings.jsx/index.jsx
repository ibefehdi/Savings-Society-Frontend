import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import BackButton from '../../components/BackButton';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
const ViewBookings = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    const { data, fetchData, count } = useFetch(`/bookingbyhall/${id}`, 1, 10);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => { console.log('Mounted') })
    const columns = [
        {
            field: 'dateOfEvent',
            headerName: t('date_of_event'),
            flex: 1,
            valueGetter: (params) => params.row.dateOfEvent ? new Date(params.row.dateOfEvent).toLocaleDateString() : ''
        },
        {
            field: 'date',
            headerName: t('booking_date'),
            flex: 1,
            valueGetter: (params) => new Date(params.row.date).toLocaleDateString()
        },

        {
            field: 'rate',
            headerName: t('rate'),
            flex: 1,
            valueGetter: (params) => `${params.row.rate}`
        },
        {
            field: 'customerName',
            headerName: t('tenantName'),
            flex: 1,
            valueGetter: (params) => params.row.customer?.name || ''
        },


    ];
    const orderedColumns = isRtl ? [...columns].reverse() : columns;

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>

            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '1.875rem',
                        flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('hall_bookings')}
                    </Typography>
                    <BackButton />
                </Box>
                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
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
            </Box>
        </CacheProvider>
    );
};

export default ViewBookings;