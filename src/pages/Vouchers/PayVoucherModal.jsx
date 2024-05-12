// PayVoucherModal.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';

const PayVoucherModal = ({ open, onClose, voucherId, fetchData }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/voucherpaid/${voucherId}`, { date });
            onClose();
            fetchData();
        } catch (error) {
            console.error('Error paying voucher:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t('Pay Voucher')}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={t('Date')}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        required
                    />
                    <DialogActions>
                        <Button onClick={onClose}>{t('Cancel')}</Button>
                        <Button type="submit" variant="contained">
                            {t('Pay')}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PayVoucherModal;