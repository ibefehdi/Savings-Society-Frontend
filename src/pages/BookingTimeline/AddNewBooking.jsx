import React, { useEffect } from 'react';
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

const AddNewBooking = ({ editMode, setOpen, fetchData, open, hallId, booking, onDelete }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (editMode && booking) {
            reset(booking);
        } else {
            reset();
        }
    }, [editMode, booking, reset]);

    const handleClose = () => {
        setOpen(false);
        fetchData();
    };

    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';


    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'civilIdDocument') {
                    if (data[key] && data[key][0]) {
                        formData.append(key, data[key][0]);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            });
            formData.append('hallId', hallId);

            if (editMode) {
                await axiosInstance.put('/editbooking', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axiosInstance.post('/createbooking', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            handleClose();
            reset();
        } catch (error) {
            console.error('Error posting/editing booking data:', error);
        }
    }


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
                    {...register('date', { required: editMode ? false : true })}
                    error={!!errors.date}
                    helperText={errors.date ? 'Date is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('date_of_event')}
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('dateOfEvent', { required: editMode ? false : true })}
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
                    {...register('startTime', { required: editMode ? false : true })}
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
                    {...register('endTime', { required: editMode ? false : true })}
                    error={!!errors.endTime}
                    helperText={errors.endTime ? 'End Time is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('rate')}
                    type="number"
                    {...register('rate', { required: editMode ? false : true })}
                    error={!!errors.rate}
                    helperText={errors.rate ? 'Rate is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_name')}
                    {...register('tenantName', { required: editMode ? false : true })}
                    error={!!errors.tenantName}
                    helperText={errors.tenantName ? 'Tenant Name is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_civil_id')}
                    {...register('tenantCivilId', { required: editMode ? false : true })}
                    error={!!errors.tenantCivilId}
                    helperText={errors.tenantCivilId ? 'Tenant Civil ID is required' : ''}
                />
                {/* <Controller
                    name="tenantType"
                    control={control}
                    rules={{ required: editMode ? false : true }}
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
                /> */}
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_contact_number')}
                    {...register('tenantContactNumber', { required: editMode ? false : true })}
                    error={!!errors.tenantContactNumber}
                    helperText={errors.tenantContactNumber ? 'Tenant Contact Number is required' : ''}
                />
                <Controller
                    name="civilIdDocument"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, ...field } }) => (
                        <TextField
                            {...field}
                            type="file"
                            label={t('civilIdDocument')}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => onChange(e.target.files)}
                            inputProps={{
                                accept: "image/*,application/pdf"
                            }}
                        />
                    )}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editMode ? 'Update' : 'Submit'}
                </Button>
                {editMode && (
                    <Button onClick={onDelete} variant="contained" color="error" sx={{ mt: 2 }}>
                        Delete
                    </Button>
                )}
            </Box>
        </Modal>
    );
};

export default AddNewBooking;