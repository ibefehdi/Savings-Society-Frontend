import React from 'react';
import { Modal, Box, Typography, Button, Divider, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

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

const PotentialIncrementModal = ({ open, handleClose, data }) => {
    const { t } = useTranslation();

    if (!data) return null;

    const renderValueItem = (label, value, format = (v) => v) => (
        <ValueItem>
            <ValueLabel>{t(label)}</ValueLabel>
            <ValueText>{format(value)}</ValueText>
        </ValueItem>
    );

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
                    {t('potential_increment_for')} {data.shareholder.fName} {data.shareholder.lName}
                </Title>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <SectionTitle>{t('current_values')}</SectionTitle>
                        {renderValueItem('total_amount', data.currentValues.totalAmount, (v) => v.toFixed(3))}
                        {renderValueItem('savings_increase', data.currentValues.savingsIncrease, (v) => v.toFixed(3))}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SectionTitle>{t('potential_values')}</SectionTitle>
                        {renderValueItem('total_amount', data.potentialValues.totalAmount, (v) => v.toFixed(3))}
                        {renderValueItem('savings_increase', data.potentialValues.savingsIncrease, (v) => v.toFixed(3))}
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" color="primary.contrastText">
                        {t('potential_increment_amount')}: {data.potentialIncrementAmount.toFixed(3)}
                    </Typography>
                </Box>

                <Message>{data.message}</Message>

                <Button variant="contained" fullWidth onClick={handleClose}>
                    {t('close')}
                </Button>
            </ModalContent>
        </StyledModal>
    );
};

export default PotentialIncrementModal;