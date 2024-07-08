import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import { Outlet } from 'react-router-dom';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import "./Layout.css"
import Topbar from '../../components/Topbar';
import { useTranslation } from 'react-i18next';
const Layout = () => {
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    const adminShareholderMenuItems = [
        { name: t('users'), icon: <GroupOutlinedIcon />, path: "/shareholder/Users" },
        {
            name: t('workplaces'),
            icon: <FileCopyOutlinedIcon />,
            path: "/shareholder/workplaces"
        },
        {
            name: t('financial_reporting'),
            icon: <RecentActorsOutlinedIcon />,
            subMenus: [
                { name: t('join_year'), path: "/shareholder/financialreporting/year" },
                { name: t('quit_year'), path: "/shareholder/financialReporting/quityear" },
                { name: t('workplace'), path: "/shareholder/FinancialReporting/workplace" },
                { name: t('amanat'), path: "/shareholder/Financialreporting/amanat" },

                { name: t('custom'), path: "/shareholder/financialreporting" },
            ]
        },
    ];

    const nonAdminShareholderMenuItems = [
        { name: t('home'), icon: <HomeOutlinedIcon />, path: "/shareholder/" },
        { name: t('active_shareholderss'), icon: <RecentActorsOutlinedIcon />, path: "/shareholder/Shareholders" },
        { name: t('inactive_shareholders'), icon: <RecentActorsOutlinedIcon />, path: "/shareholder/DisabledShareholders" },
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
        { name: t('transfer_history'), icon: <HistoryOutlinedIcon />, path: "/shareholder/TransferHistory" },
        {
            name: t('financial_configuration'),
            icon: <SettingsOutlinedIcon />,
            subMenus: [
                { name: t('share'), path: "/shareholder/Financial/Share" },
                { name: t('savings'), path: "/shareholder/Financial/Savings" }
            ]
        },
        {
            name: t('financial_reporting'),
            icon: <RecentActorsOutlinedIcon />,
            subMenus: [
                { name: t('join_year'), path: "/shareholder/financialreporting/year" },
                { name: t('quit_year'), path: "/shareholder/financialReporting/quityear" },
                { name: t('workplace'), path: "/shareholder/FinancialReporting/workplace" },
                { name: t('amanat'), path: "/shareholder/Financialreporting/amanat" },
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
                { name: t('death_form'), path: "/shareholder/Forms/DeathForm" },
                { name: t('rent_notice'), path: "/shareholder/Forms/RentPaymentNotice" },
                { name: t('check_withdrawal'), path: "/shareholder/Forms/Checkwithdrawal" },
                { name: t('board_member_reward'), path: "/shareholder/Forms/BoardMemberReward" },
                { name: t('return_from_leave'), path: "/shareholder/Forms/ReturnFromLeavePage" },
                { name: t('cash_withdrawal_page'), path: "/shareholder/Forms/CashWithdrawalPage" },
                { name: t('membership_application'), path: "/shareholder/Forms/MembershipApplicationFormPage" },
                { name: t("shares_savings_page"), path: "/shareholder/Forms/SharesAndSavingsPage" },
                { name: t('savings_withdrawal_form'), path: "/shareholder/Forms/SavingsWithdrawalPage" },
                { name: t('periodic_leave_page'), path: "/shareholder/Forms/PeriodicLeavePage" },
                { name: t('special_leave_page'), path: "/shareholder/Forms/SpecialLeavePage" }
            ]
        },
    ];

    const shareholderMenuItems = userDetails?.isAdmin
        ? [...nonAdminShareholderMenuItems, ...adminShareholderMenuItems]
        : nonAdminShareholderMenuItems;



    const adminRentalMenuItems = [
        { name: t('users'), icon: <GroupOutlinedIcon />, path: "/rental/Users" },
    ];

    const nonAdminRentalMenuItems = [
        { name: t('buildings'), icon: <ApartmentOutlinedIcon />, path: "/rental/buildings" },
        { name: t('flats'), icon: <MapsHomeWorkOutlinedIcon />, path: "/rental/flats" },
        {
            name: t('halls'),
            icon: <MeetingRoomOutlinedIcon />,
            path: "/rental/halls",
            subMenus: [
                { name: t('bookings'), path: "/rental/booking" }
            ]
        },
        {
            name: t('hall_transactions'),
            icon: <ReceiptOutlinedIcon />,
            subMenus: [
                { name: t('income'), path: "/rental/hallincome" },
                { name: t('expenses'), path: "/rental/hallExpenses" }
            ]
        },
        { name: t('vouchers'), icon: <ConfirmationNumberOutlinedIcon />, path: "/rental/vouchers" },
        { name: t('tenants'), icon: <ConfirmationNumberOutlinedIcon />, path: "/rental/tenants" },

        {
            name: t('building_transaction'),
            icon: <AccountBalanceWalletOutlinedIcon />,
            subMenus: [
                { name: t('income'), path: "/rental/flatIncome" },
                { name: t('expenses'), path: "/rental/flatExpenses" }
            ]
        },
        { name: t('contracts'), icon: <DescriptionOutlinedIcon />, path: "/rental/contracts" },
        { name: t('profit_report_per_building'), icon: <LocalAtmIcon />, path: "/rental/ProfitReport" },
        { name: t('profit_report_per_flat'), icon: <LocalAtmIcon />, path: "/rental/Profitreportperflat" },
        {
            name: t('rental_print_forms'),
            icon: <FileCopyOutlinedIcon />,
            subMenus: [
                { name: t('board_member_reward'), path: "/rental/Forms/BoardMemberReward" },
                { name: t('return_from_leave'), path: "/rental/Forms/ReturnFromLeavePage" },
                { name: t('periodic_leave_page'), path: "/rental/Forms/PeriodicLeavePage" },
                { name: t('special_leave_page'), path: "/rental/Forms/SpecialLeavePage" }
            ]
        },
    ];

    const rentalMenuItems = userDetails?.isAdmin
        ? [...nonAdminRentalMenuItems, ...adminRentalMenuItems]
        : nonAdminRentalMenuItems;
    let menuItems = [];
    if (userDetails?.type.includes('Shareholder')) {
        menuItems = [...menuItems, ...shareholderMenuItems];
    }
    if (userDetails?.type.includes('Rental')) {
        if (menuItems.length > 0) {
            menuItems.push({ divider: true }); // Add the custom divider
        }
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