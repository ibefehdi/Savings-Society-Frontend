import React, { useCallback, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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

const DepositFormShare = ({ id, fetchData, setOpen, open }) => {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
    const [shareholderDetails, setShareholderDetails] = useState();
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalShareAmount, setTotalShareAmount] = useState(0);
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [shareholderAllDetails, setShareholderAllDetails] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchShareholderDetails = useCallback(async () => {
        if (id) {
            try {
                console.log(`Fetching data for shareholder ID: ${id}, year: ${year}`);
                const response = await axiosInstance.get(`shareholder/financials/${id}?year=${year}`);
                const data = response?.data?.response;
                console.log(response);
                setShareholderDetails(data);
                console.log(shareholderDetails);
            } catch (error) {
                console.error("Failed to fetch shareholder details:", error);
            }
        }
    }, [id, year]);

    useEffect(() => {
        const fetchAllShareholderDetails = async () => {
            if (id) {
                const response = await axiosInstance.get(`shareholder/${id}`);
                console.log("This is the shareholder: ", response?.data?.shareholder);
                setShareholderAllDetails(response?.data?.shareholder);
            }
        };
        fetchAllShareholderDetails();
        fetchShareholderDetails();
    }, [id, fetchShareholderDetails]);

    const newShareAmount = watch('newShareAmount');

    useEffect(() => {
        if (shareholderDetails) {
            const currentAmount = Number(shareholderDetails.sharesTotalAmount) || 0;
            const currentShareAmount = Number(shareholderDetails.shareValue) || 0;
            const additionShareAmount = parseFloat(newShareAmount) || 0;
            const additionAmount = additionShareAmount * 2;
            setTotalAmount((currentAmount + additionAmount).toFixed(3));
            setTotalShareAmount(currentShareAmount + additionShareAmount);
        }
    }, [shareholderDetails, newShareAmount]);

    const handleClose = () => {
        setOpen(false);
        reset();
        setSelectedDate(new Date());

        setErrorMessage('');
        fetchData();
    };

    const onSubmit = async (data) => {
        try {
            const formData = {
                newShareAmount: data.newShareAmount,
                adminId: adminData.id,
                year: currentYear,
                date: selectedDate,
            };
            const url = `shareholder/depositshares/${id}`;
            const response = await axiosInstance.post(url, formData);

            if (response.data.status === 2) {
                setErrorMessage(isRtl ? response.data.messageArabic : response.data.message);
            } else {
                handleClose();
            }
        } catch (error) {
            console.error('Error posting shareholder data:', error);
            if (error.response && error.response.data && error.response.data.status === 2) {
                setErrorMessage(isRtl ? error.response.data.messageArabic : error.response.data.message);
            } else {
                setErrorMessage(isRtl ? 'حدث خطأ أثناء معالجة طلبك.' : 'An error occurred while processing your request.');
            }
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
                    margin="normal"
                    fullWidth
                    label={t('current_amount')}
                    value={shareholderDetails?.sharesTotalAmount}
                    disabled
                />

                <TextField
                    id="currentShareAmount"
                    margin="normal"
                    fullWidth
                    label={t('current_share_amount')}
                    value={shareholderDetails?.shareValue}
                    disabled
                />

                <TextField
                    id="newShareAmount"
                    margin="normal"
                    fullWidth
                    label={t('new_share_amount')}
                    {...register('newShareAmount', { required: true })}
                    error={!!errors.newShareAmount}
                    helperText={errors.newShareAmount ? t('this_field_is_required') : ''}
                />

                <TextField
                    id="newAmount"
                    margin="normal"
                    fullWidth
                    label={t('new_amount')}
                    value={newShareAmount ? (parseFloat(newShareAmount) * 2).toFixed(3) : ''}
                    disabled
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label={t('amount_after_addition')}
                    value={totalAmount}
                    disabled
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label={t('share_amount_after_addition')}
                    value={totalShareAmount}
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
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

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

export default DepositFormShare;