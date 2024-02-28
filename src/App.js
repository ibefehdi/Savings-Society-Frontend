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

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
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
        {
          path: 'Shareholders/:id', 
          element: <ShareholderDetails /> 
        },
        { path: 'Financial/Share', element: <ShareConfiguration /> }
      ] : [],
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
