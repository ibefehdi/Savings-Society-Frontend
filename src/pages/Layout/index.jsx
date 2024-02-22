import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Outlet } from 'react-router-dom'; // Import Outlet
import "./Layout.css"
import Topbar from '../../components/Topbar';
const Layout = () => {
    const menuItems = [
        { name: 'Home', icon: <HomeOutlinedIcon />, path: "/" },
        { name: 'Reports', icon: <AssessmentOutlinedIcon />, path: "/reports" },
    ];
    return (
        <div className="app-container">
            <Topbar />
            <div className="flex-container"> {/* Flex container */}
                <DashboardSidebar menuItems={menuItems} />
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );

};

export default Layout;