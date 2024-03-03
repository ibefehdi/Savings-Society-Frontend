import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import "./DashboardSidebar.css"
import { Link } from 'react-router-dom';
const DashboardSidebar = ({ menuItems }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarHeight, setSidebarHeight] = useState('calc(100vh - 0px)'); // Initial state

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
                    {menuItems?.map(menuItem => menuItem.subMenus ? (
                        <SubMenu label={menuItem.name} icon={menuItem.icon}>
                            {menuItem.subMenus.map(sub => (
                                <MenuItem component={<Link to={sub.path} />}>{sub.name}</MenuItem>
                            ))}
                        </SubMenu>
                    ) : (
                        <MenuItem component={<Link to={menuItem.path} />} icon={menuItem.icon}>
                            {menuItem.name}
                        </MenuItem>
                    ))}
                </Menu>
                {/* 
                <div style={{ padding: "10px" }}>

                </div> */}

            </div>
        </Sidebar>
    );
};

export default DashboardSidebar;