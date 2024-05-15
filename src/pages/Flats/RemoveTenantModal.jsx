import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

const RemoveTenantModal = ({ open, handleClose, handleRemoveTenant }) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{t('confirmRemoveTenant')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('confirmRemoveTenantText')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {t('cancel')}
                </Button>
                <Button onClick={handleRemoveTenant} color="primary" autoFocus>
                    {t('yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemoveTenantModal;
