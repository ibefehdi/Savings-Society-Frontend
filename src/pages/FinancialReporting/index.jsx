import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useReactToPrint } from 'react-to-print';

import { useFetch } from '../../hooks/useFetch';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem } from '@mui/material';
import axiosInstance from '../../constants/axiosInstance';
import WithdrawalForm from '../../printablePages/WithdrawalForm';
import { useTranslation } from 'react-i18next';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import PrintDataGrid from '../../printablePages/PrintDataGrid';
import { useFetchNoPagination } from '../../hooks/useFetchNoPagination';
const FinancialReporting = () => {
    const [filters, setFilters] = useState({
        fName: '',
        lName: '',
        status: '',
        membershipStatus: '',
        civilId: '',
        serial: ''
    });
    const { data, fetchData, count } = useFetchNoPagination('/financialReports', filters);
    const navigate = useNavigate();

    const { i18n, t } = useTranslation()
    const columns = [
        {
            field: 'serial',
            headerName: t('serial'),
            flex: 1,
        },
        {
            field: 'fullName',
            headerName: t('full_name'),
            flex: 1,
        },
        {
            field: 'civilId',
            headerName: t('civil_id'),
            flex: 1,
        },
        {
            field: 'initialInvestment',
            headerName: t('initial_investment'),
            flex: 1,
            renderCell: (params) => params.row.savings
                ? params.row.savings.initialAmount.toFixed(3)
                : 'N/A'
        },
        {
            field: 'currentAmount',
            headerName: t('current_amount'),
            flex: 1,
            renderCell: (params) => params.row.savings
                ? params.row.savings.currentAmount.toFixed(3)
                : 'N/A'
        },
        {
            field: 'savingsIncrease',
            headerName: t('savings_increase'),
            flex: 1,
        },


        {
            field: 'initialShareAmount',
            headerName: t('initial_share_amount'),
            flex: 1,
            valueGetter: (params) => params.row.share?.initialAmount.toFixed(3) ?? 'N/A',
        },
        {
            field: 'currentShareAmount',
            headerName: t('current_share_amount'),
            flex: 1,
            valueGetter: (params) => params.row.share?.currentAmount.toFixed(3) ?? 'N/A',
        },
        {
            field: 'shareIncrease',
            headerName: t('share_increase'),
            flex: 1,
        },
        {
            field: 'amanatAmount',
            headerName: t('amanat_amount'),
            flex: 1,
            renderCell: (params) => params.row.savings && params.row.savings.length > 0 && params.row.savings[0].amanat
                ? params.row.savings[0].amanat.amount.toFixed(3)
                : 'N/A'
        }
    ];


    useEffect(() => {
        fetchData(filters);
    }, [filters]);


    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };


    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const isRtl = i18n.dir() === 'rtl';

    return (
        <React.Fragment>
            <Button onClick={toggleFilters} variant="outlined" sx={{ backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', overflowX: 'auto', marginRight: isRtl ? '2rem' : 0 }}>
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>

            {showFilters && (<Box sx={{ width: '90%', display: 'flex', gap: '1rem', backgroundColor: '#FFF', marginLeft: '2rem', marginTop: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginRight: isRtl ? "2rem" : 0 }}>
                <TextField
                    label={t('serial')}
                    variant="outlined"
                    value={filters.serial}
                    onChange={(e) => setFilters({ ...filters, serial: e.target.value })}
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
                    {/* Replace these with your actual status options */}
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
                        {t('savings_withdrawal')}
                    </Typography>


                    <Button variant='contained' onClick={() => { handlePrint() }}>{t('print_form')}</Button>
                </Box>

                <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0, display: 'none' }}>
                    <PrintDataGrid ref={componentRef} data={data} />
                </Box>
                <DataGrid
                    rows={data}
                    columns={columns}

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
        </React.Fragment>

    )
}


export default FinancialReporting