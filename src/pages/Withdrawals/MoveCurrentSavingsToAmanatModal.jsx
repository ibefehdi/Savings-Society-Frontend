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
    width: '40rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const MoveCurrentSavingsToAmanatModal = ({ id, fetchData, setOpen, open }) => {
    const [shareholderDetails, setShareholderDetails] = useState();
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchShareholderDetails = async () => {
            try {
                if (id !== null) {
                    const response = await axiosInstance.get(`shareholder/financials/${id}`);
                    const shareholderData = response?.data?.response
                    console.log(response?.data?.response)
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

    const url = `/shareholder/movecurrentsavingstoamanat/${id}`
    const onSubmit = async (data) => {
        console.log("Submitting form", data);

        try {
            const updatedData = { ...data, userId: adminData?.id, date: selectedDate, }
            console.log(updatedData)
            await axiosInstance.post(url, updatedData);
            handleClose();
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };

    const amountToMove = watch('amountToMove');
    const handleMaxClick = () => {
        const maxAmount = shareholderDetails?.savings || 0;
        setValue('amountToMove', maxAmount.toString());
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            <Box
                sx={style}
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="availableBalance"
                    margin="normal"
                    value={shareholderDetails?.savings || 0}
                    fullWidth
                    label={t('availableBalance')}
                    disabled={true}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        id="amountToMove"
                        margin="normal"
                        fullWidth
                        label={t('amount_to_move')}
                        {...register('amountToMove', {
                            required: true,
                            max: shareholderDetails?.savings || 0
                        })}
                        error={!!errors.amountToMove}
                        helperText={errors.amountToMove ?
                            errors.amountToMove.type === 'required' ? t('required_field') : t('exceeds_available_balance')
                            : ''}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleMaxClick}
                        sx={{ height: '56px', marginTop: '16px' }}
                    >
                        {t('max')}
                    </Button>
                </Box>
                <TextField
                    margin="normal"
                    fullWidth
                    label={t('amount_after_transfer')}
                    value={(shareholderDetails?.savings || 0) - Number(amountToMove)}
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
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, mr: 2 }}>
                    {t('transfer')}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 3, mb: 2 }}>
                    {t('close')}
                </Button>
            </Box>
        </Modal>
    );
}

export default MoveCurrentSavingsToAmanatModal;