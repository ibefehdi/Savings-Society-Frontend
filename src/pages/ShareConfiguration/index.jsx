import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import AddShareConfigurationModal from './AddShareConfigurationModal';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
const ShareConfiguration = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const [pageNo, setPageNo] = useState(1);
    const { t, i18n } = useTranslation();
    const [pageSize, setPageSize] = useState(10)
    const [editMode, setEditMode] = useState(false);
    const [shareConfigId, setShareConfigId] = useState();
    const { data, fetchData, count } = useFetch('/shareconfigs', pageNo, pageSize);
    const isRtl = i18n.dir() === 'rtl';

    const columns = [
        {
            field: 'year',
            headerName: t('year'),
            flex: 1,
        },
        {
            field: 'individualSharePercentage',
            headerName: t("interest_rate"),
            flex: 1,
            renderCell: (params) => {
                return `${params.value}%`
            }
        },
        {
            field: 'edit',
            headerName: t('edit'),
            flex: 1,
            width: 55,
            renderCell: (params) => {
                return (
                    <IconButton

                        onClick={() => { handleOpen(params.row) }}
                    >
                        <ModeEditIcon />
                    </IconButton>

                );
            },
        }
    ]
    useEffect(() => {
        fetchData();
    }, [fetchData])
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState();
    const handleOpen = (id) => {
        console.log("This is the id", id);
        if (id != null) {
            setEditMode(true)
            setShareConfigId(id?._id)
            setYear(id?.year)
        }
        setOpen(true);


    }
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('share_percentage')}
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
                    disableRowSelectionOnClick

                />

            </Box>
            <AddShareConfigurationModal year={year} open={open} setOpen={setOpen} fetchData={fetchData} setEditMode={setEditMode} shareConfigId={shareConfigId} editMode={editMode} />
        </CacheProvider>)
}

export default ShareConfiguration