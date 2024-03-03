import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Outlet } from 'react-router-dom'; // Import Outlet
import "./Layout.css"
import Topbar from '../../components/Topbar';
const Layout = () => {
    const menuItems = [
        { name: 'Home', icon: <HomeOutlinedIcon />, path: "/" },
        { name: 'Users', icon: <GroupOutlinedIcon />, path: "/Users" },
        { name: 'Shareholders', icon: <RecentActorsOutlinedIcon />, path: "/Shareholders" },
        {
            name: 'Withdrawals',
            icon: <LocalAtmIcon />,
            subMenus: [
                { name: 'Share', path: "/Withdrawal/Shares" },
                { name: 'Savings', path: "/Withdrawal/Savings" }
            ]
        },
        {
            name: 'Financial Configuration',
            icon: <SettingsOutlinedIcon />,
            subMenus: [
                { name: 'Share', path: "/Financial/Share" },
                { name: 'Savings', path: "/Financial/Savings" }
            ]
        },

    ];
    return (
        <div className="app-container">
            <Topbar />
            <div className="flex-container">
                <DashboardSidebar menuItems={menuItems} />
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );

};

export default Layout;