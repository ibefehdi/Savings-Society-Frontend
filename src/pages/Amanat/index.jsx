import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useReactToPrint } from 'react-to-print';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { TextField, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AmanatWithdrawal from './AmanatWithdrawal';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
const ViewButton = ({ id, edit, setEditOpen, setSelectedShareholderId }) => {

  const handleEditClick = () => {
    setSelectedShareholderId(id);
    setEditOpen(true);
  };

  return (
    <IconButton onClick={handleEditClick}>
      <LocalAtmIcon />
    </IconButton>

  );
};
const Amanat = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState({
    fName: '',
    lName: '',
    status: '',
    membershipStatus: '',
    civilId: '',
    membersCode: ''
  });

  const { data, fetchData, count } = useFetch('/shareholders', pageNo, pageSize, filters);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')))
  const [selectedShareholderId, setSelectedShareholderId] = useState(null);
  const [admin, setAdmin] = useState(userData?.isAdmin)

  const columns = [
    {
      field: 'membersCode',
      headerName: t('serial'),
      flex: 1,
    },
    {
      field: 'Full Name',
      headerName: t('full_name'),
      flex: 1,
      renderCell: (params) => {
        return `${params.row.fName} ${params.row.lName}`
      }
    },
    {
      field: 'DOB',
      headerName: t('date_of_birth'),
      flex: 1,
      renderCell: (params) => {
        // Parse the date string from params.value
        const date = new Date(params.value);

        // Extract day, month, and year
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear().toString(); // Get last two digits of year

        // Formatted date string in "DD/MM/YY" format
        const formattedDate = `${day}/${month}/${year}`;

        // Return the formatted date
        return formattedDate;
      }
    },
    {
      field: 'civilId',
      headerName: t('civil_id'),
      flex: 1,

    },

    {
      field: 'ibanNumber',
      headerName: t('iban'),
      flex: 1,
    },
    {
      field: 'mobileNumber',
      headerName: t('phone_number'),
      flex: 1,
      renderCell: (params) => {
        return params.row.mobileNumber && params.row.mobileNumber ? params.row.mobileNumber : "N/A"
      }
    },
    {
      field: 'address',
      headerName: t('address'),
      flex: 1,
      renderCell: (params) => {
        const { block, street, house, avenue, city } = params.value;
        return `Block ${block}, Street ${street}, House ${house}, Avenue ${avenue}, City ${city}`;
      }
    },

    {
      field: 'amount',
      headerName: t('current_amount'),
      flex: 1,
      renderCell: (params) => {
        // Safely access deeply nested properties
        const amount = params.row.savings?.amanat?.amount;
        return amount ? amount.toFixed(3) : 'N/A';  // Format and handle undefined
      }
    },
    // {
    //   field: 'membershipStatus',
    //   headerName: t('membership_status'),
    //   flex: 1,
    //   renderCell: (params) => {
    //     if (params.value === 0) {
    //       return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>{t('active')}</Typography>
    //     }
    //     else if (params.value === 1) {
    //       return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>{t('inactive')}</Typography>
    //     }
    //   }
    // },
    {
      field: 'status',
      headerName: t('status'),
      flex: 1,
      renderCell: (params) => {
        if (params.value === 0) {
          return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>{t('active')}</Typography>
        }
        else if (params.value === 1) {
          return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>{t('inactive')}</Typography>
        }
        else if (params.value === 2) {
          return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>{t('death')}</Typography>
        }
      }
    },
    ...(admin ? [{
      field: 'withdrawal',
      headerName: t('withdrawal'),
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return <ViewButton id={params.id} edit={true} setEditOpen={setEditOpen} setSelectedShareholderId={setSelectedShareholderId} />;

      },
    }] : []),


  ];

  const [editOpen, setEditOpen] = useState(false);
  const orderedColumns = isRtl ? [...columns].reverse() : columns;


  useEffect(() => {
    fetchData();
  }, []);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: pageNo,
  });


  const componentRef = useRef();
  const isRtl = i18n.dir() === 'rtl';

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const cacheLtr = createCache({
    key: 'muilt',
  });
  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
        <FilterListOutlinedIcon /> {t('filter')}
      </Button>
      {showFilters && (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        <TextField
          label={t('serial')}
          variant="outlined"
          value={filters.membersCode}
          onChange={(e) => setFilters({ ...filters, membersCode: e.target.value })}
          fullWidth
          autoComplete='off'
        />
        <TextField
          label={t('first_name')}
          variant="outlined"
          value={filters.fName}
          onChange={(e) => setFilters({ ...filters, fName: e.target.value })}
          fullWidth
          autoComplete='off'

        />
        <TextField
          label={t('last_name')}
          variant="outlined"
          value={filters.lName}
          onChange={(e) => setFilters({ ...filters, lName: e.target.value })}
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
          label={t('status')}
          variant="outlined"
          select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          fullWidth
          autoComplete='off'

        >
          <MenuItem value={0}>{t('active')}</MenuItem>
          <MenuItem value={1}>{t('inactive')}</MenuItem>
          <MenuItem value={2}>{t('death')}</MenuItem>
        </TextField>
        <TextField
          label={t('membership_status')}
          variant="outlined"
          select
          value={filters.membershipStatus}
          onChange={(e) => setFilters({ ...filters, membershipStatus: e.target.value })}
          fullWidth
          autoComplete='off'
        >
          <MenuItem value={0}>{t('active')}</MenuItem>
          <MenuItem value={1}>{t('inactive')}</MenuItem>
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
            {t('amanat')}
          </Typography>

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
              fontStyle: 'normal', // Sets the font style
              fontWeight: 600, // Sets the font weight
              lineHeight: '1.25rem',
              color: '#667085',
              fontSize: '0.875rem'
            },
          }}
        />
      </Box>
      <AmanatWithdrawal id={selectedShareholderId} open={editOpen} setOpen={setEditOpen} savings={true} fetchData={fetchData} />
    </CacheProvider>
  )
}

export default Amanat