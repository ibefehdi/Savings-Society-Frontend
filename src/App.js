import './App.css';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./theme"
import axiosInstance from './constants/axiosInstance';
import DashboardSidebar from './components/DashboardSidebar';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
function App() {
  const menuItems = [
    { name: 'Dashboard', icon: <HomeOutlinedIcon /> },
    { name: 'Reports', icon: <AssessmentOutlinedIcon /> },
    // ... more items
  ];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardSidebar menuItems={menuItems} />
    </ThemeProvider>

  );
}

export default App;
