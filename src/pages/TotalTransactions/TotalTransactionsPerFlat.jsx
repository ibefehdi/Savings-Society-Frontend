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
    const [expenses, setExpenses] = useState([]);
    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const incomeResponse = await axiosInstance.get('/incomes/flats');
            const expenseResponse = await axiosInstance.get('/expenses/flats');
            setIncomes(incomeResponse.data.incomes);
            setExpenses(expenseResponse.data.expenses);
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
        },
        {
            field: 'totalExpenses',
            headerName: t('total_expenses'),
            flex: 1,
        },
        {
            field: 'profit',
            headerName: t('profit'),
            flex: 1,
            valueGetter: (params) => Number(params.row.totalIncome) - Number(params.row.totalExpenses),
        },
    ];

    const rows = incomes.map((income) => {
        const expense = expenses.find(
            (expense) => expense.flatId === income.flatId
        );
        return {
            id: income.flatId,
            buildingName: income.buildingName,
            flatNumber: income.flatNumber,
            totalIncome: income.totalIncome,
            totalExpenses: expense ? expense.totalExpenses : 0,
        };
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.totalIncome, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.totalExpenses, 0);
    const totalProfit = totalIncome - totalExpenses;

    // Add total income, total expenses, and total profit as the last row
    rows.push({
        id: 'total',
        buildingName: t('total'),
        flatNumber: '',
        totalIncome,
        totalExpenses,
        profit: totalProfit,
    });
    const orderedColumns = isRtl ? [...columns].reverse() : columns;

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box
                sx={{
                    width: '90%',
                    backgroundColor: '#FFF',
                    margin: '2rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    overflowX: 'auto',
                }}
            >
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '1.875rem',
                        flexGrow: 1,
                        marginLeft: '1.2rem',
                        marginBottom: '1rem',
                    }}
                >
                    {t('profit_report_per_flat')}
                </Typography>
                <BackButton />

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
                            fontSize: '1rem', // Increase the font size of the data cells
                            fontWeight: 'bold', // Make the data text bolder
                        },

                    }}
                    disableRowSelectionOnClick
                />
            </Box>
        </CacheProvider>
    );
};

export default TotalTransactionsPerFlat;