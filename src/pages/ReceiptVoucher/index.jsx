import React, { useEffect, useRef, useState } from 'react'

import Box from '@mui/material/Box';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';

import { useReactToPrint } from 'react-to-print';

import MoneyForm from '../../printablePages/MoneyForm';
const ReceiptVoucher = () => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <React.Fragment>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600,
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        Receipt Voucher
                    </Typography>
                    <Box sx={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>

                    </Box>

                    <Button variant='contained' onClick={() => { handlePrint() }}>Print Form</Button>
                </Box>
                <MoneyForm ref={componentRef} />
            </Box>

        </React.Fragment>
    )
}

export default ReceiptVoucher