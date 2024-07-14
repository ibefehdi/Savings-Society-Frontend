import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import { AREAS } from '../../constants/areaConstants';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useReactToPrint } from 'react-to-print';
import ReactToPrint from 'react-to-print';
import { DataGrid, GridFooter, GridFooterContainer } from '@mui/x-data-grid';
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
const FinancialReportingAmanat = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const { data, fetchData, count, updateFilters, filters, grandTotal } = useFetchNoPagination('/financialReportsbyamanat');
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
            field: 'amanatAmount',
            headerName: t('amanat'),
            flex: 1,
            renderCell: (params) =>
                params.row.amanatAmount
                    ? params.row.amanatAmount.toFixed(3)
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
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const year = new Date().getFullYear();
    const CustomFooter = () => (
        <GridFooterContainer>
            <GridFooter />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', padding: '1rem' }}>
                <Typography variant="h6" component="p">
                    <strong>{t('grand_total')}:</strong> {grandTotal}
                </Typography>
            </Box>
        </GridFooterContainer>
    );


    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>

            {showFilters && (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
                <TextField
                    label={t('serial')}
                    variant="outlined"
                    onChange={(e) => updateFilters({ membersCode: e.target.value })}
                    fullWidth
                    autoComplete='off'
                />
                <TextField
                    label={t('first_name')}
                    variant="outlined"
                    onChange={(e) => updateFilters({ fName: e.target.value })}
                    fullWidth
                    autoComplete='off'

                />
                <TextField
                    label={t('last_name')}
                    variant="outlined"
                    onChange={(e) => updateFilters({ lName: e.target.value })}
                    fullWidth
                    autoComplete='off'

                />
                <TextField
                    label={t('civil_id')}
                    variant="outlined"
                    onChange={(e) => updateFilters({ civilId: e.target.value })}
                    fullWidth
                    autoComplete='off'

                />
                <TextField
                    label={t('gender')}
                    variant="outlined"
                    select
                    onChange={(e) => updateFilters({ gender: e.target.value })}
                    fullWidth
                    autoComplete='off'

                >
                    <MenuItem value={"male"}>{t('Male')}</MenuItem>
                    <MenuItem value={"female"}>{t('Female')}</MenuItem>
                </TextField>
                {/* <TextField
                    label={t('status')}
                    variant="outlined"
                    select
                    onChange={(e) => updateFilters({ status: e.target.value })}
                    fullWidth
                    autoComplete='off'

                >
                    <MenuItem value={0}>{t('active')}</MenuItem>
                    <MenuItem value={1}>{t('inactive')}</MenuItem>
                    <MenuItem value={2}>{t('death')}</MenuItem>
                </TextField> */}

                <TextField
                    label={t('area')}
                    variant="outlined"
                    select
                    value={filters.area}
                    onChange={(e) => updateFilters({ ...filters, area: e.target.value })}
                    fullWidth
                    autoComplete='off'
                >
                    {AREAS.map((area) => (
                        <MenuItem key={area.value} value={area.value}>
                            {area.description}
                        </MenuItem>
                    ))}
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
                        {t('financial_reporting')} <span style={{
                            fontSize: '0.875rem',
                            marginLeft: '0.5rem',
                            marginRight: '0.5rem',
                            color: '#999'
                        }}>/ {year}</span>
                    </Typography>


                    <Button variant='contained' onClick={() => { handlePrint() }}>{t('print_form')}</Button>
                </Box>

                <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0, display: 'none' }}>
                    <ReactToPrint
                        trigger={() => <button>Print this out!</button>}
                        content={() => componentRef.current}
                    />
                    <PrintDataGrid ref={componentRef} data={data} filters={filters} grandTotal={grandTotal} />
                </Box>
                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    getRowId={(row) => row._id}
                    rowCount={count}
                    paginationMode="server"
                    components={{ Footer: CustomFooter }}

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


export default FinancialReportingAmanat