import React, { useEffect, useRef, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { MenuItem, FormControl, Select, FormHelperText, InputLabel, Paper } from '@mui/material';
import MoneyForm from '../../printablePages/MoneyForm';
import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
const style = {
    marginTop: "1rem",
    marginBottom: "1rem",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '10rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const AddShareholderModal = ({ open, setOpen, fetchData }) => {
    const userData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const [lastMemberCode, setLastMemberCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const [workplaces, setWorkplaces] = useState();
    const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            shareAmount: '',
            shareInitialPrice: '',
        }
    });
    useEffect(() => {
        const fetchLastMemberCode = async () => {
            if (open) {  // Only fetch when modal is open
                setLoading(true);
                try {
                    const response = await axiosInstance.get('/lastshareholder');
                    setLastMemberCode(response.data.lastMembersCode);
                } catch (error) {
                    console.error('Error fetching last member code:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLastMemberCode();
    }, [open]);
    const shareAmount = watch('shareAmount');
    useEffect(() => {
        // Set the adminId from userData if available
        if (userData.id) {
            setValue('adminId', [{ admin: userData.id }]);
        }
    }, [userData.id, setValue]);
    const handleClose = () => {
        setOpen(false)
        fetchData();
    }
    useEffect(() => {
        // Whenever shareAmount changes, update shareInitialPrice
        const shareInitialPrice = shareAmount ? shareAmount * 2 : '';
        setValue('shareInitialPrice', shareInitialPrice, { shouldValidate: true });
    }, [shareAmount, setValue]);
    const onSubmit = async (data) => {
        try {
            await axiosInstance.post('/shareholder', data);
            handleClose();
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    useEffect(() => {
        async function fetchWorkplaces() {
            const response = await axiosInstance.get('/workplacesdropdown')
            setWorkplaces(response?.data?.data);
        }
        fetchWorkplaces();
    }, [])
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-shareholder-modal-title"
                aria-describedby="add-shareholder-modal-description"
                sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
                <Box sx={{
                    ...style,
                    width: '80rem',
                }}
                    component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                    <Paper
                        elevation={2}
                        sx={{
                            p: 1.5,
                            backgroundColor: '#f5f5f5',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                            minWidth: '200px'
                        }}
                    >
                        <Box>
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ fontWeight: 500 }}
                            >
                                {t('last_member_code')}:
                            </Typography>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                display="block"
                            >
                                {t('next')}: {lastMemberCode ? Number(lastMemberCode) + 1 : '1'}
                            </Typography>
                        </Box>
                        {loading ? (
                            <Typography variant="body2" color="textSecondary">
                                {t('loading')}...
                            </Typography>
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#1976d2',
                                    fontFamily: 'monospace',
                                    minWidth: '60px',
                                    textAlign: 'center'
                                }}
                            >
                                {lastMemberCode || '0'}
                            </Typography>
                        )}
                    </Paper>
                    <Grid container spacing={2}>
                        {/* Column 1 */}
                        <Grid item xs={12} sm={6} md={4}>
                            {/* <Typography variant="h6">
                                {t('shareholder_details')}
                            </Typography> */}
                            <TextField margin="normal" fullWidth label={t('first_name')} {...register('fName', { required: true })} error={!!errors.fName} helperText={errors.fName ? 'First Name is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('last_name')} {...register('lName', { required: true })} error={!!errors.lName} helperText={errors.lName ? 'Last Name is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('civil_id')} {...register('civilId', { required: true })} error={!!errors.civilId} helperText={errors.civilId ? 'Civil ID is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('email')} {...register('email')} />
                            <TextField margin="normal" fullWidth label={t('phone_number')} {...register('mobileNumber')} />
                            <TextField margin="normal" fullWidth label={t('iban')} {...register('ibanNumber')} />
                            <TextField margin="normal" fullWidth label={t('bankName')} {...register('bankName')} />

                            <InputLabel htmlFor="dob" >{t('dob')}</InputLabel>
                            <TextField fullWidth type="date" id='dob' {...register('dob', { required: true })} error={!!errors.dob} helperText={errors.dob ? 'Date of Birth is required' : ''} />
                            <InputLabel
                                htmlFor="joinDate"
                                sx={{
                                    textAlign: isRtl ? 'right' : 'left',
                                    direction: isRtl ? 'rtl' : 'ltr'
                                }}
                            >
                                {t('join_date')}
                            </InputLabel>
                            <TextField
                                id="joinDate"
                                type="date"
                                fullWidth
                                {...register('joinDate',)}
                                error={!!errors.joinDate}
                                helperText={errors.joinDate ? 'Join Date is required' : ''}
                            />

                            <FormControl fullWidth error={!!errors.status} margin="normal">
                                <InputLabel id="status-label">{t('gender')}</InputLabel>
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: true }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="gender-label"
                                            label={t('gender')}
                                        >
                                            <MenuItem value={'male'}>{t('Male')}</MenuItem>
                                            <MenuItem value={'female'}>{t('Female')}</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.status && <FormHelperText>Gender is required</FormHelperText>}
                            </FormControl>

                            {/* <InputLabel htmlFor="quitDate">{t('quit_date')}</InputLabel>
                            <TextField fullWidth type="date" id='quitDate' {...register('quitDate', { required: true })} error={!!errors.ibanNumber} helperText={errors.ibanNumber ? 'Join Date is required' : ''} /> */}

                            <FormControl fullWidth error={!!errors.status} margin="normal">
                                <InputLabel id="status-label">{t('status')}</InputLabel>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: true }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="status-label"
                                            label="Status"
                                        >
                                            <MenuItem value={0}>{t('active')}</MenuItem>
                                            <MenuItem value={1}>{t('inactive')}</MenuItem>
                                            <MenuItem value={2}>{t('death')}</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.status && <FormHelperText>Status is required</FormHelperText>}
                            </FormControl>


                        </Grid>
                        {/* Column 2 */}
                        <Grid item xs={12} sm={6} md={4}>
                            {/* <Typography variant="h6">
                                {t('address')}
                            </Typography> */}

                            <TextField margin="normal" fullWidth label={t('block')} {...register('block', { required: true })} error={!!errors.block} helperText={errors.block ? 'Block is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('area')} {...register('city', { required: true })} error={!!errors.city} helperText={errors.city ? 'City is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('poBox')} {...register('poBox')} />
                            <TextField margin="normal" fullWidth label={t('house')} {...register('house', { required: true })} error={!!errors.house} helperText={errors.house ? 'House Number is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('street')}{...register('street', { required: true })} error={!!errors.street} helperText={errors.street ? 'Street is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('area')} {...register('area', { required: true })} error={!!errors.area} helperText={errors.area ? 'Area is required' : ''} />
                            <TextField margin="normal" fullWidth label={t('zipCode')} {...register('zipCode')} />
                            {/* <TextField margin="normal" fullWidth label={t('country')} {...register('country', { required: true })} error={!!errors.country} helperText={errors.country ? 'Country is required' : ''} /> */}
                            <FormControl fullWidth margin="normal" error={!!errors.workplace}>
                                <InputLabel>{t('workplace')}</InputLabel>
                                <Controller
                                    name="workplace"
                                    control={control}
                                    rules={{ required: 'workplace is required' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label={t('workplace')}
                                        >
                                            {workplaces.map((workplace) => (
                                                <MenuItem key={workplace.description} value={workplace.description}>
                                                    {workplace.description}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <FormHelperText>
                                    {errors.workplace ? errors.workplace.message : ''}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        {/* Column 3 */}
                        <Grid item xs={12} sm={6} md={4}>
                            {/* <Typography variant="h6">
                                {t('investment')}
                            </Typography> */}
                            {/* <TextField margin="normal" fullWidth label={t('serial')} {...register('membersCode',)} error={!!errors.membersCode} helperText={errors.membersCode ? 'Members Code is required' : ''} /> */}

                            <TextField
                                margin="normal"
                                fullWidth
                                label={t('savings_initial_amount')}
                                type="number"
                                {...register('savingsInitialPrice')}
                            />
                            <Controller
                                name="shareAmount"
                                control={control}
                                rules={{ required: true }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        fullWidth
                                        label={t('share_amount')}
                                        type="number"
                                        error={!!error}
                                        helperText={error ? 'Share Amount is required' : ''}
                                    />
                                )}
                            />
                            <Controller
                                name="shareInitialPrice"
                                control={control}
                                rules={{ required: true }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        fullWidth
                                        label={t('share_initial_amount')}
                                        type="number"
                                        disabled
                                        error={!!error}
                                        helperText={error ? 'Share Initial Price is required' : ''}
                                    />
                                )}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={6} md={3}>
                      
                    </Grid> */}
                    </Grid>
                    <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>
                        <MoneyForm ref={componentRef} />
                    </Box>

                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {t('submit')}
                    </Button>
                    <Button onClick={handlePrint} sx={{ mt: 3, mb: 2 }}>
                        {t('print')}
                    </Button>
                    <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                        {t('close')}
                    </Button>
                </Box>
            </Modal>
        </CacheProvider>
    );
};


export default AddShareholderModal