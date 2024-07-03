import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '8rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const WithdrawalModalShare = ({ id, fetchData, setOpen, open }) => {
    const [shareholderDetails, setShareholderDetails] = useState();
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalShareAmount, setTotalShareAmount] = useState(0);
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchShareholderDetails = async () => {
            try {
                if (id !== null) {
                    const response = await axiosInstance.get(`shareholder/financials/${id}`);
                    const shareholderData = response?.data?.response;
                    setShareholderDetails(shareholderData);
                }
            } catch (error) {
                console.error("Failed to fetch shareholder details:", error);
            }
        };

        fetchShareholderDetails();
    }, [id, year,]);

    const handleClose = () => {
        setOpen(false);
        reset();
        fetchData();
    };

    const url = `/shareholder/withdrawshares/${id}`;

    const onSubmit = async (data) => {
        console.log("Submitting form", data);

        try {
            const updatedData = { ...data, userId: adminData?.id, year: year, date: selectedDate, };
            await axiosInstance.post(url, updatedData);
            handleClose();
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };

    const amountOfShares = watch('amountOfShares');
    const amountToWithdraw = watch('amountToWithdraw');

    useEffect(() => {
        setValue('amountToWithdraw', (amountOfShares * 2).toString());
    }, [amountOfShares, setValue]);

    useEffect(() => {
        const currentAmount = shareholderDetails?.totalAmount || 0;
        const currentShareAmount = shareholderDetails?.totalShareAmount || 0;
        const withdrawalAmount = parseFloat(amountToWithdraw) || 0;
        const withdrawalShareAmount = parseFloat(amountOfShares) || 0;
        setTotalAmount(currentAmount - withdrawalAmount);
        setTotalShareAmount(currentShareAmount - withdrawalShareAmount);
    }, [shareholderDetails, amountToWithdraw, amountOfShares]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box
                sx={{ ...style, width: '40rem' }}
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="availableShares"
                    margin="normal"
                    value={shareholderDetails?.sharesTotalAmount?.toFixed(3)}
                    fullWidth
                    disabled
                />
                <TextField
                    id="availableBalance"
                    margin="normal"
                    value={shareholderDetails?.shareValue?.toFixed(3)}
                    fullWidth
                    disabled
                />



                <TextField
                    id="amountOfShares"
                    margin="normal"
                    fullWidth
                    label={t('amount_of_shares')}
                    {...register('amountOfShares', { required: true })}
                    error={!!errors.amountOfShares}
                    helperText={errors.amountOfShares ? t('required_field') : ''}
                />

                <TextField
                    id="amountToWithdraw"
                    margin="normal"
                    fullWidth
                    label={t('withdrawal_amount')}
                    value={(parseFloat(amountOfShares) * 2).toFixed(3)}
                    disabled
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label={t('amount_after_withdrawal')}
                    value={Number(shareholderDetails?.shareValue) - Number(amountOfShares * 2)}
                    disabled
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label={t('share_amount_after_withdrawal')}
                    value={Number(shareholderDetails?.sharesTotalAmount) - Number(amountOfShares)}
                    disabled
                />
                <TextField
                    id="date"
                    type="date"
                    fullWidth
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                />


                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('withdraw')}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                    {t('close')}
                </Button>
            </Box>
        </Modal>
    );
};

export default WithdrawalModalShare;