import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import axiosInstance from '../../constants/axiosInstance';
import MoneyForm from '../../printablePages/MoneyForm';
import BackButton from '../../components/BackButton';

const ReceiptVoucher = () => {
    const componentRef = useRef();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [serial, setSerial] = useState('');
    const [triggerPrint, setTriggerPrint] = useState(false); // State to trigger print

    useEffect(() => {
        if (triggerPrint) {
            handlePrint(); 
        }
    }, [triggerPrint]); 

    const fetchDataAndPrint = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/receipt-voucher-serials', {});
            setSerial(response.data.serialNumber);
            setTriggerPrint(true); // Set to true to trigger the print in useEffect
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => setTriggerPrint(false), // Reset triggerPrint after printing
    });

    return (
        <React.Fragment>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{ fontStyle: 'normal', fontWeight: 600, lineHeight: '1.875rem', flexGrow: 1, marginLeft: '1.2rem' }}>
                        {t('receipt_voucher')}
                    </Typography>
                    <Button variant='contained' onClick={fetchDataAndPrint} disabled={loading}>
                        {t('print_form')}
                    </Button>
                    <BackButton />

                </Box>
                <MoneyForm ref={componentRef} serial={serial} />
            </Box>
        </React.Fragment>
    );
};

export default ReceiptVoucher;
