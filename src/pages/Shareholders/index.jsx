import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';

import AddShareholderModal from './AddShareholderModal';
import { useNavigate } from 'react-router-dom';

const ViewButton = ({ id }) => {
  const navigate = useNavigate(); // Use the hook

  return (
    <IconButton onClick={() => navigate(`/Shareholders/${id}`)}>
      <VisibilityIcon />
    </IconButton>
  );
};

const Shareholders = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data, fetchData, count } = useFetch('/shareholders', pageNo, pageSize);
  const navigate = useNavigate();
  const [userData, setUserdata] = useState(JSON.parse(sessionStorage.getItem('userDetails')))
  const [permissions, setPermissions] = useState(userData?.permissions)
  const columns = [
    {
      field: 'serial',
      headerName: 'serial',
      flex: 1,
    },
    {
      field: 'fName',
      headerName: 'First name',
      flex: 1,
    },
    {
      field: 'lName',
      headerName: 'Last name',
      flex: 1,
    },
    {
      field: 'DOB',
      headerName: 'Date of Birth',
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
      headerName: 'Civil ID',
      flex: 1,

    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'ibanNumber',
      headerName: 'IBAN',
      flex: 1,
    },
    {
      field: 'mobileNumber',
      headerName: 'Phone Number',
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      renderCell: (params) => {
        const { block, street, house, avenue, city } = params.value;
        return `Block ${block}, Street ${street}, House ${house}, Avenue ${avenue}, City ${city}`;
      }
    },
    {
      field: 'savings',
      headerName: 'Initial Investment',
      flex: 1,
      renderCell: (params) => {
        return params.value && params.value.initialAmount.toFixed(3);
      }
    },
    {
      field: 'savings',
      headerName: 'Current Amount',
      flex: 1,
      renderCell: (params) => {
        return params.value && params.value.currentAmount.toFixed(3)
      }
    },
    {
      field: 'membershipStatus',
      headerName: 'Membership Status',
      flex: 1,
      renderCell: (params) => {
        if (params.value === 0) {
          return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>Active</Typography>
        }
        else if (params.value === 1) {
          return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>Inactive</Typography>
        }
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        if (params.value === 0) {
          return <Typography sx={{ color: '#10A760', fontWeight: 600 }}>Active</Typography>
        }
        else if (params.value === 1) {
          return <Typography sx={{ color: '#E19133', fontWeight: 600 }}>Inactive</Typography>
        }
        else if (params.value === 2) {
          return <Typography sx={{ color: '#DA3E33', fontWeight: 600 }}>Death</Typography>
        }
      }
    },
    ...(permissions?.shareholder?.view ? [{
      field: 'view',
      headerName: 'View',
      sortable: false,
      width: 55,
      renderCell: (params) => {
        return <ViewButton id={params.id} />;

      },
    }] : [])


  ];
  useEffect(() => {
    fetchData();
  }, [fetchData, pageNo, pageSize]);
  const [open, setOpen] = useState(false);
  const handlePageChange = (newPage) => {
    setPageNo(newPage + 1);

  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPageNo(1); // Reset to the first page when the size changes
    setPaginationModel({ ...paginationModel, pageSize: event.target.value });
  };
  const handleOpen = () => {
    setOpen(true);

  }
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: pageNo,
  });

  return (
    <React.Fragment>
      <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        Test
      </Box>
      <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>

          <Typography variant="h3" component="h2" sx={{
            fontStyle: 'normal', // Sets the font style
            fontWeight: 600,
            lineHeight: '1.875rem', flexGrow: 1,
            marginLeft: '1.2rem'
          }}>
            Shareholder Management
          </Typography>
          <Select value={pageSize} onChange={handlePageSizeChange} sx={{ mr: '1rem' }}>
            <MenuItem value={10}>10 per page</MenuItem>
            <MenuItem value={25}>25 per page</MenuItem>
            <MenuItem value={50}>50 per page</MenuItem>
          </Select>
          {permissions?.shareholder?.create && (<Button variant='contained' onClick={() => { handleOpen() }}>Add</Button>)}
        </Box>

        <DataGrid
          rows={data}
          columns={columns}
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
    </React.Fragment>)
}

export default Shareholders