import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider, Grid, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../constants/axiosInstance';

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

}));

const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    width: '90%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflow: 'auto',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    fontWeight: 600,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
}));

const ValueItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

const ValueLabel = styled(Typography)(({ theme }) => ({
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
}));

const ValueText = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
}));

const Message = styled(Typography)(({ theme }) => ({
    fontSize: '0.9rem',
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const CloseButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
}));
const WarningBox = ({ t }) => {
    return (
        <Box sx={{ bgcolor: 'red', p: 2, borderRadius: 2, position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography
                    variant="subtitle2"
                    color="primary.contrastText"
                    sx={{
                        fontWeight: 'bold',
                        mb: 1,
                    }}
                >
                    ! ملاحظة
                </Typography>
                <Typography
                    variant="body1"
                    color="primary.contrastText"
                    sx={{
                        textAlign: 'right',
                        width: '100%',
                    }}
                >
                    {t('full_withdrawal_warning').replace('! ملاحظة:', '').trim()}
                </Typography>
            </Box>
        </Box>
    );
};

const PotentialIncrementModal = ({ open, handleClose, data, onWithdrawalSuccess }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!data) return null;

    const renderValueItem = (label, value, format = (v) => v) => (
        <ValueItem>
            <ValueLabel>{t(label)}</ValueLabel>
            <ValueText>{format(value)}</ValueText>
        </ValueItem>
    );

    const handleWithdraw = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(`/shareholder/${data.shareholder.id}/withdraw-savings`, {
                adminId: JSON.parse(sessionStorage.getItem('userDetails')).id,
                date: new Date().toISOString()
            });

            if (response.data.status === 0) {
                onWithdrawalSuccess(response.data);
                handleClose();
            } else {
                setError(response.data.message || 'An error occurred during withdrawal');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during withdrawal');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledModal
            open={open}
            onClose={handleClose}
            aria-labelledby="potential-increment-modal"
            aria-describedby="modal-showing-potential-increment-values"
        >
            <ModalContent>
                <CloseButton onClick={handleClose}>
                    <CloseIcon />
                </CloseButton>
                <Title id="modal-modal-title">
                    {t('full_withdrawal_for')} {data.shareholder.fName} {data.shareholder.lName}
                </Title>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <SectionTitle>{t('current_amount')}</SectionTitle>
                        {renderValueItem('total_amount', data.currentValues.totalAmount, (v) => v.toFixed(3))}
                        {renderValueItem('savings_increase', data.currentValues.savingsIncrease, (v) => v.toFixed(3))}
                    </Grid>

                    <Grid item xs={12}>
                        <SectionTitle>{t('potential_increment')}</SectionTitle>
                        {renderValueItem('potential_increment_amount', data.potentialIncrementAmount, (v) => v.toFixed(3))}
                    </Grid>

                    <Grid item xs={12}>
                        <SectionTitle>{t('total_withdrawal_amount')}</SectionTitle>
                        {renderValueItem('total_withdrawal_amount', data.currentValues.totalAmount + data.potentialIncrementAmount, (v) => v.toFixed(3))}
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <WarningBox t={t} />


                <Divider sx={{ my: 3 }} />
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ display: "flex", gap: '1rem' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleWithdraw}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : t('confirm')}
                    </Button>
                    <Button variant="contained" fullWidth onClick={handleClose}>
                        {t('close')}
                    </Button>
                </Box>
            </ModalContent>
        </StyledModal>
    );
};

export default PotentialIncrementModal;