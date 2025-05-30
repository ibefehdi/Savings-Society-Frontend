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
import BackButton from '../../components/BackButton';
import TransactionDetails from './TransactionDetails';
import { saveAs } from 'file-saver';

import TransactionDetailsModal from './TransactionDetails';
const Transactions = () => {
    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const [openModal, setOpenModal] = useState(false);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
    const cacheLtr = createCache({ key: 'muilt' });
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setDetailsModalOpen(true);
    };

    const handleCloseModal = () => {
        setDetailsModalOpen(false);
        setSelectedTransaction(null);
    };

    const { data, fetchData, count } = useFetch(`/transactions`, pageNo + 1, pageSize, { transactionType: "Income" });
    useEffect(() => {
        fetchData();
    }, [pageNo, pageSize]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });
    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageNo(1);
        setPaginationModel({ ...paginationModel, pageSize: event.target.value });
    };
    const columns = [

        {
            field: 'buildingId.name',
            headerName: t('building_name'),
            flex: 1,
            valueGetter: (params) => params.row.buildingId?.name || '',
        },
        {
            field: 'buildingId.type',
            headerName: t('building_type'),
            flex: 1,
            valueGetter: (params) => params.row.buildingId?.type || '',
        },


        {
            field: 'amount',
            headerName: t('income'),
            flex: 1,
            valueGetter: (params) => params.row.amount || '',
        },
        {
            field: 'date',
            headerName: t('date'),
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
        // {
        //     field: 'type',
        //     headerName: t('type'),
        //     flex: 1,
        //     valueGetter: (params) => params.row.type || '',
        // },
        {
            field: 'transactionFrom',
            headerName: t('transaction_from'),
            flex: 1,
            valueGetter: (params) => params.row.transactionFrom || '',
        },
        {
            field: 'description',
            headerName: t('description'),
            flex: 1,
            valueGetter: (params) => params.row.description || '',
        },
        {
            field: 'actions',
            headerName: t('actions'),
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleViewDetails(params.row)}
                >
                    {t('view')}
                </Button>
            ),
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
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const downloadCSV = () => {
        const queryParams = new URLSearchParams({ transactionType: 'Income' }).toString(); // Adjust as needed
        axiosInstance.get(`/transactionsexport?${queryParams}`, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveAs(blob, `transactions_income.xlsx`);
            })
            .catch(error => console.error('Download error!', error));
    };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>

                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                        {t('hall_transactions')}
                        <span>
                            /
                            <span style={{
                                fontSize: '1.875rem',
                                marginLeft: '0.5rem',
                                marginRight: '0.5rem',
                                color: '#999',
                                background: "yellow"
                            }}>
                                {t('income')}
                            </span>
                        </span>

                    </Typography>

                    <Button onClick={() => setOpen(true)} variant="contained">
                        {t('add')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={downloadCSV}
                        sx={{ marginRight: '1rem' }}
                    >
                        {t('export_xlsx')}
                    </Button>
                    <BackButton />

                    <Select value={pageSize} onChange={handlePageSizeChange} sx={{ ml: '1rem', mr: '1rem' }}>
                        <MenuItem value={10}>10 {t('per_page')}</MenuItem>
                        <MenuItem value={25}>25 {t('per_page')}</MenuItem>
                        <MenuItem value={50}>50 {t('per_page')}</MenuItem>
                    </Select>
                </Box>


                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newModel) => {
                        setPageNo(newModel.page);
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
            <AddTransactions fetchData={fetchData} setOpen={setOpen} open={open} />
            <TransactionDetailsModal
                transaction={selectedTransaction}
                open={detailsModalOpen}
                onClose={handleCloseModal}
            />
        </CacheProvider >)
}

export default Transactions