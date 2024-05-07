import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AddNewBooking = ({ editMode, setOpen, fetchData, open, hallId }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

    const handleClose = () => {
        setOpen(false);
        fetchData();
    };

    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                hallId: hallId
            };
            await axiosInstance.post('/createbooking', payload);
            handleClose();
            reset();
        } catch (error) {
            console.error('Error posting booking data:', error);
        }
    };



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-booking-modal-title"
            aria-describedby="add-booking-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box sx={{ ...style, width: '20rem' }} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

                <TextField
                    margin="normal"
                    fullWidth
                    label={t('date')}
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('date', { required: true })}
                    error={!!errors.date}
                    helperText={errors.date ? 'Date is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('start_time')}
                    type="time"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('startTime', { required: true })}
                    error={!!errors.startTime}
                    helperText={errors.startTime ? 'Start Time is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('end_time')}
                    type="time"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('endTime', { required: true })}
                    error={!!errors.endTime}
                    helperText={errors.endTime ? 'End Time is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('rate')}
                    type="number"
                    {...register('rate', { required: true })}
                    error={!!errors.rate}
                    helperText={errors.rate ? 'Rate is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_name')}
                    {...register('tenantName', { required: true })}
                    error={!!errors.tenantName}
                    helperText={errors.tenantName ? 'Tenant Name is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_civil_id')}
                    {...register('tenantCivilId', { required: true })}
                    error={!!errors.tenantCivilId}
                    helperText={errors.tenantCivilId ? 'Tenant Civil ID is required' : ''}
                />
                <Controller
                    name="tenantType"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label={t('tenant_type')}
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            helperText={error ? 'Tenant Type is required' : ''}
                        >
                            <MenuItem value="Public">{t('public')}</MenuItem>
                            <MenuItem value="Private">{t('private')}</MenuItem>
                        </TextField>
                    )}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_contact_number')}
                    {...register('tenantContactNumber', { required: true })}
                    error={!!errors.tenantContactNumber}
                    helperText={errors.tenantContactNumber ? 'Tenant Contact Number is required' : ''}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editMode ? `Edit` : 'Submit'}
                </Button>
            </Box>
        </Modal>
    );
};

export default AddNewBooking;