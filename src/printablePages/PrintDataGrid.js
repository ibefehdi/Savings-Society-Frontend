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
  background-color: #15533B;
  color: white;
  padding: 10px 5px;
  direction: rtl;
`;

const StyledTd = styled.td`
  padding: 4px 15px;
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
    console.log(data)
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
                            <StyledTh>الاسهم</StyledTh>
                            <StyledTh>الرقم المدني</StyledTh>
                            <StyledTh>المدخرات </StyledTh>
                            <StyledTh>أرباح الاسهم</StyledTh>
                            <StyledTh>أرباح المدخرات</StyledTh>
                            <StyledTh>الإجمالي</StyledTh>
                            <StyledTh>أمانات</StyledTh>
                            {/* <StyledTh>الاستثمار المبدائي المدخرات</StyledTh>
                            <StyledTh>القيمة المبدائية للسهم</StyledTh> */}
                            <StyledTh>الرصيد</StyledTh>
                            <StyledTh>أجمالي</StyledTh>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <TableRow key={row._id}>
                                <StyledTd>{row?.membersCode}</StyledTd>
                                <StyledTd>{row?.fullName}</StyledTd>
                                <StyledTd>{row?.civilId}</StyledTd>
                                <StyledTd>{row.savingsCurrentAmount ? row.savingsCurrentAmount.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.savingsDetails?.year || 'N/A'}</StyledTd>
                                <StyledTd>{row.savingsIncrease ? row.savingsIncrease.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.shareDetails?.totalAmount.toFixed(3)}</StyledTd>
                                <StyledTd>{row.shareDetails?.totalAmount.toFixed(3)}</StyledTd>
                                <StyledTd>{row.totalShareIncrease ? row.totalShareIncrease.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.amanatAmount ? row.amanatAmount.toFixed(3) : 'N/A'}</StyledTd>
                                <StyledTd>{row.total ? row.total.toFixed(3) : 'N/A'}</StyledTd>
                            </TableRow>
                        ))}
                    </tbody>
                </StyledTable>
            </TableContainer>
        </div>
    );
});

export default PrintDataGrid;
