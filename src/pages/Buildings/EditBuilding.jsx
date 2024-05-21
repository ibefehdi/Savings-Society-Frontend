import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

const EditBuilding = ({ fetchData, setOpen, open, buildingId }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        const fetchBuildingDetails = async () => {
            try {
                const response = await axiosInstance.get(`/building/${buildingId}`);
                const buildingData = response.data;
                setValue('name', buildingData.name);
                setValue('floors', buildingData.floors);
                setValue('block', buildingData.address.block);
                setValue('street', buildingData.address.street);
                setValue('house', buildingData.address.house);
                setValue('avenue', buildingData.address.avenue);
                setValue('city', buildingData.address.city);
            } catch (error) {
                console.error('Error fetching building details:', error);
            }
        };

        if (buildingId) {
            fetchBuildingDetails();
        }
    }, [buildingId, setValue]);

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
                address: {
                    block: data.block,
                    street: data.street,
                    house: data.house,
                    avenue: data.avenue,
                    city: data.city,
                },
            };

            await axiosInstance.put(`/editbuilding/${buildingId}`, formData);
            handleClose();
        } catch (error) {
            console.error('Error updating building data:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-building-modal-title"
            aria-describedby="edit-building-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <TextField
                    id="name"
                    margin="normal"
                    fullWidth
                    label={t('name')}
                    {...register('name', { required: true })}
                />
                <TextField
                    id="floors"
                    margin="normal"
                    fullWidth
                    label={t('floors')}
                    {...register('floors', { required: true })}
                />
                <TextField
                    id="block"
                    margin="normal"
                    fullWidth
                    label={t('block')}
                    {...register('block', { required: true })}
                />
                <TextField
                    id="street"
                    margin="normal"
                    fullWidth
                    label={t('street')}
                    {...register('street', { required: true })}
                />
                <TextField
                    id="house"
                    margin="normal"
                    fullWidth
                    label={t('house')}
                    {...register('house', { required: true })}
                />
                <TextField
                    id="avenue"
                    margin="normal"
                    fullWidth
                    label={t('avenue')}
                    {...register('avenue', { required: true })}
                />
                <TextField
                    id="city"
                    margin="normal"
                    fullWidth
                    label={t('city')}
                    {...register('city', { required: true })}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('save')}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                    {t('close')}
                </Button>
            </Box>
        </Modal>
    );
};

export default EditBuilding;