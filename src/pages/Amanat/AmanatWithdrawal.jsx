import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
const AmanatWithdrawal = ({ id, fetchData, setOpen, open }) => {
    const [shareholderDetails, setShareholderDetails] = useState();
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const [totalAmount, setTotalAmount] = useState(0);
    const { i18n, t } = useTranslation();
    const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm();
    useEffect(() => {
        const fetchShareholderDetails = async () => {
            try {
                if (id !== null) {
                    const response = await axiosInstance.get(`shareholder/financials/${id}`);
                    const shareholderData = response?.data?.response?.savings?.amanat
                    console.log(response?.data?.response?.savings?.amanat);
                    setShareholderDetails(shareholderData);
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
    const onSubmit = async (data) => {
        try {
            const updatedData = { ...data, adminId: [adminData?.id] }
            await axiosInstance.post(`/shareholder/withdrawamanat/${id}`, updatedData);
            handleClose();
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };
    const amountToWithdraw = watch('amountToWithdraw');
    useEffect(() => {
        const currentAmount = shareholderDetails?.amount || 0;
        const additionAmount = parseFloat(amountToWithdraw) || 0;
        setTotalAmount((currentAmount - additionAmount));
    }, [shareholderDetails, amountToWithdraw]);
    const isRtl = i18n.dir() === 'rtl';
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-shareholder-modal-title"
            aria-describedby="add-shareholder-modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}

        >
            <Box sx={{
                ...style,
                width: '40rem',
            }}
                component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <TextField
                    id="currentAmount"
                    margin='normal'
                    fullWidth
                    label={t('current_amount')}
                    value={shareholderDetails?.amount}
                    disabled
                />
                <TextField
                    id="amountToWithdraw"
                    margin="normal"
                    fullWidth
                    label={t('withdrawal_amount')}
                    {...register('amountToWithdraw', { required: true })}
                    error={!!errors.newAmount}
                    helperText={errors.newAmount ? 'This is required' : ''}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('amount_after_withdrawal')}
                    value={totalAmount}
                    disabled
                />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t('withdraw')}

                </Button>
            </Box>
        </Modal>
    )
}

export default AmanatWithdrawal