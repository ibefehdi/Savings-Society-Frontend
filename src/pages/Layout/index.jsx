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

    const menuItems = [
        { name: t('home'), icon: <HomeOutlinedIcon />, path: "/" },
        { name: t('users'), icon: <GroupOutlinedIcon />, path: "/Users" },
        { name: t('shareholders'), icon: <RecentActorsOutlinedIcon />, path: "/Shareholders" },
        {
            name: t('workplaces'),
            icon: <FileCopyOutlinedIcon />,
            path: "/workplaces"
        },
        {
            name: t('deposits'),
            icon: <LocalAtmIcon />,
            subMenus: [
                { name: t('share'), path: "/Deposit/Shares" },
                { name: t('savings'), path: "/Deposit/Savings" }
            ]
        },
        {
            name: t('withdrawals'),
            icon: <LocalAtmIcon />,
            subMenus: [
                { name: t('share'), path: "/Withdrawal/Shares" },
                { name: t('savings'), path: "/Withdrawal/Savings" }
            ]
        },
        { name: t('amanat'), icon: <HandshakeOutlinedIcon />, path: "/Amanat" },
        { name: t('deposit_history'), icon: <HistoryOutlinedIcon />, path: "/deposithistory" },
        { name: t('withdrawal_history'), icon: <HistoryOutlinedIcon />, path: "/withdrawalhistory" },

        {
            name: t('financial_configuration'),
            icon: <SettingsOutlinedIcon />,
            subMenus: [
                { name: t('share'), path: "/Financial/Share" },
                { name: t('savings'), path: "/Financial/Savings" }
            ]
        },
        // { name: t('financial_reporting'), icon: <RecentActorsOutlinedIcon />, path: "/financialreporting" },
        {
            name: t('financial_reporting'),
            icon: <RecentActorsOutlinedIcon />,
            subMenus: [
                { name: t('join_year'), path: "/financialreporting/year" },
                { name: t('quit_year'), path: "/financialReporting/quityear" },
                { name: t('workplace'), path: "/FinancialReporting/workplace" },
                { name: t('custom'), path: "/financialreporting" },
            ]
        },
        {
            name: t('print_forms'),
            icon: <FileCopyOutlinedIcon />,
            subMenus: [
                { name: t('receipt_voucher'), path: "/Forms/ReceiptVoucher" },
                { name: t('withdrawal_form'), path: "/Forms/WithdrawalForm" },
                { name: t('deposit_form'), path: "/Forms/DepositForm" },
                { name: t('death_form'), path: "Forms/DeathForm" }

            ]
        },

    ];
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