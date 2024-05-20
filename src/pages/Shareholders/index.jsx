import React, { useEffect, useState } from 'react'
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
import AddShareholderModal from './AddShareholderModal';
import { useNavigate } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditShareholderModal from './EditShareholderModal';
import { useTranslation } from 'react-i18next';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import axiosInstance from '../../constants/axiosInstance';
import { saveAs } from 'file-saver';
import DisableShareholderModal from './DisableShareholderModal';
import PersonOffIcon from '@mui/icons-material/PersonOff';
const ViewButton = ({ id, edit, setEditOpen, setSelectedShareholderId }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    setSelectedShareholderId(id);
    setEditOpen(true);
  };

  return (
    <div>
      {edit ? (
        <IconButton onClick={handleEditClick}>
          <ModeEditIcon />
        </IconButton>
      ) : (
        <IconButton onClick={() => navigate(`/shareholderno/${id}`)}>
          <VisibilityIcon />
        </IconButton>
      )}
    </div>
  );
};
const DisableButton = ({ id, setDisableOpen, setSelectedShareholderId }) => {
  const handleDisableClick = () => {
    setSelectedShareholderId(id);
    setDisableOpen(true);
  };

  return (
    <IconButton onClick={handleDisableClick}>
      <PersonOffIcon />
    </IconButton>
  );
};

const Shareholders = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [disableOpen, setDisableOpen] = useState(false);

  const [filters, setFilters] = useState({
    fName: '',
    lName: '',
    status: '',
    membershipStatus: '',
    civilId: '',
    membersCode: ''
  });
  const { data, fetchData, count } = useFetch('/shareholders', pageNo, pageSize, filters);
  const [selectedShareholderId, setSelectedShareholderId] = useState(null);
  const { i18n, t } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const navigate = useNavigate();
  const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')))
  const [permissions, setPermissions] = useState(userData?.permissions)
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
        return `${params?.row?.fName} ${params?.row?.lName}`
      }
    },
    {
      field: 'DOB',
      headerName: t('date_of_birth'),
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
      }
    },
    {
      field: 'civilId',
      headerName: t('civil_id'),
      flex: 1,
    },
    {
      field: 'email',
      headerName: t('email'),
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
        return params?.row?.mobileNumber && params?.row?.mobileNumber ? params?.row?.mobileNumber : "N/A"
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
      field: 'initialInvestment',
      headerName: t('initial_investment'),
      flex: 1,
      renderCell: (params) => {
        // Filter the savings array for the current year and display the initial amount
        return params?.row.savings?.initialAmount ? params?.row?.savings?.initialAmount?.toFixed(3) : "N/A"
      }
    },
    {
      field: 'currentAmount',
      headerName: t('current_amount'),
      flex: 1,
      renderCell: (params) => {

        return params?.row?.savings?.currentAmount ? params?.row?.savings?.currentAmount?.toFixed(3) : "N/A"
      }
    },
    // {
    //   field: 'membershipStatus',
    //   headerName: t('membership_status'),
    //   flex: 1,
    //   renderCell: (params) => {
    //     if (params.value === 0) {
    //       return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>{t('active')}</Typography>
    //     } else if (params.value === 1) {
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
        } else if (params.value === 1) {
          return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>{t('inactive')}</Typography>
        } else if (params.value === 2) {
          return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>{t('death')}</Typography>
        }
      }
    },
    ...(permissions?.shareholder?.view ? [{
      field: 'view',
      headerName: t('view'),
      sortable: false,
      width: 55,
      renderCell: (params) => {
        return <ViewButton id={params.id} />;
      },
    }] : []),
    ...(permissions?.shareholder?.edit ? [{
      field: 'edit',
      headerName: t('edit'),
      sortable: false,
      width: 55,
      renderCell: (params) => {
        return <ViewButton id={params.id} edit={true} setEditOpen={setEditOpen} setSelectedShareholderId={setSelectedShareholderId} />;
      },
    }] : []),
    {
      field: 'disable',
      headerName: t('disable'),
      sortable: false,
      width: 55,
      renderCell: (params) => {
        if (params.row.status === 0 || params.row.membershipStatus === 0) {
          return <DisableButton id={params.id} setDisableOpen={setDisableOpen} setSelectedShareholderId={setSelectedShareholderId} />;
        }
        return null;
      },
    },
  ];

  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const cacheLtr = createCache({
    key: 'muilt',
  });
  useEffect(() => {
    fetchData();
  }, [fetchData, pageNo, pageSize]);
  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPageNo(1);
    setPaginationModel({ ...paginationModel, pageSize: event.target.value });
  };
  const handleOpen = () => {
    setOpen(true);

  }

  const getCSV = () => {
    const filterParams = new URLSearchParams(filters).toString();
    const queryString = `shareholdercsv/?${filterParams}`;
    axiosInstance.get(queryString, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "shareholder.csv");
      })
      .catch(error => console.error('Download error!', error));
  };
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: pageNo,
  });
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
        <FilterListOutlinedIcon /> {t('filter')}
      </Button>
      {showFilters &&
        (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
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
            value={filters.fName}
            onChange={(e) => setFilters({ ...filters, fName: e.target.value })}
            fullWidth
            autoComplete='off'

          />
          {/* <TextField
            label={t('last_name')}
            variant="outlined"
            value={filters.lName}
            onChange={(e) => setFilters({ ...filters, lName: e.target.value })}
            fullWidth
            autoComplete='off'

          /> */}
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
            {t('shareholders')}
          </Typography>

          <Select value={pageSize} onChange={handlePageSizeChange} sx={{ ml: '1rem', mr: '1rem' }}>
            <MenuItem value={10}>10 {t('per_page')}</MenuItem>
            <MenuItem value={25}>25 {t('per_page')}</MenuItem>
            <MenuItem value={50}>50 {t('per_page')}</MenuItem>
          </Select>
          <Box display={"flex"} gap={2}>{permissions?.shareholder?.create && (<Button variant='contained' onClick={() => { handleOpen() }}>{t('add')}</Button>)}
            <Button variant='contained' onClick={() => { getCSV() }}>{t('export_csv')}</Button></Box>

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
      <AddShareholderModal open={open} setOpen={setOpen} fetchData={fetchData} />
      <EditShareholderModal open={editOpen} setOpen={setEditOpen} fetchData={fetchData} id={selectedShareholderId} />
      <DisableShareholderModal open={disableOpen} setOpen={setDisableOpen} fetchData={fetchData} id={selectedShareholderId} />

    </CacheProvider>)
}

export default Shareholders