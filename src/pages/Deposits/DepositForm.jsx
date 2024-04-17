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

const DepositForm = ({ savings, shares, id, fetchData, setOpen, open }) => {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
    const [shareholderDetails, setShareholderDetails] = useState();
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const [totalAmount, setTotalAmount] = useState(0);
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);

    useEffect(() => {
        const fetchShareholderDetails = async () => {
            if (id) {
                try {
                    const response = await axiosInstance.get(`shareholder/financials/${id}`);
                    const data = savings ? response.data.response.savings : response.data.response.shares;
                    setShareholderDetails(data);
                } catch (error) {
                    console.error("Failed to fetch shareholder details:", error);
                }
            }
        };

        fetchShareholderDetails();
    }, [id, savings]);

    useEffect(() => {
        if (shareholderDetails) {
            const currentAmount = Number(shareholderDetails.currentAmount) || 0;
            const newShareAmount = parseFloat(watch('newShareAmount')) || 0;
            const newAmount = savings ? parseFloat(watch('newAmount')) : newShareAmount * 2;
            setValue('newAmount', newAmount, { shouldValidate: true });
            setTotalAmount((currentAmount + newAmount).toFixed(3));
        }
    }, [shareholderDetails, watch('newShareAmount'), savings]);

    const handleClose = () => {
        setOpen(false);
        reset();
        fetchData();
    };

    const onSubmit = async (data) => {
        try {
            const formData = {
                newAmount: data.newAmount,
                newShareAmount: data.newShareAmount ? Number(data.newShareAmount) : undefined,
                adminId: [adminData.id],
                year: year  // Use the selected year from the dropdown
            };
            const url = savings ? `shareholder/depositsavings/${id}` : `shareholder/depositshares/${id}`;
            await axiosInstance.post(url, formData);
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
                    id="currentAmount"
                    margin='normal'
                    fullWidth
                    label={t('current_amount')}
                    value={shareholderDetails?.currentAmount?.toFixed(3)}
                    disabled
                />
                <TextField
                    id="year"
                    select
                    label={t('year')}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    margin="normal"
                    fullWidth
                >
                    <MenuItem key="none" value="">
                        {t('select_year')} 
                    </MenuItem>
                    {[...Array(22)].map((_, index) => (
                        <MenuItem key={index} value={currentYear - index}>
                            {currentYear - index}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="newAmount"
                    margin="normal"
                    fullWidth
                    label={t('required_addition')}
                    {...register('newAmount', { required: true })}
                    error={!!errors.newAmount}
                    helperText={errors.newAmount ? t('this_field_is_required') : ''}
                    disabled={!savings}
                />
                {!savings && (
                    <>
                        <TextField
                            id="newShareAmount"
                            margin="normal"
                            fullWidth
                            label={t('new_share_amount')}
                            {...register('newShareAmount', { required: true })}
                            error={!!errors.newShareAmount}
                            helperText={errors.newShareAmount ? t('this_field_is_required') : ''}
                        />
                    </>
                )}
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('amount_after_addition')}
                    value={totalAmount}
                    disabled
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('edit')}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                    {t('close')}
                </Button>
            </Box>
        </Modal>
    );
};

export default DepositForm;
