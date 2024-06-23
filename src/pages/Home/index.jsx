import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
const Home = () => {
    const [shareholderCount, setShareholderCount] = useState()
    const [userCount, setUserCount] = useState()
    const [activeShareholders, setActiveShareholders] = useState();
    const [inactiveUsersCount, setInactiveUsersCount] = useState()
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const shareholder = await axiosInstance.get(`shareholdercount/`);
                const user = await axiosInstance.get(`activeuserscount/`);
                const activeShareholder = await axiosInstance.get('shareholderactivecount/')
                const inactiveUser = await axiosInstance.get('inactiveuserscount/')
                setActiveShareholders(activeShareholder?.data?.count)
                setShareholderCount(shareholder?.data?.count);
                setUserCount(user?.data?.count);
                setInactiveUsersCount(inactiveUser?.data?.count);
            } catch (error) {
                console.error("Failed to fetch shareholder details:", error);
            }
        };

        fetchCounts();
    }, []);
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>

            {/* <Box sx={{ width: '8rem', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', }}>

                <img src={logo} alt="Logo" style={{ width: 100, height: 100 }} />

            </Box> */}
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Typography variant="h3" component="h2" sx={{
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '1.875rem',
                    flexGrow: 1,
                    marginLeft: '1.2rem',

                }}>
                    {t('overview')}
                </Typography>
                <Box sx={{
                    width: '90%',
                    backgroundColor: '#FFF',
                    display: 'flex',
                    margin: '2rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    overflowX: 'auto',
                    textAlign: isRtl ? 'right' : 'left',
                    direction: isRtl ? 'rtl' : 'ltr'
                }}>
                    <Box sx={{
                        width: "13rem",
                        height: '5rem',
                        padding: '1rem',
                        borderRight: '2px solid #f1f1f1',
                        textAlign: isRtl ? 'right' : 'left',
                        direction: isRtl ? 'rtl' : 'ltr'
                    }}>
                        <Typography sx={{
                            color: '#2a6bd1', marginBottom: '0.5rem', fontWeight: "700", textAlign: isRtl ? 'right' : 'left',
                            direction: isRtl ? 'rtl' : 'ltr'
                        }}>
                            {t('total_shareholders')}
                        </Typography>
                        <Typography sx={{
                            color: '#64676c', fontWeight: "700",
                            direction: isRtl ? 'rtl' : 'ltr'
                        }}>
                            {shareholderCount}
                        </Typography>
                    </Box>
                    <Box sx={{ width: "13rem", height: '5rem', padding: '1rem', borderRight: '2px solid #f1f1f1' }}>
                        <Typography sx={{ color: '#795cae', marginBottom: '0.5rem', fontWeight: "700" }}>
                            {t('active_shareholders')}
                        </Typography>
                        <Typography sx={{ color: '#64676c', fontWeight: "700" }}>
                            {activeShareholders}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: "13rem", height: '5rem', padding: '1rem', borderRight: '2px solid #f1f1f1', textAlign: isRtl ? 'right' : 'left',
                        direction: isRtl ? 'rtl' : 'ltr'
                    }}>
                        <Typography sx={{
                            color: '#d7893f', marginBottom: '0.5rem', fontWeight: "700", textAlign: isRtl ? 'right' : 'left',
                            direction: isRtl ? 'rtl' : 'ltr'
                        }}>
                            {t('active_users')}
                        </Typography>
                        <Typography sx={{ color: '#64676c', fontWeight: "700" }}>
                            {userCount}
                        </Typography>
                    </Box>

                    <Box sx={{ width: "13rem", height: '5rem', padding: '1rem', borderRight: '2px solid #f1f1f1' }}>
                        <Typography sx={{ color: '#e56969', marginBottom: '0.5rem', fontWeight: "700" }}>
                            {t('deleted_users')}
                        </Typography>
                        <Typography sx={{ color: '#64676c', fontWeight: "700" }}>
                            {inactiveUsersCount}
                        </Typography>
                    </Box>
                </Box>


            </Box>
        </CacheProvider >
    )
}

export default Home