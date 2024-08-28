import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../constants/axiosInstance';

const ChangeBalanceModal = ({ open, setOpen, currentBalance, shareholderId, onSuccess }) => {
    const [balance, setBalance] = useState(currentBalance);
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation();

    const handleSubmit = async () => {
        try {
            const balanceToSend = parseFloat(balance);
            if (isNaN(balanceToSend)) {
                setError(t('invalid_balance'));
                return;
            }

            const response = await axiosInstance.put(`changealraseed/${shareholderId}`, {
                balance: balanceToSend
            });

            console.log(response.data.message);
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to change balance:", error);
            setError(t('balance_change_failed'));
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{t('change_balance')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('new_balance')}
                    type="number"
                    fullWidth
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>{t('close')}</Button>
                <Button onClick={handleSubmit}>{t('submit')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeBalanceModal;