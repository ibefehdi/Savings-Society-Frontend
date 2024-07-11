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
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AddNewFlat = ({ editMode, setOpen, fetchData, open }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const [buildings, setBuildings] = useState([]);

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
                if (key === 'civilIdDocument' || key === 'contractDocument') {
                    if (data[key]) {
                        formData.append(key, data[key], data[key].name);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            });

            await axiosInstance.post(`createflat`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            handleClose();
            reset();
        } catch (error) {
            console.error('Error posting flat data:', error);
        }
    };
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('/buildingdropdown');
                setBuildings(response?.data?.data);
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };
        fetchBuildings();
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-flat-modal-title"
            aria-describedby="add-flat-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box sx={{ ...style, width: '20rem' }} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <Controller
                    name="buildingId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label={t('building')}
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            helperText={error ? 'Building is required' : ''}
                        >
                            {buildings.map((building) => (
                                <MenuItem key={building._id} value={building._id}>
                                    {building.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('flat_number')}
                    {...register('flatNumber', { required: true })}
                    error={!!errors.flatNumber}
                    helperText={errors.flatNumber ? 'Flat Number is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('floorNumber')}
                    {...register('floorNumber')}
                    error={!!errors.floorNumber}
                    helperText={errors.floorNumber ? 'Floor Number is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_name')}
                    {...register('tenantName')}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_contact_number')}
                    {...register('tenantContactNumber')}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_civil_id')}
                    {...register('tenantCivilId')}
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
                            onChange={(e) => onChange(e.target.files[0])}
                            // Remove the value prop
                            inputProps={{
                                accept: "image/*,application/pdf"
                            }}
                        />
                    )}
                />
                <Controller
                    name="contractDocument"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, ...field } }) => (
                        <TextField
                            {...field}
                            type="file"
                            label={t('contractDocument')}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => onChange(e.target.files[0])}
                            inputProps={{
                                accept: "image/*,application/pdf"
                            }}
                        />
                    )}
                />
                {/* <Controller
                    name="tenantType"
                    control={control}

                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label={t('tenant_type')}
                            onChange={onChange}
                            value={value}
                            error={!!error}

                        >
                            <MenuItem value="Public">{t('public')}</MenuItem>
                            <MenuItem value="Private">{t('private')}</MenuItem>
                        </TextField>
                    )}
                /> */}
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('start_date')}
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('startDate')}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('end_date')}
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('endDate')}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('rent_amount')}
                    type="number"
                    {...register('rentAmount')}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('collection_day')}
                    type="number"
                    {...register('collectionDay')}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editMode ? `Edit` : 'Submit'}
                </Button>
            </Box>
        </Modal>
    );
};

export default AddNewFlat;