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
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AddTransactions = ({ fetchData, setOpen, open, building }) => {
    const { register, handleSubmit, control, reset } = useForm();
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('/halls');
                setBuildings(response.data.data);
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };
        fetchBuildings();
    }, []);

    const handleClose = () => {
        setOpen(false);
        reset();
        fetchData();
    };

    const onSubmit = async (data) => {
        try {
            const formData = {
                buildingId: data.buildingId,
                amount: data.amount,
                date: data.date,
                type: data.type,
                transactionFrom: building ? "Flat" : "Hall",
                description: data.description,
            };

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
                        <TextField
                            {...field}
                            select
                            fullWidth
                            margin="normal"
                            label={t('buildingId')}
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