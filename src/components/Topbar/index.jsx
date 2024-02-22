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

const Topbar = ({ onLogout }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuLogout = () => {
        onLogout();
        handleClose();
    };

    return (
        <Box display={"flex"} justifyContent={"space-between"} p={2}>
            <Box
                display={"flex"}
                backgroundColor={"#FFF"}
                borderRadius={"3px"}
            ></Box>
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
