import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import "./DashboardSidebar.css"
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const DashboardSidebar = ({ menuItems }) => {
    const { i18n } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isRtl = i18n.dir() === 'rtl';

    return (
        <Sidebar collapsed={collapsed}>
            <div className='sidebar' style={{ borderBottomRightRadius: isRtl ? 0 : '0.5rem', borderBottomLeftRadius: isRtl ? '0.5rem' : 0 }}>
                <Menu menuItemStyles={{
                    button: {
                        color: 'white',
                        [`&:hover`]: {
                            backgroundColor: '#f5811e',
                        },
                        [`&:active`]: {
                            color: 'black'
                        }
                    }
                }}
                
                >
                    {menuItems?.map(menuItem => menuItem.subMenus ? (
                        <SubMenu 
                        label={menuItem.name} icon={menuItem.icon}>
                            {menuItem.subMenus.map(sub => (
                                <MenuItem style={{backgroundColor:"#15533B",}} component={<Link to={sub.path} />}>{sub.name}</MenuItem>
                            ))}
                        </SubMenu>
                    ) : (
                        <MenuItem component={<Link to={menuItem.path} />} icon={menuItem.icon}>
                            {menuItem.name}
                        </MenuItem>
                    ))}
                </Menu>
              
            </div>
        </Sidebar >
    );
};

export default DashboardSidebar;