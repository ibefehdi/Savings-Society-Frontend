import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import moment from 'moment';

import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { saveAs } from 'file-saver';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import PayVoucherModal from './PayVoucherModal';
import AddVoucherModal from './AddVoucherModal';
import { MenuItem, TextField } from '@mui/material';
import axiosInstance from '../../constants/axiosInstance';
import DeleteConfirmationModal from './DeleteConfirmationModal ';
import BackButton from '../../components/BackButton';

const Vouchers = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [flats, setFlats] = useState([]);
  const fetchFlats = async (buildingId) => {
    if (!buildingId) {
      setFlats([]);
      return;
    }
    try {
      const response = await axiosInstance.get(`/flatsbybuildingid/${buildingId}`);
      setFlats(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching flats:', error);
    }
  };
  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setEditingVoucher(null);
  };
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handlePayVoucher = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVoucherId(null);
    setModalOpen(false);
  };

  const handleDeleteVoucher = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`deletevoucher/${selectedVoucherId}`);
      setDeleteModalOpen(false);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting voucher:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setSelectedVoucherId(null);
    setDeleteModalOpen(false);
  };

  // Updated filters state with new filter fields
  const [filters, setFilters] = useState({
    buildingId: '',
    flatId: '',
    tenantName: '',
    civilId: '',
    contactNumber: '',
    voucherNo: '',
    amountMin: '',
    amountMax: '',
    status: '',
    pendingDateFrom: '',
    pendingDateTo: '',
    paidDateFrom: '',
    paidDateTo: ''
  });

  const { data, fetchData, count } = useFetch('/vouchers', pageNo + 1, pageSize, filters);

  const columns = [
    {
      field: 'description',
      headerName: t('description'),
      flex: 1,
      renderCell: (params) => {
        const buildingInfo = params.row.flatId ? params.row.flatId?.buildingId : params.row.buildingId;
        const flatNumber = params.row.flatId ? `, Flat Number: ${params.row.flatId?.flatNumber}` : "";
        return `${buildingInfo.name}${flatNumber}`;
      }
    },
    {
      field: 'flatNumber',
      headerName: t('flatNumber'),
      flex: 1,
      renderCell: (params) => {

        const flatNumber = params.row.flatId ? `  ${params.row.flatId?.flatNumber}` : "";
        return `${flatNumber}`;
      }
    },
    {
      field: 'name',
      headerName: t('tenantName'),
      flex: 1,
      valueGetter: (params) => params.row.tenantId?.name
    },
    {
      field: 'amount',
      headerName: t('rentAmount'),
      flex: 1,
      renderCell: (params) => `${params.value} (Status: ${params.row?.status})`
    },
    {
      field: 'pendingDate',
      headerName: t('pendingDate'),
      flex: 1,
      renderCell: (params) => {
        const pendingDate = params.value ? moment(params.value).format('MMMM') : '';
        const hasPaidDate = params.row.paidDate;
        const color = hasPaidDate ? 'black' : 'red';
        return <span style={{ color }}>{pendingDate}</span>;
      }
    },
    {
      field: 'paidDate',
      headerName: t('paidDate'),
      flex: 1,
      renderCell: (params) => {
        if (!params.value) return '';
        const paidDate = moment(params.value).format('DD-MM-YYYY');
        return <span style={{ color: 'green' }}>{paidDate}</span>;
      }
    },
    {
      field: 'voucherNo',
      headerName: t('voucherNo'),
      flex: 1,
      valueGetter: (params) => {
        if (!params.value) return '';
        return params.value
      }
    },
    // {
    //   field: 'actions',
    //   headerName: t('Actions'),
    //   flex: 1,
    //   renderCell: (params) => (
    //     !params.row.paidDate ? (
    //       <Button variant="contained" onClick={() => handlePayVoucher(params.row._id)}>
    //         {t('Pay')}
    //       </Button>
    //     ) : null
    //   ),
    // },
    {
      field: 'edit',
      headerName: t('edit'),
      flex: 1,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleEditVoucher(params.row)}>
          {t('edit')}
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: t('delete'),
      flex: 1,
      renderCell: (params) => (

        <Button variant="contained" onClick={() => handleDeleteVoucher(params.row._id)}>
          {t('delete')}
        </Button>

      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [pageNo, pageSize, filters]);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const handleEditVoucher = (voucher) => {
    setEditingVoucher(voucher);
    setAddModalOpen(true);
  };


  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const cacheLtr = createCache({
    key: 'muilt',
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: 0,
  });
  const orderedColumns = isRtl ? [...columns].reverse() : columns;
  const [buildings, setBuildings] = useState([]);
  const getCSV = () => {
    const filterParams = new URLSearchParams(filters).toString();
    const queryString = `voucher-report/?${filterParams}`;
    axiosInstance.get(queryString, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "voucher_report.xlsx");
      })
      .catch(error => console.error('Download error!', error));
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axiosInstance.get('/buildingdropdown');
        setBuildings(response?.data?.data);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };

    fetchBuildings();
  }, []);

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
        <FilterListOutlinedIcon /> {t('filter')}
      </Button>
      {showFilters && (
        <Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0, flexWrap: 'wrap' }}>
          {/* Existing filters */}
          <TextField
            label={t('building')}
            variant="outlined"
            select
            value={filters.buildingId}
            onChange={(e) => {
              const newBuildingId = e.target.value;
              setFilters({
                ...filters,
                buildingId: newBuildingId,
                flatId: '' // Reset flat when building changes
              });
              fetchFlats(newBuildingId);
            }}
            fullWidth
            autoComplete='off'
          >
            {buildings.map((building) => (
              <MenuItem key={building._id} value={building._id}>
                {building.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('flat')}
            variant="outlined"
            select
            value={filters.flatId}
            onChange={(e) => setFilters({ ...filters, flatId: e.target.value })}
            fullWidth
            disabled={!filters.buildingId}
            autoComplete='off'
          >
            {flats.map((flat) => (
              <MenuItem key={flat._id} value={flat._id}>
                {flat.flatNumber}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('voucherNo')}
            variant="outlined"
            value={filters.voucherNo}
            onChange={(e) => setFilters({ ...filters, voucherNo: e.target.value })}
            fullWidth
            autoComplete='off'
          />

          {/* New filters for amount, status, pending date, and paid date */}
          <TextField
            label={t('amountMin')}
            variant="outlined"
            type="number"
            value={filters.amountMin}
            onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
            fullWidth
            autoComplete='off'
          />
          <TextField
            label={t('amountMax')}
            variant="outlined"
            type="number"
            value={filters.amountMax}
            onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
            fullWidth
            autoComplete='off'
          />
          <TextField
            label={t('status')}
            variant="outlined"
            select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            fullWidth
            autoComplete='off'
          >
            <MenuItem value="">
              <em>{t('all')}</em>
            </MenuItem>
            <MenuItem value="Pending">{t('pending')}</MenuItem>
            <MenuItem value="Paid">{t('paid')}</MenuItem>
          </TextField>
          <TextField
            label={t('pendingDateFrom')}
            variant="outlined"
            type="date"
            value={filters.pendingDateFrom}
            onChange={(e) => setFilters({ ...filters, pendingDateFrom: e.target.value })}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete='off'
          />
          <TextField
            label={t('pendingDateTo')}
            variant="outlined"
            type="date"
            value={filters.pendingDateTo}
            onChange={(e) => setFilters({ ...filters, pendingDateTo: e.target.value })}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete='off'
          />
          <TextField
            label={t('paidDateFrom')}
            variant="outlined"
            type="date"
            value={filters.paidDateFrom}
            onChange={(e) => setFilters({ ...filters, paidDateFrom: e.target.value })}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete='off'
          />
          <TextField
            label={t('paidDateTo')}
            variant="outlined"
            type="date"
            value={filters.paidDateTo}
            onChange={(e) => setFilters({ ...filters, paidDateTo: e.target.value })}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete='off'
          />

          {/* These were commented out in the original code */}
          {/* <TextField
            label={t('tenant_name')}
            variant="outlined"
            value={filters.tenantName}
            onChange={(e) => setFilters({ ...filters, tenantName: e.target.value })}
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
            label={t('contact_number')}
            variant="outlined"
            value={filters.contactNumber}
            onChange={(e) => setFilters({ ...filters, contactNumber: e.target.value })}
            fullWidth
            autoComplete='off'
          /> */}
        </Box>
      )}
      <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
          <Typography variant="h3" component="h2" sx={{
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '1.875rem', flexGrow: 1,
            marginLeft: '1.2rem'
          }}>
            {t('vouchers')}
          </Typography>
          <Button variant='contained' onClick={handleOpenAddModal}>{t('add')}</Button>
          <Button variant='contained' onClick={() => { getCSV('xlsx'); }}>{t('export_xlsx')}</Button>
          <BackButton />

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
      <PayVoucherModal open={modalOpen} onClose={handleCloseModal} voucherId={selectedVoucherId} fetchData={fetchData} />
      <AddVoucherModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        fetchData={fetchData}
        editingVoucher={editingVoucher}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </CacheProvider>
  );
};

export default Vouchers;

