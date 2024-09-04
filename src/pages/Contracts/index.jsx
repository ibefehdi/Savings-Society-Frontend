import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Modal } from '@mui/material';
import BackButton from '../../components/BackButton';
import axiosInstance from '../../constants/axiosInstance';
import { saveAs } from 'file-saver';

const Contracts = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });

    const [expired, setExpired] = useState(false);
    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const { t, i18n } = useTranslation();
    const [editMode, setEditMode] = useState(false);
    const [contractId, setContractId] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);

    const handleOpenModal = (contract) => {
        setSelectedContract(contract);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedContract(null);
    };
    const [contractStatus, setContractStatus] = useState('active');
    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: 0,
    });
    const { data, fetchData, count } = useFetch(
        contractStatus === 'all' ? '/contracts' :
            contractStatus === 'active' ? '/contracts/active' : '/contracts/inactive',
        paginationModel.page + 1,
        paginationModel.pageSize
    );


    useEffect(() => {
        fetchData();
    }, [contractStatus, paginationModel]);
    const isRtl = i18n.dir() === 'rtl';

    const columns = [
        {
            field: 'flatNumber',
            headerName: t('flat_number'),
            flex: 1,
            valueGetter: (params) => params?.row?.flatId?.flatNumber,
        },
        {
            field: 'tenantName',
            headerName: t('tenant_name'),
            flex: 1,
            valueGetter: (params) => params.row.tenantId?.name,
        },
        {
            field: 'startDate',
            headerName: t('start_date'),
            flex: 1,
            valueGetter: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: 'endDate',
            headerName: t('end_date'),
            flex: 1,
            valueGetter: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: 'rentAmount',
            headerName: t('rent_amount'),
            flex: 1,
        },
        {
            field: 'expired',
            headerName: t('expired'),
            flex: 1,
            renderCell: (params) => (
                <span style={{
                    color: params.value ? 'red' : 'green',
                    fontWeight: 'bold'
                }}>
                    {params.value ? t('inactive') : t('active')}
                </span>
            ),
        },
        {
            field: 'collectionDay',
            headerName: t('collection_day'),
            flex: 1,
        },
        {
            field: 'view',
            headerName: t('view'),
            flex: 1,
            renderCell: (params) => (
                params.row.contractDocument ? (
                    <IconButton onClick={() => handleOpenModal(params.row)}>
                        <VisibilityIcon />
                    </IconButton>
                ) : null
            ),
        },
        {
            field: 'delete',
            headerName: t('delete'),
            flex: 1,
            renderCell: (params) => (
                <IconButton onClick={() => handleDeleteContract(params.row._id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
        // {
        //     field: 'edit',
        //     headerName: t('edit'),
        //     flex: 1,
        //     width: 55,
        //     renderCell: (params) => {
        //         return (
        //             <IconButton onClick={() => console.log(params.id)}>
        //                 <ModeEditIcon />
        //             </IconButton>
        //         );
        //     },
        // },
    ];

    useEffect(() => {
        fetchData();
    }, [expired, paginationModel]);
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    const downloadCSV = () => {
        axiosInstance.get(`/contracts/export?status=${contractStatus}`, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                saveAs(blob, `${contractStatus}_contracts.csv`);
            })
            .catch(error => console.error('Download error!', error));
    };
    const handleDeleteContract = (id) => {
        if (window.confirm(t('confirm_delete_contract'))) {
            axiosInstance.delete(`/contract/${id}`)
                .then(() => {
                    fetchData(); // Refresh the data after deletion
                })
                .catch((error) => {
                    console.error('Error deleting contract:', error);
                    // You might want to show an error message to the user here
                });
        }
    };
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: '100%' }}>
                    <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                        {t('contracts')}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={downloadCSV}
                        sx={{ marginRight: '1rem' }}
                    >
                        {t('export_csv')}
                    </Button>
                    <BackButton />

                </Box>
                <Box
                    sx={{
                        width: '90%',
                        display: 'flex',
                        gap: '1rem',
                        backgroundColor: '#FFF',
                        marginLeft: '2rem',
                        marginTop: '2rem',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        overflowX: 'auto',
                        marginRight: isRtl ? "2rem" : 0
                    }}
                >
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="contract-status-select-label">{t('status')}</InputLabel>
                        <Select
                            labelId="contract-status-select-label"
                            id="contract-status-select"
                            value={contractStatus}
                            label={t('status')}
                            onChange={(e) => {
                                setContractStatus(e.target.value);
                                setPaginationModel({ ...paginationModel, page: 0 });
                            }}
                            fullWidth={true}
                        >
                            <MenuItem value="all">{t('all')}</MenuItem>
                            <MenuItem value="active">{t('active')}</MenuItem>
                            <MenuItem value="inactive">{t('inactive')}</MenuItem>
                        </Select>
                    </FormControl>
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
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="contract-modal-title"
                    aria-describedby="contract-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography id="contract-modal-title" variant="h6" component="h2">
                            {t('contract_document')}
                        </Typography>
                        {selectedContract && selectedContract.contractDocument && selectedContract.contractDocument.path ? (
                            <Box sx={{ mt: 2 }}>
                                {selectedContract.contractDocument.fileType === 'pdf' ? (
                                    <iframe
                                        src={selectedContract.contractDocument.path}
                                        width="100%"
                                        height="500px"
                                        style={{ border: 'none' }}
                                        title="Contract Document PDF"
                                        sandbox="allow-scripts allow-same-origin"
                                        loading="lazy"
                                    />

                                ) : (
                                    <img
                                        src={selectedContract.contractDocument.path}
                                        alt="Contract Document"
                                        style={{ maxWidth: '100%', maxHeight: '500px' }}
                                    />
                                )}
                            </Box>
                        ) : (
                            <Typography>{t('no_document_available')}</Typography>
                        )}
                        <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
                            {t('close')}
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </CacheProvider>
    );
};

export default Contracts;
