import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

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

const AddTransactions = ({ fetchData, setOpen, open, building }) => {
    const { register, handleSubmit, control, reset, watch, setValue } = useForm();
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [buildings, setBuildings] = useState([]);
    const [flats, setFlats] = useState([]);
    const [tenants, setTenants] = useState([]);

    const selectedBuildingId = watch('buildingId');
    const selectedFlatId = watch('flatId');

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('/buildingdropdown');
                setBuildings(response.data.data);
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };
        fetchBuildings();
    }, []);

    useEffect(() => {
        const fetchFlats = async () => {
            if (selectedBuildingId) {
                try {
                    const response = await axiosInstance.get(`/flatsbybuildingid/${selectedBuildingId}`);
                    setFlats(response.data?.data || []);
                } catch (error) {
                    console.error('Error fetching flats:', error);
                    setFlats([]);
                }
            } else {
                setFlats([]);
            }
        };
        fetchFlats();
    }, [selectedBuildingId]);

    useEffect(() => {
        const fetchTenants = async () => {
            if (selectedFlatId) {
                try {
                    const response = await axiosInstance.get(`/tenantsbyflatid/${selectedFlatId}`);
                    const tenantsData = response.data?.data || [];
                    setTenants(tenantsData);
                    if (tenantsData.length === 1) {
                        setValue('tenantId', tenantsData[0].tenant._id);
                    }
                } catch (error) {
                    console.error('Error fetching tenants:', error);
                    setTenants([]);
                }
            } else {
                setTenants([]);
                setValue('tenantId', '');
            }
        };
        fetchTenants();
    }, [selectedFlatId, setValue]);

    const handleClose = () => {
        setOpen(false);
        reset();
        fetchData();
    };

    const onSubmit = async (data) => {
        try {
            const selectedBuilding = buildings.find(b => b._id === data.buildingId);

            const formData = {
                buildingId: data.buildingId,
                flatId: data.flatId,
                tenantId: data.tenantId,
                amount: data.amount,
                date: data.date,
                type: data.type,
                transactionFrom: selectedBuilding?.type === "Building" ? "Flat" : "Hall",
                description: data.description,
            };
            console.log("Submitting transaction:", formData); // For debugging


            await axiosInstance.post("createTransaction", formData);
            handleClose();
        } catch (error) {
            console.error('Error posting transaction data:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-transaction-modal-title"
            aria-describedby="add-transaction-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <Controller
                    name="buildingId"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>{t('buildingId')}</InputLabel>
                            <Select {...field}>
                                {buildings.map((building) => (
                                    <MenuItem key={building._id} value={building._id}>
                                        {building.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />

                {selectedBuildingId && buildings.find(b => b._id === selectedBuildingId)?.type === "Building" && (
                    <>
                        <Controller
                            name="flatId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>{t('flat')}</InputLabel>
                                    <Select {...field}>
                                        {flats.map((flat) => (
                                            <MenuItem key={flat._id} value={flat._id}>
                                                {flat.flatNumber}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="tenantId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>{t('tenant')}</InputLabel>
                                    <Select {...field} disabled={tenants.length === 1}>
                                        {tenants.map((tenant) => (
                                            <MenuItem key={tenant.tenant._id} value={tenant.tenant._id}>
                                                {tenant.tenant.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </>
                )}

                <TextField
                    id="amount"
                    margin='normal'
                    fullWidth
                    label={t('amount')}
                    {...register('amount', { required: true })}
                />
                <Controller
                    name="date"
                    control={control}
                    defaultValue={new Date().toISOString().split('T')[0]}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="date"
                            fullWidth
                            margin="normal"
                            label={t('date')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                />
                <Controller
                    name="type"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            fullWidth
                            margin="normal"
                            label={t('type')}
                        >
                            <MenuItem value="Income">{t('income')}</MenuItem>
                            <MenuItem value="Expense">{t('expense')}</MenuItem>
                        </TextField>
                    )}
                />

                <TextField
                    id="description"
                    margin='normal'
                    fullWidth
                    label={t('description')}
                    {...register('description', { required: true })}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('add')}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                    {t('close')}
                </Button>
            </Box>
        </Modal>
    );
};

export default AddTransactions;