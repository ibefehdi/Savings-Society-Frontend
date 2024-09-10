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

    // Function to create a unique key for each menu item
    const createKey = (item) => {
        return item.nameKey || item.path || JSON.stringify(item.subMenus?.map(sub => sub.path));
    };

    // Create a Map to store unique menu items
    const uniqueMenuItems = new Map();

    // Function to add items to the Map
    const addToMap = (items) => {
        items.forEach(item => {
            const key = createKey(item);
            if (!uniqueMenuItems.has(key)) {
                uniqueMenuItems.set(key, item);
            }
        });
    };

    const adminShareholderMenuItems = [
        { name: t('users'), nameKey: 'users', icon: <GroupOutlinedIcon />, path: "/shareholder/Users" },
        { name: t('workplaces'), nameKey: 'workplaces', icon: <FileCopyOutlinedIcon />, path: "/shareholder/workplaces" },
        {
            name: t('financial_reporting'), nameKey: 'financial_reporting',
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
        { name: t('home'), nameKey: 'home', icon: <HomeOutlinedIcon />, path: "/shareholder/" },
        { name: t('active_shareholderss'), nameKey: 'active_shareholders', icon: <RecentActorsOutlinedIcon />, path: "/shareholder/Shareholders" },
        { name: t('inactive_shareholders'), nameKey: 'inactive_shareholders', icon: <RecentActorsOutlinedIcon />, path: "/shareholder/DisabledShareholders" },
        {
            name: t('deposit_and_withdrawal'), nameKey: 'deposit_and_withdrawal',
            icon: <LocalAtmIcon />,
            subMenus: [
                { name: t('share'), path: "/shareholder/Deposit/Shares" },
                { name: t('savings'), path: "/shareholder/Deposit/Savings" },
                { name: t('shareholder_withdrawal'), path: "/shareholder/withdraw/" }
            ]
        },
        { name: t('amanat'), nameKey: 'amanat', icon: <HandshakeOutlinedIcon />, path: "/shareholder/Amanat" },
        { name: t('deposit_history'), nameKey: 'deposit_history', icon: <HistoryOutlinedIcon />, path: "/shareholder/deposithistory" },
        { name: t('withdrawal_history'), nameKey: 'withdrawal_history', icon: <HistoryOutlinedIcon />, path: "/shareholder/withdrawalhistory" },
        { name: t('transfer_history'), nameKey: 'transfer_history', icon: <HistoryOutlinedIcon />, path: "/shareholder/TransferHistory" },
        {
            name: t('financial_configuration'), nameKey: 'financial_configuration',
            icon: <SettingsOutlinedIcon />,
            subMenus: [
                { name: t('share'), path: "/shareholder/Financial/Share" },
                { name: t('savings'), path: "/shareholder/Financial/Savings" }
            ]
        },
        {
            name: t('print_forms'), nameKey: 'shareholder_print_forms',
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
                { name: t('special_leave_page'), path: "/shareholder/Forms/SpecialLeavePage" },
                { name: t('resignation_form'), path: "/rental/Forms/ResignationForm" },
            ]
        },
    ];

    const adminRentalMenuItems = [
        { name: t('users'), nameKey: 'rental_users', icon: <GroupOutlinedIcon />, path: "/rental/Users" },
    ];

    const nonAdminRentalMenuItems = [
        {
            name: t('real_estate'), nameKey: 'real_estate',
            icon: <ApartmentOutlinedIcon />,
            subMenus: [
                { name: t('buildings'), path: "/rental/buildings" },
                { name: t('flats'), path: "/rental/flats" },
                { name: t('data_of_tenants'), path: "/rental/tenants" },
                { name: t('bookings'), path: "/rental/booking" }
            ]
        },
        {
            name: t('hall_transactions'), nameKey: 'hall_transactions',
            icon: <ReceiptOutlinedIcon />,
            subMenus: [
                { name: t('income'), path: "/rental/hallincome" },
                { name: t('expenses'), path: "/rental/hallExpenses" }
            ]
        },
        { name: t('vouchers'), nameKey: 'vouchers', icon: <ConfirmationNumberOutlinedIcon />, path: "/rental/vouchers" },
        // {
        //     name: t('building_transaction'), nameKey: 'building_transaction',
        //     icon: <AccountBalanceWalletOutlinedIcon />,
        //     subMenus: [
        //         { name: t('income'), path: "/rental/flatIncome" },
        //         { name: t('expenses'), path: "/rental/flatExpenses", isAdmin: true }
        //     ]
        // },
        { name: t('contracts'), nameKey: 'contracts', icon: <DescriptionOutlinedIcon />, path: "/rental/contracts" },
        { name: t('profit_report_per_building'), nameKey: 'profit_report_per_building', icon: <LocalAtmIcon />, path: "/rental/ProfitReport" },
        { name: t('profit_report_per_flat'), nameKey: 'profit_report_per_flat', icon: <LocalAtmIcon />, path: "/rental/Profitreportperflat" },
        {
            name: t('rental_print_forms'), nameKey: 'rental_print_forms',
            icon: <FileCopyOutlinedIcon />,
            subMenus: [
                { name: t('board_member_reward'), path: "/rental/Forms/BoardMemberReward" },
                { name: t('return_from_leave'), path: "/rental/Forms/ReturnFromLeavePage" },
                { name: t('periodic_leave_page'), path: "/rental/Forms/PeriodicLeavePage" },
                { name: t('special_leave_page'), path: "/rental/Forms/SpecialLeavePage" },
                { name: t('property_evacuation_form'), path: "/rental/Forms/PropertyEvacuationForm" },
                { name: t('check_disbursement_form'), path: "/rental/Forms/CheckDisbursementForm" },
                { name: t('rent_notice'), path: "/rental/Forms/RentNoticeForm" },
            ]
        },
    ];

    // Add all menu items to the Map
    if (userDetails?.type.includes('Shareholder')) {
        addToMap(userDetails?.isAdmin ? [...nonAdminShareholderMenuItems, ...adminShareholderMenuItems] : nonAdminShareholderMenuItems);
    }
    if (userDetails?.type.includes('Rental')) {
        addToMap(userDetails?.isAdmin ? [...nonAdminRentalMenuItems, ...adminRentalMenuItems] : nonAdminRentalMenuItems);
    }

    // Convert the Map back to an array
    const menuItems = Array.from(uniqueMenuItems.values());

    // Add divider if both Shareholder and Rental types are present
    if (userDetails?.type.includes('Shareholder') && userDetails?.type.includes('Rental')) {
        const dividerIndex = menuItems.findIndex(item => item.path && item.path.startsWith('/rental'));
        if (dividerIndex !== -1) {
            menuItems.splice(dividerIndex, 0, { divider: true });
        }
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