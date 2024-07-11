import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
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
const Vouchers = () => {
  const [pageNo, setPageNo] = useState(0)
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
  const [filters, setFilters] = useState({
    buildingId: '',
    tenantName: '',
    civilId: '',
    contactNumber: '',

  });
  const { data, fetchData, count } = useFetch('/vouchers', pageNo + 1, pageSize, filters);
  const columns = [
    {
      field: 'description',
      headerName: t('description'),
      flex: 1,
      renderCell: (params) => {
        // Check if flatId exists, and if not, use the buildingId directly from the root of the data object
        const buildingInfo = params.row.flatId ? params.row.flatId?.buildingId : params.row.buildingId;
        const flatNumber = params.row.flatId ? `, Flat Number: ${params.row.flatId?.flatNumber}` : "";
        return `${buildingInfo.name}${flatNumber}`;
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
      renderCell: (params) => {
        return `${params.value} (Status: ${params.row?.status})`;
      }
    },
    {
      field: 'pendingDate',
      headerName: t('pendingDate'),
      flex: 1,
      valueGetter: (params) => params.value ? new Date(params.value)?.toLocaleDateString() : ''
    },
    {
      field: 'paidDate',
      headerName: t('paidDate'),
      flex: 1,
      valueGetter: (params) => params.value ? new Date(params.value)?.toLocaleDateString() : ''
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
  }, [pageNo, pageSize, filters]);

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
  const getCSV = (format = 'xlsx') => {
    const filterParams = new URLSearchParams(filters).toString();
    const queryString = `voucher-report/?${filterParams}&format=${format}`;
    axiosInstance.get(queryString, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, `voucher-report.${format}`);
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
        <Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
          <TextField
            label={t('building')}
            variant="outlined"
            select
            value={filters.buildingId}
            onChange={(e) => setFilters({ ...filters, buildingId: e.target.value })}
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
          />
        </Box>
      )}
      <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
          <Typography variant="h3" component="h2" sx={{
            fontStyle: 'normal', // Sets the font style
            fontWeight: 600,
            lineHeight: '1.875rem', flexGrow: 1,
            marginLeft: '1.2rem'
          }}>
            {t('vouchers')}
          </Typography>
          <Button variant='contained' onClick={handleOpenAddModal}>{t('add')}</Button>
          <Button variant='contained' onClick={() => { getCSV('xlsx'); }}>{t('export_xlsx')}</Button>

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
      <PayVoucherModal open={modalOpen} onClose={handleCloseModal} voucherId={selectedVoucherId} fetchData={fetchData} />
      <AddVoucherModal open={addModalOpen} onClose={handleCloseAddModal} fetchData={fetchData} />
    </CacheProvider>
  )
}

export default Vouchers