import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../constants/axiosInstance';
import BackButton from '../../components/BackButton';
const DepositHistory = () => {
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { t, i18n } = useTranslation();
    const { data, fetchData, count } = useFetch('/deposithistory', pageNo + 1, pageSize);
    useEffect(() => {
        fetchData();
    }, [pageNo, pageSize]);
    const columns = [
        {
            field: 'membersCode',
            headerName: t('serial'),
            flex: 1,
            valueGetter: (params) => params.row.shareholder?.membersCode || 'N/A'
        },
        {
            field: 'Full Name',
            headerName: t('full_name'),
            flex: 1,
            renderCell: (params) => {
                const { fName, lName } = params.row?.shareholder || {};
                return fName && lName ? `${fName} ${lName}` : 'N/A';
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
            field: 'depositDate',
            headerName: t('deposit_date'),
            flex: 1,
            valueGetter: (params) => {
                if (!params.row.depositDate) return 'N/A';
                const date = new Date(params.row.depositDate);
                if (isNaN(date.getTime())) return 'N/A';
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            field: 'newAmount',
            headerName: t('new_amount'),
            flex: 1,
            valueGetter: (params) => {
                const newAmount = Number(params.row?.newAmount);
                return !isNaN(newAmount) ? newAmount  : 'N/A';
            }
        },
        {
            field: 'admin',
            headerName: t('admin'),
            flex: 1,
            valueGetter: (params) => {
                const { fName, lName } = params.row.admin || {};
                return fName && lName ? `${fName} ${lName}` : 'N/A';
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
            const response = await axiosInstance.get(`/deposit-history-report?format=${format}`, {
                responseType: 'blob', // Important for handling file downloads
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `deposit_history_report.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error exporting ${format}:`, error);
            // Handle error (e.g., show an error message to the user)
        }
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
                        {t('deposit_history')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        {/* <Button variant='contained' onClick={() => handleExport('csv')}>{t('export_csv')}</Button> */}
                        <Button variant='contained' onClick={() => handleExport('xlsx')}>{t('export_xlsx')}</Button>
                        <BackButton />

                    </Box>

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

export default DepositHistory