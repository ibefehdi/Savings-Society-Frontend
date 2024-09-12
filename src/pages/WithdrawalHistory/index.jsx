import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../constants/axiosInstance';
import BackButton from '../../components/BackButton';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

const WithdrawalHistory = () => {
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { t, i18n } = useTranslation();
    const [filters, setFilters] = useState({
        membersCode: '',
        fullName: '',
        civilId: '',
        mobileNumber: '',
        type: '',
        withdrawalDate: '',
        newAmount: '',
        admin: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const { data, fetchData, count } = useFetch('/withdrawalhistory', pageNo + 1, pageSize, filters);
    useEffect(() => {
        fetchData();
    }, [pageNo, pageSize]);
    const toggleFilters = () => setShowFilters(!showFilters);

    const columns = [
        {
            field: 'membersCode',
            headerName: t('serial'),
            flex: 1,
            valueGetter: (params) => params.row.shareholder?.membersCode?.trim() || 'N/A'
        },
        {
            field: 'Full Name',
            headerName: t('full_name'),
            flex: 1,
            valueGetter: (params) => {
                const fName = params.row.shareholder?.fName;
                const lName = params.row.shareholder?.lName;
                return (fName && lName) ? `${fName} ${lName}`.trim() : 'N/A';
            }
        },
        {
            field: 'civilId',
            headerName: t('civil_id'),
            flex: 1,
            valueGetter: (params) => params.row.shareholder?.civilId || 'N/A'
        },
        {
            field: 'mobileNumber',
            headerName: t('phone_number'),
            flex: 1,
            valueGetter: (params) => params.row.shareholder?.mobileNumber || 'N/A'
        },
        {
            field: 'type',
            headerName: t('type'),
            flex: 1,
            valueGetter: (params) => params.row.type || 'N/A'
        },
        {
            field: 'withdrawaldate',
            headerName: t('withdrawal_date'),
            flex: 1,
            valueGetter: (params) => {
                if (!params.row.withdrawalDate) return 'N/A';
                const date = new Date(params.row.withdrawalDate);
                if (isNaN(date.getTime())) return 'N/A';
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            field: 'previousAmount',
            headerName: t('previous_amount'),
            flex: 1,
            valueGetter: (params) => {
                const previousAmount = Number(params.row?.previousAmount);
                return !isNaN(previousAmount) ? previousAmount.toFixed(3) : 'N/A';
            }
        },
        {
            field: 'newAmount',
            headerName: t('new_amount'),
            flex: 1,
            valueGetter: (params) => {
                const newAmount = Number(params.row?.newAmount);
                return !isNaN(newAmount) ? newAmount.toFixed(3) : 'N/A';
            }
        },
        {
            field: 'admin',
            headerName: t('admin'),
            flex: 1,
            valueGetter: (params) => {
                const fName = params.row.admin?.fName;
                const lName = params.row.admin?.lName;
                return (fName && lName) ? `${fName} ${lName}`.trim() : 'N/A';
            }
        }
    ];

    const isRtl = i18n.dir() === 'rtl';

    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: pageNo,
    });
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const handleExport = async (format) => {
        try {
            const response = await axiosInstance.get(`/withdrawal-history-report?format=${format}`, {
                responseType: 'blob', // Important for handling file downloads
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `withdrawal_history_report.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error exporting ${format}:`, error);
            // Handle error (e.g., show an error message to the user)
        }
    };
    const handleSearch = () => {
        setFilters(filters);
        fetchData();
    };
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
                        {t('withdrawal_history')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        {/* <Button variant='contained' onClick={() => handleExport('csv')}>{t('export_csv')}</Button> */}
                        <Button variant='contained' onClick={() => handleExport('xlsx')}>{t('export_xlsx')}</Button>
                        <BackButton />

                        <Button onClick={toggleFilters} variant="outlined" sx={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                            <FilterListOutlinedIcon /> {t('filter')}
                        </Button>
                    </Box>
                </Box>

                {showFilters && (
                    <Box sx={{ display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginBottom: '1rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                        <TextField
                            label={t('serial')}
                            variant="outlined"
                            value={filters.membersCode}
                            onChange={(e) => setFilters({ ...filters, membersCode: e.target.value })}
                            fullWidth
                            autoComplete='off'
                        />
                        <TextField
                            label={t('full_name')}
                            variant="outlined"
                            value={filters.fullName}
                            onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
                            fullWidth
                            autoComplete='off'
                        />
                        <TextField
                            label={t('civil_id')}
                            variant="outlined"
                            value={filters.civilId}
                            onChange={(e) => setFilters({ ...filters, civilId: e.target.value })}
                            fullWidth
                            autoComplete='off'
                        />
                        <TextField
                            label={t('phone_number')}
                            variant="outlined"
                            value={filters.mobileNumber}
                            onChange={(e) => setFilters({ ...filters, mobileNumber: e.target.value })}
                            fullWidth
                            autoComplete='off'
                        />
                        <TextField
                            label={t('type')}
                            variant="outlined"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            fullWidth
                            autoComplete='off'
                        />
                        <TextField
                            label={t('withdrawal_date')}
                            type="date"
                            variant="outlined"
                            value={filters.withdrawalDate}
                            onChange={(e) => setFilters({ ...filters, withdrawalDate: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <Button variant="contained" onClick={handleSearch}>
                            {t('search')}
                        </Button>
                    </Box>
                )}
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
                />
            </Box>
        </CacheProvider>

    )
}

export default WithdrawalHistory