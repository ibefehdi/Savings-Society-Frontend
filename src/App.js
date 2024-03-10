import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cookies from 'js-cookie'; // Import js-cookie

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

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')))

  useEffect(() => {
    
    console.log("this is the token: " + token);
    console.log("This is the authenticated state", authenticated);
    setAuthenticated(!!token);
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: authenticated ? <Layout /> : <Login />,
      children: authenticated ? [
        { index: true, element: <Home /> },
        { path: 'Users', element: <Users /> },
        { path: 'Shareholders', element: <Shareholders /> },
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
        { path: 'Amanat', element: <Amanat /> }

      ] : [],
    },
    {
      path: "printsavingswithdrawal/:id",
      element: <ShareholderDetails />
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
