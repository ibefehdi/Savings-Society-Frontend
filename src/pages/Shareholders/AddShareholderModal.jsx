import React, { useEffect, useRef } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { MenuItem, FormControl, Select, FormHelperText, InputLabel } from '@mui/material';
import MoneyForm from '../../printablePages/MoneyForm';
import { useReactToPrint } from 'react-to-print';
import AddBalanceForm from '../../printablePages/AddBalanceForm';
import WithdrawalForm from '../../printablePages/WithdrawalForm';
import { useTranslation } from 'react-i18next';

const style = {
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

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();

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
    const { t } = useTranslation();
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-shareholder-modal-title"
            aria-describedby="add-shareholder-modal-description"

        >
            <Box sx={{
                ...style,
                width: '80rem',
            }}
                component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <Grid container spacing={2}> {/* Adjust the spacing as needed */}
                    {/* Column 1 */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6">
                            {t('shareholder_details')}
                        </Typography>
                        <TextField margin="normal" fullWidth label={t('first_name')} {...register('fName', { required: true })} error={!!errors.fName} helperText={errors.fName ? 'First Name is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('last_name')} {...register('lName', { required: true })} error={!!errors.lName} helperText={errors.lName ? 'Last Name is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('civil_id')} {...register('civilId', { required: true })} error={!!errors.civilId} helperText={errors.civilId ? 'Civil ID is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('email')} {...register('email', { required: true })} error={!!errors.email} helperText={errors.email ? 'Email is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('phone_number')} {...register('mobileNumber', { required: true })} error={!!errors.mobileNumber} helperText={errors.mobileNumber ? 'Phone Number is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('iban')} {...register('ibanNumber', { required: true })} error={!!errors.ibanNumber} helperText={errors.ibanNumber ? 'IBAN Number is required' : ''} />
                        <TextField margin="normal" fullWidth type="date"  {...register('dob', { required: true })} error={!!errors.dob} helperText={errors.dob ? 'Date of Birth is required' : ''} />
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
                                        <MenuItem value={0}>Active</MenuItem>
                                        <MenuItem value={1}>Inactive</MenuItem>
                                        <MenuItem value={2}>Death</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && <FormHelperText>Status is required</FormHelperText>}
                        </FormControl>
                    </Grid>
                    {/* Column 2 */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6">
                            {t('address')}
                        </Typography>
                        <TextField margin="normal" fullWidth label={t('block')} {...register('block', { required: true })} error={!!errors.block} helperText={errors.block ? 'Block is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('area')} {...register('city', { required: true })} error={!!errors.city} helperText={errors.city ? 'City is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('poBox')} {...register('poBox')} />
                        <TextField margin="normal" fullWidth label={t('house')} {...register('house', { required: true })} error={!!errors.house} helperText={errors.house ? 'House Number is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('street')}{...register('street', { required: true })} error={!!errors.street} helperText={errors.street ? 'Street is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('area')} {...register('area', { required: true })} error={!!errors.area} helperText={errors.area ? 'Area is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('zipCode')} {...register('zipCode')} />
                        <TextField margin="normal" fullWidth label={t('country')} {...register('country', { required: true })} error={!!errors.country} helperText={errors.country ? 'Country is required' : ''} />
                    </Grid>
                    {/* Column 3 */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6">
                            {t('investment')}
                        </Typography>
                        <TextField margin="normal" fullWidth label={t('savings_initial_amount')} type="number" {...register('savingsInitialPrice', { required: true })} error={!!errors.savingsInitialPrice} helperText={errors.savingsInitialPrice ? 'Savings Initial Price is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('share_initial_amount')} type="number" {...register('shareInitialPrice', { required: true })} error={!!errors.shareInitialPrice} helperText={errors.shareInitialPrice ? 'Share Initial Price is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('share_amount')} type="number" {...register('shareAmount', { required: true })} error={!!errors.shareAmount} helperText={errors.shareAmount ? 'Share Amount is required' : ''} />

                    </Grid>
                    {/* <Grid item xs={12} sm={6} md={3}>
                      
                    </Grid> */}
                </Grid>
                <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>
                    <MoneyForm ref={componentRef} />
                </Box>

                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Submit
                </Button>
                <Button onClick={handlePrint} sx={{ mt: 3, mb: 2 }}>
                    Print
                </Button>
            </Box>
        </Modal>

    );
};


export default AddShareholderModal