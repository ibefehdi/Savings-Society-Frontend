import React, { useRef } from 'react'

import Box from '@mui/material/Box';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';

import { useReactToPrint } from 'react-to-print';
import MembershipApplicationForm from '../../printablePages/MembershipApplicationForm';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
const MembershipApplicationFormPage = () => {
    const componentRef = useRef();
    const { t } = useTranslation();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
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
                        {t('withdrawal_form')}
                    </Typography>
                    <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>

                    </Box>

                    <Button variant='contained' onClick={() => { handlePrint() }}>{t('print_form')}</Button>
                    <BackButton />

                </Box>
                <MembershipApplicationForm ref={componentRef} />
            </Box>

        </React.Fragment>
    )
}

export default MembershipApplicationFormPage