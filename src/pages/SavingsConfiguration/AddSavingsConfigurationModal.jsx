import React, { useEffect } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400, // Adjusted for better readability
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4, // Shorthand for padding, applies to pt, px, and pb
};
const AddSavingsConfigurationModal = ({ open, year, setOpen, fetchData, editMode, shareConfigId, setEditMode }) => {
    const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm();
    const handleClose = () => {
        setOpen(false);
        fetchData();
        setEditMode(false);
    }
    const onSubmit = async (data) => {
        try {
            if (editMode) {

                await axiosInstance.put(`savingconfig/${shareConfigId}`, data);
                reset({
                    year: year,
                });
            } else {
                await axiosInstance.post('/createsavingconfig', data);
            }
            setEditMode(false)
            handleClose();
            reset()
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl'; return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-shareholder-modal-title"
            aria-describedby="add-shareholder-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}

        >
            <Box sx={{
                ...style,
                width: '20rem',
            }}
                component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <Controller
                    name="year"
                    control={control}
                    rules={{ required: !editMode }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            margin="normal"
                            fullWidth
                            label={t('year')}
                            onChange={onChange}
                            value={value}
                            disabled={editMode}
                            error={!!error}
                            helperText={error ? 'Year is required' : ''}
                        />
                    )}
                />
                <TextField margin="normal" fullWidth label={t('savings_percentage')} {...register('individualSharePercentage', { required: true })} error={!!errors.lName} helperText={errors.lName ? 'Last Name is required' : ''} />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editMode ? `Edit` : "Submit"}
                </Button>
            </Box>
        </Modal>)
}

export default AddSavingsConfigurationModal