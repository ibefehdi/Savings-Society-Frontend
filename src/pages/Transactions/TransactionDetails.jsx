import { Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from "@emotion/react";

const TransactionDetailsModal = ({ transaction, open, onClose }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
    const cacheLtr = createCache({ key: 'muilt' });

    if (!transaction) return null;

    const isHallTransaction = transaction.buildingId?.type === 'Hall';

    const details = [
        { label: t('building_name'), value: transaction.buildingId?.name },
        { label: t('building_type'), value: transaction.buildingId?.type },
        // Only include bookingId items if it's not a hall transaction
        ...(!isHallTransaction ? [] : [
            { label: t('booking_date'), value: formatDate(transaction.bookingId?.date) },
            { label: t('start_date'), value: transaction.bookingId?.startTime },
            { label: t('end_date'), value: transaction.bookingId?.endTime },
            { label: t('booking_rate'), value: transaction.bookingId?.rate },
        ]),
        { label: t('amount'), value: transaction.amount },
        { label: t('date'), value: formatDate(transaction.date) },
        { label: t('type'), value: transaction.type },
        { label: t('transaction_from'), value: transaction.transactionFrom },
        { label: t('description'), value: transaction.description },
    ];

    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Modal open={open} onClose={onClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    direction: isRtl ? "rtl" : "ltr"
                }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {t('transaction_details')}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {details.map((detail, index) => (
                                    <TableRow key={index}>
                                        {isRtl ? (
                                            <>
                                                <TableCell sx={{ fontSize: '1.1rem' }}>{detail.value || '-'}</TableCell>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '1.1rem' }}>
                                                    {detail.label}
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {detail.label}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '1.1rem' }}>{detail.value || '-'}</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={onClose} sx={{ mt: 2 }}>
                        {t('close')}
                    </Button>
                </Box>
            </Modal>
        </CacheProvider>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export default TransactionDetailsModal;