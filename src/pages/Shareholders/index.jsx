import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import AddShareholderModal from './AddShareholderModal';

const Shareholders = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data, fetchData, count } = useFetch('/shareholders', pageNo, pageSize);
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
        return (
          <IconButton onClick={() => {  }}>
            <VisibilityIcon />
          </IconButton>
        );
      },
    }] : [])


  ];
  useEffect(() => {
    fetchData();
    console.log("This is a user data", userData);
    console.log("This is a Permissions", permissions);
    console.log(permissions?.shareholder?.create)
  }, [fetchData, userData, permissions])
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);

  }
  return (
    <React.Fragment>
      <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        Test
      </Box>
      <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
          <Typography variant="h5" component="h2" sx={{
            fontStyle: 'normal', // Sets the font style
            fontWeight: 600,
            lineHeight: '1.875rem', flexGrow: 1,
            marginLeft: '1.2rem'
          }}>
            Shareholder Management
          </Typography>
          {permissions?.shareholder?.create && (<Button variant='contained' onClick={() => { handleOpen() }}>Add</Button>)}
        </Box>
        <DataGrid
          rows={data}
          columns={columns}
          page={pageNo}

          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pageSize,
              },
            },
          }}
          pageSizeOptions={[10]}
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
          disableRowSelectionOnClick
          onPageChange={(newPage) => setPageNo(newPage)}

        />

      </Box>
      <AddShareholderModal open={open} setOpen={setOpen} fetchData={fetchData} />
    </React.Fragment>)
}

export default Shareholders