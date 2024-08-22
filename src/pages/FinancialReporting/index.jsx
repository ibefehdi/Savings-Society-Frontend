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
import axiosInstance from '../../constants/axiosInstance';
import BackButton from '../../components/BackButton';
const FinancialReporting = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const { data, fetchData, count, updateFilters, filters, grandTotal } = useFetchNoPagination('/financialReports');
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
            field: 'initialShareAmount',
            headerName: t('share'),
            flex: 1,
            renderCell: (params) => {
                return Math.floor(params.row.shareDetails?.totalAmount)

            },
        },
        // {
        //     field: 'civilId',
        //     headerName: t('civil_id'),
        //     flex: 1,
        // },
        // {
        //     field: 'initialInvestment',
        //     headerName: t('initial_investment'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         return params.row.savingsDetails?.initialAmount
        //             ? params.row.savingsDetails.initialAmount 
        //             : 'N/A';
        //     },
        // },
        {
            field: 'currentAmount',
            headerName: t('savings'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savingsCurrentAmount
                    ? params.row.savingsCurrentAmount
                    : 'N/A';
            },
        },
        {
            field: 'shareIncrease',
            headerName: t('share_increase'),
            flex: 1,
            renderCell: (params) => {
                return params.row.shareDetails
                    ? params.row.shareDetails?.shareIncrease
                    : 'N/A';
            },
        },
        // {
        //     field: 'year',
        //     headerName: t('year'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         return params.row.savingsDetails?.year || 'N/A';
        //     },
        // },
        {
            field: 'savingsIncrease',
            headerName: t('savings_increase'),
            flex: 1,
            renderCell: (params) => {
                return params.row.savingsIncrease
                    ? params.row.savingsIncrease
                    : 'N/A';
            },
        },
        {
            field: 'alajmali',
            headerName: t("alajmali"),
            flex: 1,
            renderCell: (params) => {
                const shareIncrease = params.row.totalShareIncrease || 0;
                const savingsIncrease = params.row.savingsIncrease || 0;
                const total = shareIncrease + savingsIncrease;
                return total !== 0 ? total : 'N/A';
            },
        },
        // {
        //     field: 'currentShareAmount',
        //     headerName: t('share_current_amount'),
        //     flex: 1,
        //     renderCell: (params) => {
        //         return params.row.shareDetails?.totalAmount
        //              ;
        //     },
        // },
        {
            field: 'amanatAmount',
            headerName: t('amanat'),
            flex: 1,
            renderCell: (params) =>
                params.row.amanatAmount
                    ? params.row.amanatAmount
                    : 'N/A',
        },
        {
            field: 'transferSavings',
            headerName: t('transfer_savings'),
            flex: 1,
            renderCell: (params) =>
                params.row.transferSavings
                    ? params.row.transferSavings
                    : 'N/A',
        },
        {
            field: 'total',
            headerName: t('total'),
            flex: 1,
            renderCell: (params) =>
                params.row.total ? params.row.total : 'N/A',
        },
    ];


    useEffect(() => {
        fetchData();
    }, [fetchData, filters]);

    const handleExport = async (format) => {
        try {
            const queryString = new URLSearchParams(filters).toString();

            const response = await axiosInstance.get(`/financialReports/export?format=${format}&${queryString}`, {
                responseType: 'blob', // Important for handling file downloads
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `financial_report.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error exporting ${format}:`, error);
            // Handle error (e.g., show an error message to the user)
        }
    };
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
    const year = new Date().getFullYear() - 1;
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
                {/* <TextField
                    label={t('membership_status')}
                    variant="outlined"
                    select
                    onChange={(e) => updateFilters({ membershipStatus: e.target.value })}
                    fullWidth
                    autoComplete='off'
                >
                    <MenuItem value={0}>{t('active')}</MenuItem>
                    <MenuItem value={1}>{t('inactive')}</MenuItem>
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


                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Button variant='contained' onClick={() => handleExport('csv')}>{t('export_csv')}</Button>
                        <Button variant='contained' onClick={() => handleExport('xlsx')}>{t('export_xlsx')}</Button>
                        <Button variant='contained' onClick={handlePrint}>{t('print_form')}</Button>
                        <BackButton />

                    </Box>
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
                    components={{ Footer: CustomFooter }}

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


export default FinancialReporting