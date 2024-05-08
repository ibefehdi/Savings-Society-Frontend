import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AddTransactions from './AddTransactions';
const Transactions = () => {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [openModal, setOpenModal] = useState(false);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
    const cacheLtr = createCache({ key: 'muilt' });
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);


    const { data, fetchData, count } = useFetch(`/transactions`, pageNo, pageSize, { type: "Hall" });
    useEffect(() => { fetchData() }, [])
    const columns = [

        {
            field: 'buildingId.name',
            headerName: 'Building Name',
            flex: 1,
            valueGetter: (params) => params.row.buildingId?.name || '',
        },
        {
            field: 'buildingId.type',
            headerName: 'Building Type',
            flex: 1,
            valueGetter: (params) => params.row.buildingId?.type || '',
        },
        {
            field: 'bookingId.date',
            headerName: 'Booking Date',
            flex: 1,
            renderCell: (params) => {
                
                const date = new Date(params?.row?.bookingId?.date);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear().toString();
                const formattedDate = `${day}/${month}/${year}`;
                return formattedDate;
            }
        },
        {
            field: 'bookingId.startTime',
            headerName: 'Start Time',
            flex: 1,
            valueGetter: (params) => params.row.bookingId?.startTime || '',
        },
        {
            field: 'bookingId.endTime',
            headerName: 'End Time',
            flex: 1,
            valueGetter: (params) => params.row.bookingId?.endTime || '',
        },
        {
            field: 'bookingId.rate',
            headerName: 'Booking Rate',
            flex: 1,
            valueGetter: (params) => params.row.bookingId?.rate || '',
        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            valueGetter: (params) => params.row.amount || '',
        },
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            renderCell: (params) => {
                if (params.value) {
                    const date = new Date(params.value);
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear().toString();
                    const formattedDate = `${day}/${month}/${year}`;
                    return formattedDate;
                }
                return '';
            }
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            valueGetter: (params) => params.row.type || '',
        },
        {
            field: 'transactionFrom',
            headerName: 'Transaction From',
            flex: 1,
            valueGetter: (params) => params.row.transactionFrom || '',
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
            valueGetter: (params) => params.row.description || '',
        },
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     flex: 1,
        //     renderCell: (params) => (
        //         <Button
        //             variant="contained"
        //             color="primary"
        //             startIcon={<VisibilityIcon />}
        //             onClick={() => navigate(`/transaction/${params.row._id}`)}
        //         >
        //             {t('view')}
        //         </Button>
        //     ),
        // },
    ];
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>

                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                        {t('Transactions')}
                    </Typography>

                    <Button onClick={() => setOpen(true)} variant="contained">
                        {t('add')}
                    </Button>

                </Box>


                <DataGrid
                    rows={data}
                    columns={columns.map((column) => ({
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
                    }}
                />

            </Box>
            <AddTransactions fetchData={fetchData} setOpen={setOpen} open={open} />

        </CacheProvider >)
}

export default Transactions