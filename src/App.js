import './App.css';
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { theme } from "./theme"
import axiosInstance from './constants/axiosInstance';
import DashboardSidebar from './components/DashboardSidebar';

import Login from './pages/Login';
import Cookies from 'js-cookie'; // Import js-cookie

import { useEffect, useState } from 'react';
import Layout from './pages/Layout';
function App() {

  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setAuthenticated(true);

    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {authenticated ? (
        <div >
          {authenticated && <Layout />}
        </div>
      ) : (
        <Login />
      )}
    </ThemeProvider>
  );
}

export default App;
