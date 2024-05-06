import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const AddNewBuilding = ({ fetchData, setOpen, open }) => {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const handleClose = () => {
        setOpen(false);
        reset();
        fetchData();
    };
    const onSubmit = async (data) => {
        try {
            const formData = {
                name: data.name,
                floors: data.floors,
                block: data.block,
                street: data.street,
                house: data.house,
                avenue: data.avenue,
                city: data.city,
                type: 'Building'
            };

            await axiosInstance.post("createbuilding", formData);
            handleClose();
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-shareholder-modal-title"
            aria-describedby="add-shareholder-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">

                <TextField
                    id="name"
                    margin='normal'
                    fullWidth
                    label={t('name')}
                    {...register('name', { required: true })}


                />
                <TextField
                    id="floors"
                    margin='normal'
                    fullWidth
                    label={t('floors')}
                    {...register('floors', { required: true })}


                />
                <TextField
                    id="block"
                    margin='normal'
                    fullWidth
                    label={t('block')}
                    {...register('block', { required: true })}


                />
                <TextField
                    id="street"
                    margin='normal'
                    fullWidth
                    label={t('street')}
                    {...register('street', { required: true })}


                />
                <TextField
                    id="house"
                    margin='normal'
                    fullWidth
                    label={t('house')}
                    {...register('house', { required: true })}


                />
                <TextField
                    id="avenue"
                    margin='normal'
                    fullWidth
                    label={t('avenue')}
                    {...register('avenue', { required: true })}


                />
                <TextField
                    id="city"
                    margin='normal'
                    fullWidth
                    label={t('city')}
                    {...register('city', { required: true })}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('add')}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                    {t('close')}
                </Button>
            </Box>
        </Modal>
    )
}

export default AddNewBuilding