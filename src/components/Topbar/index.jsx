import React, { useState, useContext } from "react";
import {
    Box,
    IconButton,
    useTheme,
    Menu,
    MenuItem,
} from "@mui/material";
import { theme } from "../../theme";
import PersonIcon from "@mui/icons-material/Person";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Topbar = () => {
    const theme = useTheme();
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuLogout = () => {
        Cookies.remove('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userDetails');
        navigate('/', { replace: true });
        window.location.reload();

        handleClose();
    };

    return (
        <Box display={"flex"} justifyContent={"space-between"} p={2}>
            <Box display={"flex"} alignItems={"center"}>
                <img src={logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
            </Box>
            <Box display={"flex"}>
                <IconButton onClick={handleClick}>
                    <PersonIcon />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleMenuLogout}>Logout</MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default Topbar;
