import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';

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

const EditBooking = ({ open, handleClose, booking, fetchData, hallId }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        if (booking) {
            reset({
                dateOfEvent: booking.dateOfEvent ? new Date(booking.dateOfEvent).toISOString().split('T')[0] : '',
                date: new Date(booking.date).toISOString().split('T')[0],
                rate: booking.rate,
                tenantName: booking.customer?.name || '',
                voucherNo: booking.voucher?.voucherNo || '',
            });
        }
    }, [booking, reset]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
            formData.append('hallId', hallId);

            await axiosInstance.put(`/editbooking/${booking._id}`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error editing booking:', error);
            // Add user feedback here, e.g., a toast notification
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-booking-modal-title"
            aria-describedby="edit-booking-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box sx={{ ...style, width: '20rem' }} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('date_of_event')}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register('dateOfEvent', { required: true })}
                    error={!!errors.dateOfEvent}
                    helperText={errors.dateOfEvent ? t('date_of_event_required') : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('booking_date')}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register('date', { required: true })}
                    error={!!errors.date}
                    helperText={errors.date ? t('booking_date_required') : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('rate')}
                    type="number"
                    {...register('rate', { required: true })}
                    error={!!errors.rate}
                    helperText={errors.rate ? t('rate_required') : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenantName')}
                    {...register('tenantName', { required: true })}
                    error={!!errors.customerName}
                    helperText={errors.customerName ? t('tenant_name_required') : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('voucher_number')}
                    {...register('voucherNo', { required: true })}
                    error={!!errors.voucherNo}
                    helperText={errors.voucherNo ? t('voucher_number_required') : ''}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('update')}
                </Button>
            </Box>
        </Modal>
    );
};

export default EditBooking;