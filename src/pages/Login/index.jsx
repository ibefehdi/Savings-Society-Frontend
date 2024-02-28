import React, { useState } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import "./Login.css";
import { theme } from '../../theme';
import logo from '../../assets/logo.png';
import { useForm } from "react-hook-form"
import axiosInstance from '../../constants/axiosInstance';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { setUserDetails } from '../../redux/reducers';
import { useDispatch } from 'react-redux';

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
    const [inputError, setInputError] = useState({ username: false, password: false, customError: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                <Typography color={theme.typography.heading1}>Log in to your account</Typography>
                <Typography color={theme.typography.heading2}>Welcome back! Please enter your details.</Typography>
                {inputError.customError && (
                    <Typography color="error" sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                        {inputError.customError}
                    </Typography>
                )}
                <TextField
                    id="Username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    autoComplete='off'
                    {...register("username")}
                    error={inputError.username}
                    helperText={inputError.username && inputError.customError === '' && "Invalid username"} // Customize error message
                />
                <TextField
                    id="Password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type='password'
                    {...register("password")}
                    error={inputError.password}
                    helperText={inputError.password && inputError.customError === '' && "Invalid password"} // Customize error message
                />
                <Button variant="contained" sx={{ padding: "0.785rem" }} fullWidth type='submit'>
                    <Typography sx={{ fontWeight: "500" }}>Sign in</Typography>
                </Button>
            </form>
        </Box>
    );
}

export default Login;
