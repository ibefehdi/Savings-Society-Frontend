import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { useForm, Controller, } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';

const AddVoucherModal = ({ open, onClose, fetchData, editingVoucher }) => {
    const { control, handleSubmit, reset, watch, setValue, setError, formState: { errors } } = useForm();
    const [buildings, setBuildings] = useState([]);
    const [flats, setFlats] = useState([]);
    const [apiError, setApiError] = useState('');
    const [tenants, setTenants] = useState([]);
    const { t, i18n } = useTranslation()
    const selectedBuildingId = watch('buildingId');
    const selectedFlatId = watch('flatId');

    useEffect(() => {
        if (editingVoucher) {
            // Populate form fields with editing voucher data
            setValue('buildingId', editingVoucher.buildingId._id);
            setValue('flatId', editingVoucher.flatId._id);
            setValue('tenantId', editingVoucher.tenantId._id);
            setValue('amount', editingVoucher.amount);
            setValue('pendingDate', editingVoucher.pendingDate?.split('T')[0]);
            setValue('paidDate', editingVoucher.paidDate?.split('T')[0]);
            setValue('status', editingVoucher.status);
            setValue('voucherNo', editingVoucher.voucherNo);
        } else {
            // Reset form when not editing
            reset();
        }
    }, [editingVoucher, setValue, reset]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('buildingdropdown');
                setBuildings(response?.data?.data);
                console.log(buildings)
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };

        fetchBuildings();
    }, []);

    useEffect(() => {
        const fetchFlats = async () => {
            try {
                if (selectedBuildingId) {
                    const response = await axiosInstance.get(`/flatsbybuildingid/${selectedBuildingId}`);
                    setFlats(response.data?.data);
                    console.log(flats);
                } else {
                    setFlats([]);
                }
            } catch (error) {
                console.error('Error fetching flats:', error);
            }
        };

        fetchFlats();
    }, [selectedBuildingId]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                if (selectedFlatId) {
                    const response = await axiosInstance.get(`/tenantsbyflatid/${selectedFlatId}`);
                    console.log("The Response: ", response?.data?.data);
                    const tenants = response.data?.data;
                    setTenants(tenants);
                    console.log("length of tenants:", tenants.length);
                    if (tenants.length === 1) {
                        const tenant = tenants[0].tenant;
                        console.log("Tenant: ", tenant)
                        const contract = tenants[0].contract;
                        setValue('tenantId', tenant._id, { shouldValidate: true });
                        setValue('amount', contract.rentAmount, { shouldValidate: true });
                    }
                } else {
                    setTenants([]);
                    setValue('tenantId', '', { shouldValidate: true });
                    setValue('amount', '', { shouldValidate: true });
                }
            } catch (error) {
                console.error('Error fetching tenants:', error);
            }
        };
        fetchTenants();
    }, [selectedFlatId, setValue]);

    const onSubmit = async (data) => {
        setApiError(''); // Reset API error on new submission
        try {
            if (editingVoucher) {
                await axiosInstance.put(`/updatevoucher/${editingVoucher._id}`, data);
            } else {
                const response = await axiosInstance.post('/createvoucher', data);
                if (response.data.existingVoucher) {
                    setApiError(t('existingVoucherMessage', { month: new Date(response.data.existingVoucher.pendingDate).toLocaleString('default', { month: 'long' }) }));
                    return;
                }
            }
            reset();
            onClose();
            fetchData();
        } catch (error) {
            console.error('Error saving voucher:', error);
            if (error.response && error.response.data) {
                const { errors: validationErrors, error: errorMessage } = error.response.data;
                if (validationErrors) {
                    // Handle validation errors
                    Object.keys(validationErrors).forEach(key => {
                        setError(key, { type: 'manual', message: validationErrors[key] });
                    });
                } else if (errorMessage) {
                    // Handle other errors
                    setApiError(t('errorSavingVoucher', { message: errorMessage }));
                }
            } else {
                setApiError(t('unknownError'));
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '2rem',
                outline: 'none',
                maxWidth: '90%',
                maxHeight: '90%',
                overflow: 'auto',
                width: '500px',
            }}>
                <Typography variant="h6" component="h2">
                    {editingVoucher ? t('editVoucher') : t('addVoucher')}
                </Typography>
                {apiError && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{apiError}</Alert>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="voucherNo"
                        control={control}
                        defaultValue=""
                        rules={{ required: t('voucherNoRequired') }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={t('voucherNo')}
                                fullWidth
                                margin="normal"
                                error={!!errors.voucherNo}
                                helperText={errors.voucherNo?.message}
                            />
                        )}
                    />
                    <FormControl fullWidth margin="normal" error={!!errors.buildingId}>
                        <InputLabel>{t('buildings')}</InputLabel>
                        <Controller
                            name="buildingId"
                            control={control}
                            rules={{ required: t('buildingRequired') }}
                            render={({ field }) => (
                                <Select {...field}>
                                    {buildings.map((building) => (
                                        <MenuItem key={building._id} value={building._id}>
                                            {building.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.buildingId && <Typography color="error">{errors.buildingId.message}</Typography>}
                    </FormControl>
                    <FormControl fullWidth margin="normal" error={!!errors.flatId}>
                        <InputLabel>{t('flats')}</InputLabel>
                        <Controller
                            name="flatId"
                            control={control}
                            rules={{ required: t('flatRequired') }}
                            render={({ field }) => (
                                <Select {...field} disabled={!selectedBuildingId}>
                                    {flats.map((flat) => (
                                        <MenuItem key={flat._id} value={flat._id}>
                                            {flat.flatNumber}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.flatId && <Typography color="error">{errors.flatId.message}</Typography>}
                    </FormControl>
                    <FormControl fullWidth margin="normal" error={!!errors.tenantId}>
                        <InputLabel>{t('tenants')}</InputLabel>
                        <Controller
                            name="tenantId"
                            control={control}
                            rules={{ required: t('tenantRequired') }}
                            render={({ field }) => (
                                <Select {...field} disabled={!selectedFlatId || tenants.length === 1}>
                                    {tenants.map((tenant) => (
                                        <MenuItem key={tenant?.tenant?._id} value={tenant?.tenant?._id}>
                                            {tenant?.tenant?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.tenantId && <Typography color="error">{errors.tenantId.message}</Typography>}
                    </FormControl>
                    <Controller
                        name="amount"
                        control={control}
                        defaultValue=""
                        rules={{ required: t('amountRequired') }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={t('amount')}
                                fullWidth
                                margin="normal"
                                disabled={editingVoucher ? false : true}
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                            />
                        )}
                    />
                    <Controller
                        name="pendingDate"
                        control={control}
                        defaultValue=""
                        rules={{ required: t('pendingDateRequired') }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={t('pendingDate')}
                                type="month"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                value={field.value ? field.value.substring(0, 7) : ''}
                                onChange={(e) => {
                                    const selectedMonth = e.target.value;
                                    const formattedDate = `${selectedMonth}-05`;
                                    field.onChange(formattedDate);
                                }}
                                error={!!errors.pendingDate}
                                helperText={errors.pendingDate?.message}
                            />
                        )}
                    />
                    <Controller
                        name="paidDate"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={t('paidDate')}
                                type="date"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.paidDate}
                                helperText={errors.paidDate?.message}
                            />
                        )}
                    />
                    <FormControl fullWidth margin="normal" error={!!errors.status}>
                        <InputLabel>{t('status')}</InputLabel>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue="Pending"
                            rules={{ required: t('statusRequired') }}
                            render={({ field }) => (
                                <Select {...field}>
                                    <MenuItem value="Pending">{t('pending')}</MenuItem>
                                    <MenuItem value="Paid">{t('paid')}</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.status && <Typography color="error">{errors.status.message}</Typography>}
                    </FormControl>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={onClose} sx={{ mr: 1 }}>{t('close')}</Button>
                        <Button type="submit" variant="contained">
                            {editingVoucher ? t('edit') : t('add')}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};


export default AddVoucherModal;