import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import BackButton from '../../components/BackButton';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { saveAs } from 'file-saver';
import axiosInstance from '../../constants/axiosInstance';
import AddNewBooking from '../BookingTimeline/AddNewBooking';
import EditBooking from '../BookingTimeline/EditBooking';
import { TextField, Select, MenuItem } from '@mui/material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

const ViewBookings = () => {
    const { id } = useParams();
    const [searchCivilId, setSearchCivilId] = useState('');


    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    // Modify this line
    const { data, fetchData, count } = useFetch(
        `/bookingbyhall/${id}`,
        paginationModel.page + 1,
        paginationModel.pageSize,
        { searchCivilId }
    );
    const handleSearchChange = (event) => {
        setSearchCivilId(event.target.value);
        setPaginationModel({ ...paginationModel, page: 0 });
    };

    const handleSearch = () => {
        fetchData();
    };
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    useEffect(() => {
        fetchData();
    }, [paginationModel]);
    const handleAddClick = () => {
        setEditingBooking(null);
        setOpenModal(true);
    };

    const handleEditClick = (booking) => {
        setEditingBooking(booking);
        setOpenEditModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingBooking(null);
    };
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditingBooking(null);
    };
    const handleDeleteClick = (bookingId) => {
        if (window.confirm(t('confirm_delete_booking'))) {
            axiosInstance.delete(`/bookings/${bookingId}`)
                .then(() => {
                    fetchData();
                })
                .catch(error => console.error('Delete error!', error));
        }
    };
    const columns = [
        {
            field: 'dateOfEvent',
            headerName: t('date_of_event'),
            flex: 1,
            valueGetter: (params) => params.row.dateOfEvent ? new Date(params.row.dateOfEvent).toLocaleDateString() : ''
        },
        {
            field: 'date',
            headerName: t('booking_date'),
            flex: 1,
            valueGetter: (params) => new Date(params.row.date).toLocaleDateString()
        },

        {
            field: 'rate',
            headerName: t('rate'),
            flex: 1,
            valueGetter: (params) => `${params.row.rate}`
        },
        {
            field: 'customerName',
            headerName: t('tenantName'),
            flex: 1,
            valueGetter: (params) => params.row.customer?.name || ''
        },
        {
            field: 'voucher',
            headerName: t('voucherNo'),
            flex: 1,
            renderCell: (params) => {
                if (params.row.voucher && params.row.voucher.voucherNo) {
                    return params.row.voucher.voucherNo;
                }
                return '';
            }
        },
        {
            field: 'actions',
            headerName: t('actions'),
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button
                        onClick={() => handleEditClick(params.row)}
                        variant="contained"
                        size="small"
                        sx={{ marginRight: '0.5rem' }}
                    >
                        {t('edit')}
                    </Button>
                    <Button
                        onClick={() => handleDeleteClick(params.row._id)}
                        variant="contained"
                        color="error"
                        size="small"
                    >
                        {t('delete')}
                    </Button>
                </Box>
            ),
        },

    ];
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const downloadCSV = () => {
        axiosInstance.get(`/bookings/${id}/export`, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                saveAs(blob, `hall_bookings_${id}.csv`);
            })
            .catch(error => console.error('Download error!', error));
    };
    const handlePaginationModelChange = (newModel) => {
        setPaginationModel(newModel);
    };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>

            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <TextField
                            label={t('civil_id')}
                            variant="outlined"
                            value={searchCivilId}
                            onChange={handleSearchChange}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                        >
                            {t('search')}
                        </Button>
                    </Box>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '1.875rem',
                        flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('hall_bookings')}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleAddClick}
                        sx={{ marginRight: '1rem' }}
                    >
                        {t('add')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={downloadCSV}
                        sx={{ marginRight: '1rem' }}
                    >
                        {t('export_csv')}
                    </Button>
                    <BackButton />
                </Box>
                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
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
                <AddNewBooking
                    editMode={editingBooking !== null}
                    setOpen={handleCloseModal}
                    fetchData={fetchData}
                    open={openModal}
                    hallId={id}
                    booking={editingBooking}
                    onDelete={() => {/* Implement delete functionality if needed */ }}
                />
                <EditBooking
                    open={openEditModal}
                    handleClose={handleCloseEditModal}
                    booking={editingBooking}
                    fetchData={fetchData}
                    hallId={id}
                />
            </Box>
        </CacheProvider>
    );
};

export default ViewBookings;