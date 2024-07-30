import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

const DeleteFlatModal = ({ open, handleClose, handleDeleteFlat }) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{t('confirmDeleteFlat')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('confirmDeleteFlatText')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {t('cancel')}
                </Button>
                <Button onClick={handleDeleteFlat} color="primary" autoFocus>
                    {t('yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteFlatModal;