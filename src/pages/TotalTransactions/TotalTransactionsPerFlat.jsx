import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import axiosInstance from '../../constants/axiosInstance';
import BackButton from '../../components/BackButton';
import { saveAs } from 'file-saver';
import { Button, MenuItem, TextField } from '@mui/material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

const TotalTransactionsPerFlat = () => {
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const [pageNo, setPageNo] = useState(1);
    const { t, i18n } = useTranslation();
    const [pageSize, setPageSize] = useState(10);
    const [incomes, setIncomes] = useState([]);
    const isRtl = i18n.dir() === 'rtl';
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Fetch buildings for dropdown
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

    useEffect(() => {
        fetchData();
    }, [selectedBuilding]);

    const fetchData = async () => {
        try {
            const buildingQuery = selectedBuilding ? `/${selectedBuilding}` : '';
            const response = await axiosInstance.get(`/incomes/flats${buildingQuery}`);
            setIncomes(response.data.flats);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const columns = [
        {
            field: 'buildingName',
            headerName: t('building_name'),
            flex: 1,
        },
        {
            field: 'flatNumber',
            headerName: t('flat_number'),
            flex: 1,
        },
        {
            field: 'totalIncome',
            headerName: t('total_income'),
            flex: 1,
        }
    ];

    const rows = incomes.map((income) => ({
        id: income.flatId,
        buildingName: income.buildingName,
        flatNumber: income.flatNumber,
        totalIncome: income.totalIncome,
    }));

    const totalIncome = incomes.reduce((sum, income) => sum + income.totalIncome, 0);

    // Add total row
    rows.push({
        id: 'total',
        buildingName: t('total'),
        flatNumber: '',
        totalIncome
    });

    const orderedColumns = isRtl ? [...columns].reverse() : columns;

    const downloadCSV = () => {
        const buildingQuery = selectedBuilding ? `?buildingId=${selectedBuilding}` : '';
        axiosInstance.get(`/income-report-flat/export/${selectedBuilding}`, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveAs(blob, "income_report_by_flat.xlsx");
            })
            .catch(error => console.error('Download error!', error));
    };

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Button
                onClick={toggleFilters}
                variant="outlined"
                sx={{
                    backgroundColor: '#FFF',
                    marginLeft: '2rem',
                    marginTop: '2rem',
                    overflowX: 'auto',
                    marginRight: isRtl ? '2rem' : 0
                }}
            >
                <FilterListOutlinedIcon /> {t('filter')}
            </Button>

            {showFilters && (
                <Box sx={{
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
                }}>
                    <TextField
                        label={t('building')}
                        variant="outlined"
                        select
                        value={selectedBuilding}
                        onChange={(e) => setSelectedBuilding(e.target.value)}
                        fullWidth
                        autoComplete='off'
                    >
                        <MenuItem value="">
                            {t('all_buildings')}
                        </MenuItem>
                        {buildings.map((building) => (
                            <MenuItem key={building._id} value={building._id}>
                                {building.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )}

            <Box sx={{
                width: '90%',
                backgroundColor: '#FFF',
                margin: '2rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                overflowX: 'auto',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: '1.875rem',
                            flexGrow: 1,
                            marginLeft: '1.2rem',
                        }}
                    >
                        {t('profit_report_per_flat')}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={downloadCSV}
                        sx={{ marginRight: '1rem' }}
                    >
                        {t('export_xlsx')}
                    </Button>
                    <BackButton />
                </Box>

                <DataGrid
                    rows={rows}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    page={pageNo}
                    getRowId={(row) => row.id}
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
                        direction: isRtl ? 'rtl' : 'ltr',
                        textAlign: isRtl ? "right" : 'left',
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
                            fontSize: '0.875rem',
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </Box>
        </CacheProvider>
    );
};

export default TotalTransactionsPerFlat;