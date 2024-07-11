// AssignTenantModal.js
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';

const AssignTenantModal = ({ open, handleClose, flatId, fetchData }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, reset } = useForm();

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

            await axiosInstance.put(`addtenant/${flatId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error assigning tenant:', error);
        }
    };
    useEffect(() => {
        if (!open) {
            reset({}, { keepValues: false, keepErrors: false, keepDirty: false, keepIsSubmitted: false, keepTouched: false, keepIsValid: false, keepSubmitCount: false });
        }
    }, [open, reset]);
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t('assignTenant')}</DialogTitle>
            <DialogContent>
                <Controller
                    name="tenantName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label={t('tenantName')} fullWidth margin="normal" />
                    )}
                />
                <Controller
                    name="tenantContactNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label={t('tenantContactNumber')} fullWidth margin="normal" />
                    )}
                />
                {/* <Controller
                    name="tenantType"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Select {...field} label={t('tenantType')} fullWidth margin="normal">
                            <MenuItem value="Private">{t('private')}</MenuItem>
                            <MenuItem value="Public">{t('public')}</MenuItem>
                        </Select>
                    )}
                /> */}
                <Controller
                    name="startDate"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('startDate')}
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                />
                <Controller
                    name="endDate"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('endDate')}
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                />
                <Controller
                    name="rentAmount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label={t('rentAmount')} type="number" fullWidth margin="normal" />
                    )}
                />
                <Controller
                    name="collectionDay"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label={t('collectionDay')} type="number" fullWidth margin="normal" />
                    )}
                />
                <Controller
                    name="tenantCivilId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} label={t('civil_id')} fullWidth margin="normal" />
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
                            label={t('civil_id')}
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    {t('assign')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignTenantModal;