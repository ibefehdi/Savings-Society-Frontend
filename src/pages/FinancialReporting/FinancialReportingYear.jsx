import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useReactToPrint } from 'react-to-print';
import ReactToPrint from 'react-to-print';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import PrintDataGrid from '../../printablePages/PrintDataGrid';
import { useFetchNoPagination } from '../../hooks/useFetchNoPagination';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
const FinancialReportingYear = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const { data, fetchData, count, updateFilters, filters } = useFetchNoPagination('/financialreportsbyyear');
    const navigate = useNavigate();

    const { i18n, t } = useTranslation()
    const columns = [
        {
            field: 'membersCode',
            headerName: t('serial'),
            flex: 1,
        },
        {
            field: 'fullName',
            headerName: t('full_name'),
            flex: 1,
        },
        {
            field: 'civilId',
            headerName: t('civil_id'),
            flex: 1,
        },
        {
            field: 'initialInvestment',
            headerName: t('initial_investment'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savingsDetails?.initialAmount
                    ? params.row.savingsDetails.initialAmount.toFixed(3)
                    : 'N/A';
            },
        },
        {
            field: 'currentAmount',
            headerName: t('current_amount'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savingsDetails?.currentAmount
                    ? params.row.savingsDetails.currentAmount.toFixed(3)
                    : 'N/A';
            },
        },
        {
            field: 'year',
            headerName: t('year'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savingsDetails?.year || 'N/A';
            },
        },
        {
            field: 'savingsIncrease',
            headerName: t('savings_increase'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savingsIncrease
                    ? params.row.savingsIncrease.toFixed(3)
                    : 'N/A';
            },
        },
        {
            field: 'initialShareAmount',
            headerName: t('share_initial_amount'),
            flex: 1,
            renderCell: (params) => {
                return params.row.shareDetails?.reduce(
                    (total, share) => total + share.initialAmount,
                    0
                ).toFixed(3);
            },
        },
        {
            field: 'currentShareAmount',
            headerName: t('share_current_amount'),
            flex: 1,
            renderCell: (params) => {
                return params.row.shareDetails?.reduce(
                    (total, share) => total + share.currentAmount,
                    0
                ).toFixed(3);
            },
        },
        {
            field: 'shareIncrease',
            headerName: t('share_increase'),
            flex: 1,
            renderCell: (params) => {
                return params.row.totalShareIncrease
                    ? params.row.totalShareIncrease.toFixed(3)
                    : 'N/A';
            },
        },
        {
            field: 'amanatAmount',
            headerName: t('amanat'),
            flex: 1,
            renderCell: (params) =>
                params.row.savings && params.row.savings.amanat
                    ? params.row.savings.amanat.amount.toFixed(3)
                    : 'N/A',
        },
        {
            field: 'total',
            headerName: t('total'),
            flex: 1,
            renderCell: (params) =>
                params.row.total ? params.row.total.toFixed(3) : 'N/A',
        },
    ];


    useEffect(() => {
        fetchData();
    }, [filters]);


    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };


    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const isRtl = i18n.dir() === 'rtl';

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>

            {showFilters && (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>

                <TextField
                    label={t('year')}
                    variant="outlined"
                    select
                    onChange={(e) => updateFilters({ year: e.target.value })}
                    fullWidth
                    autoComplete='off'
                >
                    {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        );
                    })}
                </TextField>

            </Box>)}
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600,
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('financial_reporting')}
                    </Typography>


                    <Button variant='contained' onClick={() => { handlePrint() }}>{t('print_form')}</Button>
                </Box>

                <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0, display: 'none' }}>
                    <ReactToPrint
                        trigger={() => <button>Print this out!</button>}
                        content={() => componentRef.current}
                    />
                    <PrintDataGrid ref={componentRef} data={data} filters={filters} />
                </Box>
                <DataGrid
                    rows={data}
                    columns={columns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    getRowId={(row) => row._id}
                    rowCount={count}
                    paginationMode="server"
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
                    }}
                />
            </Box>
        </CacheProvider>

    )
}

export default FinancialReportingYear