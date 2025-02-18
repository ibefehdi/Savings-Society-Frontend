// components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

const BackButton = ({ onClick }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleBack = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
                fontSize: '1.3rem',
                fontWeight: 800, marginLeft: 2, marginRight: 2
            }}
        >
            {t('back')}
        </Button>
    );
};

export default BackButton;