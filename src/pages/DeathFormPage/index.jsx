import React, { useRef, useState } from 'react'

import Box from '@mui/material/Box';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';

import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import DeathForm from '../../printablePages/DeathForm';
import axiosInstance from '../../constants/axiosInstance';
import { TextField } from '@mui/material';
const DeathFormPage = () => {
    const componentRef = useRef();
    const { t } = useTranslation();
    const [membersCode, setMembersCode] = useState('');
    const [shareholder, setShareholder] = useState(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handleFetch = async () => {
        try {
            const response = await axiosInstance.post('/shareholderbymemberscode', {
                membersCode: parseInt(membersCode),
            });
            setShareholder(response.data.shareholder);
        } catch (error) {
            console.error('Error fetching shareholder:', error);
        }
    };

    return (
        <React.Fragment>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', height: '100%' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600,
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('death_form')}
                    </Typography>
                    <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}></Box>
                    <TextField
                        label="Member's Code"
                        value={membersCode}
                        onChange={(e) => setMembersCode(e.target.value)}
                        sx={{ marginRight: '1rem' }}
                    />
                    <Button variant="contained" onClick={handleFetch} sx={{ marginRight: '1rem' }}>
                        Fetch
                    </Button>

                    <Button variant='contained' onClick={() => { handlePrint() }}>{t('print_form')}</Button>
                </Box>
                <DeathForm ref={componentRef} shareholder={shareholder} />
            </Box>

        </React.Fragment>
    )
}

export default DeathFormPage