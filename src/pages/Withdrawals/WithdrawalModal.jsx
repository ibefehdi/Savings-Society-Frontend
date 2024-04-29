import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem"
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
const WithdrawalModal = ({ id, fetchData, setOpen, open, savings }) => {
    const [shareholderDetails, setShareholderDetails] = useState();
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [totalAmount, setTotalAmount] = useState(0);
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm();
    useEffect(() => {
        const fetchShareholderDetails = async () => {
            try {
                if (id !== null) {
                    const response = await axiosInstance.get(`shareholder/financials/${id}`);
                    const shareholderData = savings ? response?.data?.response?.savings : response?.data?.response?.shares
                    setShareholderDetails(shareholderData);
                    console.log("This is the details of the shareholder", shareholderData);

                }


            } catch (error) {
                console.error("Failed to fetch shareholder details:", error);
            }
        };

        fetchShareholderDetails();
    }, [id]);
    const handleClose = () => {
        setOpen(false)
        reset()
        fetchData();
    }
    const url = savings ? `/shareholder/withdrawsavings/${id}` : `/shareholder/withdrawshares/${id}`
    const onSubmit = async (data) => {
        console.log("Submitting form", data);

        try {
            const updatedData = { ...data, adminId: [adminData?.id] }
            await axiosInstance.post(url, updatedData);
            handleClose();
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };

    const amountOfShares = watch('amountOfShares');
    const amountToWithdraw = watch('amountToWithdraw');

    useEffect(() => {
        if (!savings) {
            setValue('amountToWithdraw', (amountOfShares * 2).toString());
        }
    }, [amountOfShares, setValue, savings]);

    useEffect(() => {
        const currentAmount = shareholderDetails?.currentAmount || 0;
        const additionAmount = parseFloat(amountToWithdraw) || 0;
        setTotalAmount(currentAmount - additionAmount);
    }, [shareholderDetails, amountToWithdraw]);
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
                {!savings && (
                    <TextField
                        id="amountOfShares"
                        margin='normal'
                        fullWidth
                        label={t('amount_of_shares')}
                        {...register('amountOfShares', { required: true })}
                        value={shareholderDetails?.amountOfShares}

                    />
                )}
                {!savings && (<TextField
                    id="year"
                    select
                    label={t('year')}
                    value={year}
                    {...register('year', { required: true })}
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
                </TextField>)}
                {savings && (
                    <TextField
                        id="availableBalance"
                        margin="normal"
                        value={shareholderDetails?.currentAmount}
                        fullWidth
                        label={t('availableBalance')}
                        disabled={true}
                    />
                )}
                <TextField
                    id="amountToWithdraw"
                    margin="normal"
                    fullWidth
                    label={t('withdrawal_amount')}
                    {...register('amountToWithdraw', { required: true })}
                    error={!!errors.amountToWithdraw}
                    helperText={errors.amountToWithdraw ? t('required_field') : ''}
                    disabled={!savings}
                />

                {savings && (<TextField
                    margin="normal"
                    fullWidth
                    label={t('amount_after_withdrawal')}
                    value={totalAmount}
                    disabled
                />)}
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('withdraw')}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                    {t('close')}
                </Button>
            </Box>
        </Modal>
    );
}

export default WithdrawalModal