import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo1.png';

const TableContainer = styled.div`
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: auto;
  direction: rtl;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  direction: rtl;
`;

const StyledTh = styled.th`
  background-color: #00a550;
  color: white;
  padding: 10px 15px;
  direction: rtl;
`;

const StyledTd = styled.td`
  padding: 8px 15px;
  border-bottom: 1px solid #ddd;
  direction: rtl;
`;

const TableRow = styled.tr`
  &:nth-child(even) {background-color: #f2f2f2;}
  direction: rtl;
`;


const PrintDataGrid = React.forwardRef(({ data, filters }, ref) => {
    const keyTranslations = {
        serial: 'رقم العضو',
        fName: 'اسم',
        civilId: 'الرقم المدني',
        gender: "جنس"
    };
    // Function to create filter string
    const createFilterString = (filters) => {
        return Object.entries(filters)
            .map(([key, value]) => `${keyTranslations[key] || key}: ${value}`)
            .join(', ');
    };

    return (
        <div ref={ref}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: "1rem" }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: '0', textAlign: 'center' }}>Co-operative Society of Savings</h1>
                    <p style={{ margin: '0', textAlign: 'center' }}>For Kuwait Staff in Government</p>
                    <p style={{ margin: '0', textAlign: 'center' }}>Tel: 22610345 - 22641090 - Fax: 22619360</p>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <img src={logo} alt='logo' style={{ height: '100px', width: '100px' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    <h1 style={{ margin: '0', textAlign: 'center' }}>الجمعية التعاونية لموظفي الحكومة الكويتيين (للادخار)</h1>
                </div>
            </div>
            <h3 style={{ textAlign: 'center' }}>{createFilterString(filters)}</h3>
            <TableContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <StyledTh>رقم العضو</StyledTh>
                            <StyledTh>اسم العضو</StyledTh>
                            <StyledTh>الرقم المدني</StyledTh>
                            <StyledTh>الاستثمار المبدائي المدخرات</StyledTh>
                            <StyledTh>المدخرات </StyledTh>
                            <StyledTh>أرباح المدخرات</StyledTh>
                            <StyledTh>الاسهم</StyledTh>
                            <StyledTh>القيمة المبدائية للسهم</StyledTh>
                            <StyledTh>أرباح الاسهم</StyledTh>
                            <StyledTh>أمانات</StyledTh>
                            <StyledTh>الإجمالي </StyledTh>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <TableRow key={row._id}>
                                <StyledTd>{row.serial}</StyledTd>
                                <StyledTd>{row.fullName}</StyledTd>
                                <StyledTd>{row.civilId}</StyledTd>
                                <StyledTd>{row.savings ? row.savings.initialAmount.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.savings ? row.savings.currentAmount.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.savingsIncrease ? row.savingsIncrease.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.share?.initialAmount.toFixed(3) ?? 'N/A'}</StyledTd>
                                <StyledTd>{row.share?.currentAmount.toFixed(3) ?? 'N/A'}</StyledTd>
                                <StyledTd>{row.shareIncrease ? row.shareIncrease.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.savings && row.savings.amanat ? row.savings.amanat.amount.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.total.toFixed(3)}</StyledTd>
                            </TableRow>
                        ))}
                    </tbody>
                </StyledTable>
            </TableContainer>
        </div>
    );
});

export default PrintDataGrid;
