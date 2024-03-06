import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
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
import AddShareConfigurationModal from './AddShareConfigurationModal';
import { useTranslation } from 'react-i18next';
const ShareConfiguration = () => {
    const [pageNo, setPageNo] = useState(1);
    const { t } = useTranslation();
    const [pageSize, setPageSize] = useState(10)
    const [editMode, setEditMode] = useState(false);
    const [shareConfigId, setShareConfigId] = useState();
    const { data, fetchData, count } = useFetch('/shareconfigs', pageNo, pageSize);
    const columns = [
        {
            field: 'year',
            headerName: 'Year',
            flex: 1,
        },
        {
            field: 'individualSharePercentage',
            headerName: "Interest Rate",
            flex: 1,
            renderCell: (params) => {
                return `${params.value}%`
            }
        },
        {
            field: 'edit',
            headerName: t('edit'),
            flex: 1,
            width: 55,
            renderCell: (params) => {
                return (
                    <IconButton

                        onClick={() => { handleOpen(params.row) }}
                    >
                        <ModeEditIcon />
                    </IconButton>

                );
            },
        }
    ]
    useEffect(() => {
        fetchData();
    }, [fetchData])
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState();
    const handleOpen = (id) => {
        console.log("This is the id", id);
        if (id != null) {
            setEditMode(true)
            setShareConfigId(id?._id)
            setYear(id?.year)
        }
        setOpen(true);

    }
    return (
        <React.Fragment>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h5" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600, // Sets the font weight
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        Share Interest Rate
                    </Typography>
                    <Button variant='contained' onClick={() => { handleOpen() }}>Add</Button>
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

                />

            </Box>
            <AddShareConfigurationModal year={year} open={open} setOpen={setOpen} fetchData={fetchData} setEditMode={setEditMode} shareConfigId={shareConfigId} editMode={editMode} />
        </React.Fragment>)
}

export default ShareConfiguration