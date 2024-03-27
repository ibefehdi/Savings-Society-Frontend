import React, { useEffect, useState, } from "react";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Typography
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language"; // Import an icon for the language menu

import PersonIcon from "@mui/icons-material/Person";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
const Topbar = () => {
    const { i18n, t } = useTranslation();

    const lngs = {
        en: { nativeName: "English" },
        ar: { nativeName: "Arabic" },
    };
    const toggleLanguage = () => {
        const newLang = i18n.resolvedLanguage === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };
    const buttonText = i18n.resolvedLanguage === 'en' ? 'AR' : 'EN';

    const navigate = useNavigate()
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
    const handleUserMenuClick = (event) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleLanguageMenuClick = (event) => {
        setLanguageMenuAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageMenuAnchorEl(null);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        handleLanguageMenuClose();
    };


    const handleMenuLogout = () => {
        Cookies.remove('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userDetails');
        navigate('/', { replace: true });
        window.location.reload();
        handleUserMenuClose();
    };
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isRtl = i18n.dir() === 'rtl';

    return (
        <Box display={"flex"} justifyContent={"space-between"} sx={{ height: '4.7rem' }}>
            <Box
                display={"flex"}
                alignItems={"center"}
                sx={{
                    backgroundColor: "#15533B",
                    width: collapsed ? '4.93rem' : (isRtl ? '15.56rem' : '15.56rem'),
                    gap: 1,
                    borderTopLeftRadius: isRtl ? '0.5rem' : 0,
                    borderTopRightRadius: isRtl ? 0 : '0.5rem',
                    marginRight:'1px'
                }}
            >
                <img src={logo} alt="Logo" style={{ width: "3.875rem", height: "3.875rem", marginLeft: collapsed ? 5 : 10 }} onClick={() => navigate('/')} />
                {!collapsed && <Typography sx={{ color: 'white' }}>{t('company_name')}</Typography>}
            </Box>
            <Box display={"flex"}>
                {/* <IconButton onClick={handleLanguageMenuClick}>
                    <LanguageIcon />
                </IconButton>
                <Menu
                    anchorEl={languageMenuAnchorEl}
                    keepMounted
                    open={Boolean(languageMenuAnchorEl)}
                    onClose={handleLanguageMenuClose}
                >
                    {Object.keys(lngs).map((lng) => (
                        <MenuItem
                            key={lng}
                            onClick={() => changeLanguage(lng)}
                            disabled={i18n.resolvedLanguage === lng}
                        >
                            {lngs[lng].nativeName}
                        </MenuItem>
                    ))}
                </Menu> */}
                <Button onClick={toggleLanguage}>
                    <IconButton>
                        <LanguageIcon />
                    </IconButton>
                    {buttonText}
                </Button>
                <IconButton onClick={handleUserMenuClick}>
                    <PersonIcon />
                </IconButton>
                <Menu
                    anchorEl={userMenuAnchorEl}
                    keepMounted
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                >
                    <MenuItem onClick={handleMenuLogout}>{t('logout')}</MenuItem>
                </Menu>
            </Box>
        </Box >
    );
};

export default Topbar;
