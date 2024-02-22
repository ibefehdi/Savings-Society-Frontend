import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from './pages/Layout';
import Home from './pages/Home';
import Reports from './pages/Reports';
const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, 
      { path: 'reports', element: <Reports /> },
       
    ]
  },
  {
    path: "*",
    element: <Layout> <div>Not found </div> </Layout>
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>


);
