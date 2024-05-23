import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from './pages/Layout';
import Home from './pages/Home';
import Users from './pages/Users';
import Shareholders from './pages/Shareholders';
import Login from './pages/Login';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme"
import ShareConfiguration from './pages/ShareConfiguration';
import ShareholderDetails from './pages/ShareholderDetails';
import SavingsConfiguration from './pages/SavingsConfiguration';
import SavingsWithdrawalPage from './pages/Withdrawals/SavingsWithdrawalPage';
import SharesWithdrawalPage from './pages/Withdrawals/SharesWithdrawalPage';
import SavingsDepositPage from './pages/Deposits/SavingsDepositPage';
import SharesDepositPage from './pages/Deposits/SharesDepositPage';
import ReceiptVoucher from './pages/ReceiptVoucher';
import WithdrawalFormPage from './pages/WithdrawalFormPage';
import DepositFormPage from './pages/DepositFormPage';
import Amanat from './pages/Amanat';
import DeathFormPage from './pages/DeathFormPage';
import FinancialReporting from './pages/FinancialReporting';
import DepositHistory from './pages/DepositHistory';
import WithdrawalHistory from './pages/WithdrawalHistory';
import Workplaces from './pages/Workplaces';
import FinancialReportingYear from './pages/FinancialReporting/FinancialReportingYear';
import FinancialReportsByQuitYear from './pages/FinancialReporting/FinancialReportsByQuitYear';
import FinancialReportingByWorkplace from './pages/FinancialReporting/FinancialReportingByWorkplace';
import Buildings from './pages/Buildings';
import Flats from './pages/Flats';
import FlatDetails from './pages/FlatDetails';
import Halls from './pages/Halls';
import Booking from './pages/Booking';
import BookingTimeline from './pages/BookingTimeline';
import Transactions from './pages/Transactions';
import Vouchers from './pages/Vouchers';
import BuildingTransactions from './pages/Transactions/BuildingTransactions';
import Contracts from './pages/Contracts';
import ProfitReport from './pages/TotalTransactions';
import TotalTransactionsPerFlat from './pages/TotalTransactions/TotalTransactionsPerFlat';
import RentPaymentNoticePage from './pages/RentPaymentNoticePage';
import CheckWithdrawalPage from './pages/CheckWithdrawalPage';
import BoardMemberRewardFormPage from './pages/BoardMemberRewardFormPage';
import ReturnFromLeavePage from './pages/ReturnFromLeavePage';
import CashWithdrawalPage from './pages/CashWithdrawalPage';
import MembershipApplicationFormPage from './pages/MembershipApplicationFormPage';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token'))

  useEffect(() => {

    console.log("this is the token: " + token);
    console.log("This is the authenticated state", authenticated);
    setAuthenticated(!!token);
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: authenticated ? <Layout /> : <Login />,
      children: authenticated ? [{ index: true, element: <Home /> }] : []
    },
    {
      path: "/rental",
      element: authenticated ? <Layout /> : <Login />,
      children: authenticated ? [
        { index: true, element: <Home /> },
        { path: 'Users', element: <Users /> },
        { path: 'Buildings', element: <Buildings /> },
        { path: 'Flats/', element: <Flats /> },
        { path: 'Flats/:id', element: <Flats /> },
        { path: 'Flat/:id', element: <FlatDetails /> },
        { path: 'Halls', element: <Halls /> },
        { path: 'booking', element: <Booking /> },
        { path: 'bookhall/:id', element: <BookingTimeline /> },
        { path: 'halltransactions', element: <Transactions /> },
        { path: 'vouchers', element: <Vouchers /> },
        { path: 'buildingtransactions', element: <BuildingTransactions /> },
        { path: 'contracts', element: <Contracts /> },
        { path: 'ProfitReport', element: <ProfitReport /> },
        { path: 'Profitreportperflat', element: <TotalTransactionsPerFlat /> }

      ] : []
    },
    {
      path: '/shareholder',
      element: authenticated ? <Layout /> : <Login />,
      children: authenticated ? [
        { index: true, element: <Users /> },
        { path: 'Users', element: <Users /> },
        { path: 'Shareholders', element: <Shareholders /> },
        { path: "Financialreporting", element: <FinancialReporting /> },
        { path: "Financialreporting/year", element: <FinancialReportingYear /> },
        { path: "FinancialReporting/quityear", element: <FinancialReportsByQuitYear /> },
        { path: "FinancialReporting/workplace", element: <FinancialReportingByWorkplace /> },
        { path: 'Shareholders/:id', element: <ShareholderDetails /> },
        { path: 'Financial/Share', element: <ShareConfiguration /> },
        { path: 'Financial/Savings', element: <SavingsConfiguration /> },
        { path: 'Withdrawal/Savings', element: <SavingsWithdrawalPage /> },
        { path: 'Withdrawal/Shares', element: <SharesWithdrawalPage /> },
        { path: 'Deposit/Savings', element: <SavingsDepositPage /> },
        { path: 'Deposit/Shares', element: <SharesDepositPage /> },
        { path: 'Forms/ReceiptVoucher', element: <ReceiptVoucher /> },
        { path: 'Forms/WithdrawalForm', element: <WithdrawalFormPage /> },
        { path: 'Forms/DepositForm', element: <DepositFormPage /> },
        { path: 'Forms/DeathForm', element: <DeathFormPage /> },
        { path: 'Forms/RentPaymentNotice', element: <RentPaymentNoticePage /> },
        { path: 'Forms/Checkwithdrawal', element: <CheckWithdrawalPage /> },
        { path: 'Forms/BoardMemberReward', element: <BoardMemberRewardFormPage /> },
        { path: "Forms/ReturnFromLeavePage", element: <ReturnFromLeavePage /> },
        { path: "Forms/CashWithdrawalPage", element: <CashWithdrawalPage /> },
        { path: "Forms/MembershipApplicationFormPage", element: <MembershipApplicationFormPage /> },

        { path: 'Amanat', element: <Amanat /> },
        { path: 'deposithistory', element: <DepositHistory /> },
        { path: 'withdrawalhistory', element: <WithdrawalHistory /> },
        { path: 'workplaces', element: <Workplaces /> }

      ] : [],
    },
    {
      path: "/shareholderno/:id",
      element: authenticated ? <Layout /> : <Login />,
      children: authenticated ? [
        { index: true, element: <ShareholderDetails /> }
      ] : []
    },
    {
      path: "*",
      element: <Layout><div>Not found</div></Layout>
    }
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
