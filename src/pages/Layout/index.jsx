import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

import { Outlet } from 'react-router-dom';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import "./Layout.css"
import Topbar from '../../components/Topbar';
import { useTranslation } from 'react-i18next';
const Layout = () => {
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    const shareholderMenuItems = [
        { name: t('home'), icon: <HomeOutlinedIcon />, path: "/shareholder/" },
        { name: t('users'), icon: <GroupOutlinedIcon />, path: "/shareholder/Users" },
        { name: t('shareholders'), icon: <RecentActorsOutlinedIcon />, path: "/shareholder/Shareholders" },
        {
            name: t('workplaces'),
            icon: <FileCopyOutlinedIcon />,
            path: "/shareholder/workplaces"
        },
        {
            name: t('deposits'),
            icon: <LocalAtmIcon />,
            subMenus: [
                { name: t('share'), path: "/shareholder/Deposit/Shares" },
                { name: t('savings'), path: "/shareholder/Deposit/Savings" }
            ]
        },
        {
            name: t('withdrawals'),
            icon: <LocalAtmIcon />,
            subMenus: [
                { name: t('share'), path: "/shareholder/Withdrawal/Shares" },
                { name: t('savings'), path: "/shareholder/Withdrawal/Savings" }
            ]
        },
        { name: t('amanat'), icon: <HandshakeOutlinedIcon />, path: "/shareholder/Amanat" },
        { name: t('deposit_history'), icon: <HistoryOutlinedIcon />, path: "/shareholder/deposithistory" },
        { name: t('withdrawal_history'), icon: <HistoryOutlinedIcon />, path: "/shareholder/withdrawalhistory" },

        {
            name: t('financial_configuration'),
            icon: <SettingsOutlinedIcon />,
            subMenus: [
                { name: t('share'), path: "/shareholder/Financial/Share" },
                { name: t('savings'), path: "/shareholder/Financial/Savings" }
            ]
        },
        // { name: t('financial_reporting'), icon: <RecentActorsOutlinedIcon />, path: "/financialreporting" },
        {
            name: t('financial_reporting'),
            icon: <RecentActorsOutlinedIcon />,
            subMenus: [
                { name: t('join_year'), path: "/shareholder/financialreporting/year" },
                { name: t('quit_year'), path: "/shareholder/financialReporting/quityear" },
                { name: t('workplace'), path: "/shareholder/FinancialReporting/workplace" },
                { name: t('custom'), path: "/shareholder/financialreporting" },
            ]
        },
        {
            name: t('print_forms'),
            icon: <FileCopyOutlinedIcon />,
            subMenus: [
                { name: t('receipt_voucher'), path: "/shareholder/Forms/ReceiptVoucher" },
                { name: t('withdrawal_form'), path: "/shareholder/Forms/WithdrawalForm" },
                { name: t('deposit_form'), path: "/shareholder/Forms/DepositForm" },
                { name: t('death_form'), path: "/shareholder/Forms/DeathForm" }

            ]
        },

    ];
    const rentalMenuItems = [
        { name: t('home'), icon: <HomeOutlinedIcon />, path: "/shareholder/" },]
    let menuItems = [];
    if (userDetails?.type.includes('Shareholder')) {
        menuItems = [...menuItems, ...shareholderMenuItems];
    }
    if (userDetails?.type.includes('Rental')) {
        menuItems = [...menuItems, ...rentalMenuItems];
    }
    return (

        <div className={`app-container ${isRtl ? 'flex-container-rtl' : ''}`}>
            <Topbar />
            <div className={`flex-container ${isRtl ? 'flex-container-rtl' : ''}`}>
                <DashboardSidebar menuItems={menuItems} />
                <div className={`content ${isRtl ? 'content-rtl' : ''}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );

};

export default Layout;