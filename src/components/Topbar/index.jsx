import React, { useState, } from "react";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Button
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
    return (
        <Box display={"flex"} justifyContent={"space-between"} p={2}>
            <Box display={"flex"} alignItems={"center"} >
                <img src={logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} onClick={() => navigate('/')} />
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
        </Box>
    );
};

export default Topbar;
