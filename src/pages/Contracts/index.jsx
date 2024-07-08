import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const Contracts = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });

    const [expired, setExpired] = useState(false);
    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const { t, i18n } = useTranslation();
    const [editMode, setEditMode] = useState(false);
    const [contractId, setContractId] = useState();
    const { data, fetchData, count } = useFetch('/contracts', pageNo + 1, pageSize, { expired });
    const isRtl = i18n.dir() === 'rtl';
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });
    const columns = [
        {
            field: 'flatNumber',
            headerName: t('flat_number'),
            flex: 1,
            valueGetter: (params) => params?.row?.flatId?.flatNumber,
        },
        {
            field: 'tenantName',
            headerName: t('tenant_name'),
            flex: 1,
            valueGetter: (params) => params.row.tenantId.name,
        },
        {
            field: 'startDate',
            headerName: t('start_date'),
            flex: 1,
            valueGetter: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: 'endDate',
            headerName: t('end_date'),
            flex: 1,
            valueGetter: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: 'rentAmount',
            headerName: t('rent_amount'),
            flex: 1,
        },
        {
            field: 'expired',
            headerName: t('expired'),
            flex: 1,
        },
        {
            field: 'collectionDay',
            headerName: t('collection_day'),
            flex: 1,
        },
        // {
        //     field: 'edit',
        //     headerName: t('edit'),
        //     flex: 1,
        //     width: 55,
        //     renderCell: (params) => {
        //         return (
        //             <IconButton onClick={() => console.log(params.id)}>
        //                 <ModeEditIcon />
        //             </IconButton>
        //         );
        //     },
        // },
    ];

    useEffect(() => {
        fetchData();
    }, [expired, paginationModel]);
    const orderedColumns = isRtl ? [...columns].reverse() : columns;

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: '100%' }}>
                    <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                        {t('contracts')}
                    </Typography>

                </Box>
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
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="expired-select-label">{t('status')}</InputLabel>
                        <Select
                            labelId="expired-select-label"
                            id="expired-select"
                            value={expired}
                            label={t('expired')}
                            onChange={(e) => setExpired(e.target.value)}
                            fullWidth={true}
                        >
                            <MenuItem value={false}>{t('active')}</MenuItem>
                            <MenuItem value={true}>{t('expired')}</MenuItem>
                        </Select>
                    </FormControl>

                </Box>

                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
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
        </CacheProvider>
    );
};

export default Contracts;
