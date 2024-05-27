import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import "./DashboardSidebar.css"
import { Link, useNavigate } from 'react-router-dom';
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

const CustomDivider = () => {
    return (
        <div
            style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                margin: '8px 0',
            }}
        />
    );
};
const DashboardSidebar = ({ menuItems }) => {
    const { t, i18n } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isRtl = i18n.dir() === 'rtl';

    const handleMenuItemClick = (menuItem) => {
        if (menuItem.path) {
            navigate(menuItem.path);
        }
    };

    return (
        <Sidebar collapsed={collapsed}>
            <div className={isRtl ? "sidebar-rtl" : "sidebar"} style={{ borderBottomRightRadius: isRtl ? 0 : '0', borderBottomLeftRadius: isRtl ? '0' : 0, width: collapsed ? '4.93rem' : (isRtl ? '15.56rem' : '15.56rem') }}>
                <Box display={"flex"} alignItems={"center"} sx={{ backgroundColor: "#15533B", width: collapsed ? '4.93rem' : (isRtl ? '15.56rem' : '15.56rem'), gap: 1, borderTopLeftRadius: isRtl ? '0.5rem' : 0, borderTopRightRadius: isRtl ? 0 : '0.5rem', marginRight: '1px', marginBottom: '1rem', }} >
                    <img src={logo} alt="Logo" style={{ width: "3.875rem", height: "3.875rem", marginLeft: collapsed ? 5 : 10 }} />
                    {!collapsed && <Typography sx={{ color: 'white' }}>{t('company_name')}</Typography>}
                </Box>
                <Menu
                    menuItemStyles={{
                        button: {
                            color: 'white',
                            [`&:hover`]: { backgroundColor: '#f5811e' },
                            [`&:active`]: { color: 'black' },
                        },
                    }}
                >
                    {menuItems?.map((menuItem, index) =>
                        menuItem.divider ? (
                            <CustomDivider key={`divider-${index}`} />
                        ) : menuItem.subMenus ? (
                            <SubMenu
                                key={menuItem.name}
                                label={menuItem.name}
                                icon={menuItem.icon}
                                onClick={() => handleMenuItemClick(menuItem)}
                            >
                                {menuItem.subMenus.map(sub => (
                                    <MenuItem
                                        key={sub.name}
                                        style={{ backgroundColor: '#15533B' }}
                                        component={<Link to={sub.path} />}
                                    >
                                        {sub.name}
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        ) : (
                            <MenuItem
                                key={menuItem.name}
                                component={<Link to={menuItem.path} />}
                                icon={menuItem.icon}
                            >
                                {menuItem.name}
                            </MenuItem>
                        )
                    )}
                </Menu>
            </div>
        </Sidebar >
    );
};

export default DashboardSidebar;