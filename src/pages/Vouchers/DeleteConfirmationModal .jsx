import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
    const { t, i18n } = useTranslation();
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t('delete_voucher')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('confirm_delete')}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('no')}
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    {t('yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationModal;
