import './App.css';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme"
import axiosInstance from './constants/axiosInstance';
import DashboardSidebar from './components/DashboardSidebar';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Login from './pages/Login';
function App() {
  const menuItems = [
    { name: 'Home', icon: <HomeOutlinedIcon />, path: "/" },
    { name: 'Reports', icon: <AssessmentOutlinedIcon />, path: "/reports" },
  ];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Login />
    </ThemeProvider>
  );
}

export default App;
