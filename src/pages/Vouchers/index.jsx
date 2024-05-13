import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import PayVoucherModal from './PayVoucherModal';
import AddVoucherModal from './AddVoucherModal';
const Vouchers = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const handlePayVoucher = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVoucherId(null);
    setModalOpen(false);
  };
  const { data, fetchData, count } = useFetch('/vouchers', pageNo, pageSize);
  const columns = [
    {
      field: 'description',
      headerName: t('description'),
      flex: 1,
      renderCell: (params) => {
        // Check if flatId exists, and if not, use the buildingId directly from the root of the data object
        const buildingInfo = params.row.flatId ? params.row.flatId.buildingId : params.row.buildingId;
        const flatNumber = params.row.flatId ? `, Flat Number: ${params.row.flatId.flatNumber}` : "";
        return `${buildingInfo.name}${flatNumber}`;
      }
    },
    {
      field: 'name',
      headerName: t('tenantName'),
      flex: 1,
      valueGetter: (params) => params.row.tenantId.name
    },
    {
      field: 'amount',
      headerName: t('rentAmount'),
      flex: 1,
      renderCell: (params) => {
        return `${params.value} (Status: ${params.row.status})`;
      }
    },
    {
      field: 'pendingDate',
      headerName: t('pendingDate'),
      flex: 1,
      valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    {
      field: 'paidDate',
      headerName: t('paidDate'),
      flex: 1,
      valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    {
      field: 'actions',
      headerName: t('Actions'),
      flex: 1,
      renderCell: (params) => (
        !params.row.paidDate ? (
          <Button variant="contained" onClick={() => handlePayVoucher(params.row._id)}>
            {t('Pay')}
          </Button>
        ) : null
      ),
    },
  ];


  useEffect(() => {
    fetchData();
  }, [pageNo, pageSize]);

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
  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>

      <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
          <Typography variant="h3" component="h2" sx={{
            fontStyle: 'normal', // Sets the font style
            fontWeight: 600,
            lineHeight: '1.875rem', flexGrow: 1,
            marginLeft: '1.2rem'
          }}>
            {t('Vouchers')}
          </Typography>
          <Button variant='contained' onClick={handleOpenAddModal}>{t('add')}</Button>
        </Box>
        <DataGrid
          rows={data}
          columns={columns.map((column) => ({
            ...column,
            disableColumnMenu: true,
          }))} paginationModel={paginationModel}
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
          }}
        />
      </Box>
      <PayVoucherModal open={modalOpen} onClose={handleCloseModal} voucherId={selectedVoucherId} fetchData={fetchData} />
      <AddVoucherModal open={addModalOpen} onClose={handleCloseAddModal} fetchData={fetchData} />
    </CacheProvider>
  )
}

export default Vouchers