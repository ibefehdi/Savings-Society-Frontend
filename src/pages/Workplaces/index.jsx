import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import NewWorkplaceModal from './NewWorkplaceModal';
import axiosInstance from '../../constants/axiosInstance';

const Workplaces = () => {
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);
    const { data, fetchData, count } = useFetch('/workplaces', pageNo, pageSize);
    const handleCreate = async (newWorkplace) => {
        try {
            const response = await axiosInstance.post('/workplace', newWorkplace);
            console.log('Workplace created successfully:', response.data);
        } catch (error) {
            console.error('Failed to create workplace:', error);
        }
        fetchData();

        handleClose();
    };
    const columns = [
        {
            field: 'description',
            headerName: t('description'),
            flex: 1,
        },
        {
            field: 'nameArabic',
            headerName: t('nameArabic'),
            flex: 1,
            renderCell: (params) => {
                return `${params.value}`
            }
        },

    ]
    useEffect(() => {
        fetchData();
    }, [])
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
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
                        {t('Workplaces')}
                    </Typography>
                    <Button variant='contained' onClick={() => { handleOpen() }}>{t('add')}</Button>
                </Box>
                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    page={pageNo}

                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: pageSize,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
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
                    disableRowSelectionOnClick

                />

            </Box>
            <NewWorkplaceModal open={modalOpen} handleClose={handleClose} handleCreate={handleCreate} />

        </CacheProvider>)
}

export default Workplaces