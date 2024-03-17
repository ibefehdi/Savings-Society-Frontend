import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';

const TableContainer = styled.div`
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const StyledTh = styled.th`
  background-color: #00a550;
  color: white;
  padding: 10px 15px;
`;

const StyledTd = styled.td`
  padding: 8px 15px;
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {background-color: #f2f2f2;}
`;

const PrintDataGrid = React.forwardRef(({ data }, ref) => (
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
                {/* <h1 style={{ margin: '0' }}>الجمعية التعاونية للادخار</h1> */}
                <h1 style={{ margin: '0', textAlign: 'center' }}>الجمعية التعاونية لموظفي الحكومة الكويتيين (للادخار)</h1>
            </div>
        </div>

        <TableContainer>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh>Serial</StyledTh>
                        <StyledTh>Full Name</StyledTh>
                        <StyledTh>Civil ID</StyledTh>
                        <StyledTh>Initial Investment</StyledTh>
                        <StyledTh>Current Amount</StyledTh>
                        <StyledTh>Savings Increase</StyledTh>

                        <StyledTh>Initial Share Amount</StyledTh>
                        <StyledTh>Current Share Amount</StyledTh>
                        <StyledTh>Share Increase</StyledTh>

                        <StyledTh>Amanat Amount</StyledTh>
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
                        </TableRow>
                    ))}
                </tbody>
            </StyledTable>
        </TableContainer>
    </div>

));

export default PrintDataGrid;
