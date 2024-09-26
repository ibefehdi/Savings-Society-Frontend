import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider, Grid, CircularProgress, Fade, Slide } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
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
  position: 'relative',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const ValueItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ValueLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const CloseButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const WarningBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const WarningText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.contrastText,
  fontWeight: 500,
  textAlign: 'right',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const PotentialIncrementModal = ({ open, handleClose, data, onWithdrawalSuccess }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!data) return null;

  const renderValueItem = (label, value, format = (v) => v) => (
    <Fade in={open} timeout={800}>
      <ValueItem>
        <ValueLabel>{t(label)}</ValueLabel>
        <ValueText>{format(value)}</ValueText>
      </ValueItem>
    </Fade>
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
      closeAfterTransition
      aria-labelledby="potential-increment-modal"
      aria-describedby="modal-showing-potential-increment-values"
    >
      <Slide direction="up" in={open}>
        <ModalContent>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
          <Title id="modal-modal-title">
            {t('full_withdrawal_for')} {data.shareholder.fName} {data.shareholder.lName}
          </Title>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SectionTitle>
                <AttachMoneyIcon color="primary" />
                {t('current_amount')}
              </SectionTitle>
              {renderValueItem('total_amount', data.currentValues.totalAmount, (v) => v.toFixed(3))}
              {renderValueItem('savings_increase', data.currentValues.savingsIncrease, (v) => v.toFixed(3))}
            </Grid>

            <Grid item xs={12}>
              <SectionTitle>
                <AttachMoneyIcon color="secondary" />
                {t('potential_increment')}
              </SectionTitle>
              {renderValueItem('potential_increment_amount', data.potentialIncrementAmount, (v) => v.toFixed(3))}
            </Grid>

            <Grid item xs={12}>
              <SectionTitle>
                <AttachMoneyIcon color="success" />
                {t('total_withdrawal_amount')}
              </SectionTitle>
              {renderValueItem('total_withdrawal_amount', data.currentValues.totalAmount + data.potentialIncrementAmount, (v) => v.toFixed(3))}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Fade in={open} timeout={1000}>
            <WarningBox>
              <WarningText>
                <WarningIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                {t('full_withdrawal_warning')}
              </WarningText>
            </WarningBox>
          </Fade>

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: '1rem', justifyContent: 'center' }}>
            <ActionButton
              variant="contained"
              color="primary"
              onClick={handleWithdraw}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : t('confirm')}
            </ActionButton>
            <ActionButton variant="outlined" color="secondary" onClick={handleClose}>
              {t('close')}
            </ActionButton>
          </Box>
        </ModalContent>
      </Slide>
    </StyledModal>
  );
};

export default PotentialIncrementModal;