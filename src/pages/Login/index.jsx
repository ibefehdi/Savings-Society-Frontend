import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Switch, FormControlLabel, IconButton } from '@mui/material';
import "./Login.css";
import { theme } from '../../theme';
import logo from '../../assets/logo1.png';
import { useForm } from "react-hook-form";
import axiosInstance from '../../constants/axiosInstance';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { setUserDetails } from '../../redux/reducers';
import { useDispatch } from 'react-redux';
import { useTranslation, } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import LanguageIcon from "@mui/icons-material/Language"; // Import an icon for the language menu

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [inputError, setInputError] = useState({ username: false, password: false, customError: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    const buttonText = i18n.resolvedLanguage === 'en' ? 'AR' : 'EN';

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post('users/signin', data);
            const decoded = jwtDecode(response?.data?.token);
            console.log(response);
            console.log("This is the userDetails", decoded);
            sessionStorage.setItem('token', response?.data?.token);
            console.log("This is the cookie: ", document?.cookie)
            sessionStorage.setItem('userDetails', JSON.stringify(decoded));
            console.log(JSON.stringify(decoded))
            dispatch(setUserDetails(decoded))
            navigate('/', { replace: true });
            window.location.reload();
            setInputError({ username: false, password: false });
        } catch (err) {
            console.log(err.response.data);
            if (err.response.data.code === 0) {
                helperText({ username: true, password: false });
            }
            else if (err.response.data.code === 1) {
                helperText({ username: false, password: true });

            }
            else if (err.response.data.code === 3) {
                helperText({ username: true, password: true });
            }
        }
    };
    const helperText = ({ username, password }) => {
        if (username && password) {
            setInputError({ username: true, password: true, customError: "Your access has been revoked." });
        } else {
            setInputError({ username: username, password: password, customError: "" });
        }
    };
    const isRtl = i18n.dir() === 'rtl';

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>

            <Box className='layout' >

                <form onSubmit={handleSubmit(onSubmit)} className='login-details'>
                    <Button onClick={toggleLanguage} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                        <IconButton sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                            <LanguageIcon />
                        </IconButton>
                        {buttonText}
                    </Button>
                    {/* <FormControlLabel
                        control={<Switch checked={i18n.language === 'ar'} onChange={toggleLanguage} />}
                        label={i18n.language === 'ar' ? 'AR' : 'EN'}
                        labelPlacement="end"
                        sx={{ alignSelf: 'center', marginBottom: '1rem', direction: 'ltr !important' }}
                    /> */}
                    <Box
                        component="img"
                        sx={{
                            height: "10rem",
                            width: "10rem",
                            alignSelf: 'center',
                        }}
                        alt="Company Logo"
                        src={logo}
                    />
                    <Typography color={theme.typography.heading1}>{t('login_text')}</Typography>
                    <Typography color={theme.typography.heading2}>{t('welcome_back')}</Typography>
                    {inputError.customError && (
                        <Typography color="error" sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                            {inputError.customError}
                        </Typography>
                    )}
                    <TextField
                        id="Username"
                        label={t('username')}
                        variant="outlined"
                        fullWidth
                        autoComplete='off'
                        {...register("username")}
                        error={inputError.username}
                        helperText={inputError.username && inputError.customError === '' && "Invalid username"} // Customize error message
                    />
                    <TextField
                        id="Password"
                        label={t('password')}
                        variant="outlined"
                        fullWidth
                        type='password'
                        {...register("password")}
                        error={inputError.password}
                        helperText={inputError.password && inputError.customError === '' && "Invalid password"} // Customize error message
                    />
                    <Button variant="contained" sx={{ padding: "0.785rem" }} fullWidth type='submit'>
                        <Typography sx={{ fontWeight: "500" }}>{t('sign_in')}</Typography>
                    </Button>
                </form>
            </Box>
        </CacheProvider>
    );
}

export default Login;
