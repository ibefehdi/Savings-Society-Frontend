import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const AddNewFlat = ({ editMode, setOpen, fetchData, open, flatData }) => {
    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm();
    const [buildings, setBuildings] = useState([]);

    const handleClose = () => {
        setOpen(false);
        fetchData();
    };

    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    useEffect(() => {
        if (editMode && flatData) {
            // Populate form fields with existing data
            Object.keys(flatData).forEach(key => {
                if (key === 'tenant') {
                    setValue('tenantName', flatData.tenant?.name);
                    setValue('tenantContactNumber', flatData.tenant?.contactNumber);
                    setValue('tenantCivilId', flatData.tenant?.civilId);
                } else if (key === 'contract') {
                    setValue('rentAmount', flatData.contract?.rentAmount);
                    setValue('startDate', flatData.contract?.startDate?.split('T')[0]);
                    // setValue('endDate', flatData.contract?.endDate?.split('T')[0]);
                    setValue('collectionDay', flatData.contract?.collectionDay);
                } else {
                    setValue(key, flatData[key]);
                }
            });
        }
    }, [editMode, flatData, setValue]);
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'civilIdDocument' || key === 'contractDocument') {
                    if (data[key] && data[key] instanceof File) {
                        formData.append(key, data[key], data[key].name);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            });

            if (editMode) {
                await axiosInstance.put(`/flat/${flatData._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axiosInstance.post(`createflat`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            handleClose();
            reset();
        } catch (error) {
            console.error('Error posting/editing flat data:', error);
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
                    {...register('flatNumber')}
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
                    error={!!errors.tenantName}
                    helperText={errors.tenantName ? 'Tenant Name is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('tenant_contact_number')}
                    {...register('tenantContactNumber')}
                />
                <Controller
                    name="tenantCivilId"
                    control={control}
                    defaultValue=""
                    rules={{ minLength: 12, maxLength: 12 }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label={t('tenant_civil_id')}
                            fullWidth
                            margin="normal"
                            error={!!error}
                            helperText={error ? t('max_length_exceeded') : ''}
                            InputProps={{
                                style: {
                                    color: error ? 'red' : 'inherit'
                                }
                            }}
                        />
                    )}
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
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date) => onChange(date)}
                            dateFormat="yyyy-MM-dd"
                            customInput={
                                <TextField
                                    fullWidth
                                    label={t('start_date')}
                                    margin="normal"
                                />
                            }
                        />
                    )}
                />

                {/* <Controller
                    name="endDate"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date) => onChange(date)}
                            dateFormat="yyyy-MM-dd"
                            customInput={
                                <TextField
                                    fullWidth
                                    label={t('end_date')}
                                    margin="normal"
                                />
                            }
                        />
                    )}
                /> */}
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('rent_amount')}
                    type="number"
                    {...register('rentAmount')}
                    error={!!errors.rentAmount}
                    helperText={errors.rentAmount ? 'Rent Amount is required' : ''}
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