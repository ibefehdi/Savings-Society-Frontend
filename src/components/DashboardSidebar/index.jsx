import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'; // Updated imports
import "./DashboardSidebar.css"
const DashboardSidebar = ({ menuItems }) => {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Sidebar collapsed={collapsed} backgroundColor='white' className='sidebar'>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", height: "100%" }}>
                <Menu>
                    {menuItems?.map(menuItem => (<MenuItem className='menu-item' icon={menuItem.icon}>{menuItem.name} </MenuItem>)

                    )}


                </Menu>

                <div style={{ padding: "10px" }}>
                    <Menu>
                        <MenuItem>Home </MenuItem>
                        <MenuItem> Calendar </MenuItem>
                    </Menu>
                </div>

            </div>
        </Sidebar>
    );
};

export default DashboardSidebar;