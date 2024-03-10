import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Switch, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import the icon for the menu button
import "./Login.css";
import { theme } from '../../theme';
import logo from '../../assets/logo.png';
import { useForm } from "react-hook-form";
import axiosInstance from '../../constants/axiosInstance';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { setUserDetails } from '../../redux/reducers';
import { useDispatch } from 'react-redux';
import { useTranslation, useI18n } from 'react-i18next';

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [inputError, setInputError] = useState({ username: false, password: false, customError: "" });
    const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const lngs = {
        en: { nativeName: "English" },
        ar: { nativeName: "Arabic" },
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };
    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post('users/signin', data);
            const decoded = jwtDecode(response?.data?.token);
            console.log(response);
            console.log("This is the userDetails", decoded);
            sessionStorage.setItem('token', response?.data?.token);
            console.log("This is the cookie: ", document?.cookie)
            sessionStorage.setItem('userDetails', JSON.stringify(decoded));
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
    return (
        <Box className='layout'>

            <form onSubmit={handleSubmit(onSubmit)} className='login-details'>
                <FormControlLabel
                    control={<Switch checked={i18n.language === 'ar'} onChange={toggleLanguage} />}
                    label={i18n.language === 'ar' ? 'AR' : 'EN'}
                    labelPlacement="start"
                    sx={{ alignSelf: 'center', marginBottom: '1rem' }}
                />
                <Box
                    component="img"
                    sx={{
                        height: "3rem",
                        width: "3rem",
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
    );
}

export default Login;
