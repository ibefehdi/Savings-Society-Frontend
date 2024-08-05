import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axiosInstance from '../../constants/axiosInstance';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, CardActions, CardContent, TextField, Tooltip, Typography } from '@mui/material';
import AddNewBooking from './AddNewBooking';
import BackButton from '../../components/BackButton';

const BookingTimeline = () => {
    const [booking, setBooking] = useState(null);
    const { id } = useParams();
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openModal, setOpenModal] = useState(false);

    const fetchBooking = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await axiosInstance.get(`/bookingbydate?hallId=${id}&date=${formattedDate}`);
            const bookingData = response.data.data;
            if (bookingData) {
                setBooking({
                    group: bookingData.group,
                    // startTime: new Date(`${formattedDate}T${bookingData.startTime}`).toLocaleTimeString([], {
                    //     hour: 'numeric',
                    //     minute: 'numeric',
                    //     hour12: false,
                    // }),
                    // endTime: new Date(`${formattedDate}T${bookingData.endTime}`).toLocaleTimeString([], {
                    //     hour: 'numeric',
                    //     minute: 'numeric',
                    //     hour12: false,
                    // }),
                    name: bookingData.customer.name,
                    mobileNo: bookingData.customer.contactNumber,
                    civilId: bookingData.customer.civilId,
                    phoneNumber: bookingData.customer.contactNumber,
                    rent: bookingData.rate,
                    bookingId: bookingData._id,
                });
            } else {
                setBooking(null);
            }

        } catch (error) {
            console.error('Error fetching booking:', error);
            setBooking(null);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [id, selectedDate]);
    useEffect(() => { console.log(booking) }, [booking])
    const handleAddClick = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        setSelectedDate(newDate);
    };

    const handleDeleteBooking = async () => {
        try {
            await axiosInstance.post('/cancelbooking', { bookingId: booking.bookingId });
            handleCloseModal();
            fetchBooking();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    return (
        <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <TextField
                    type='date'
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    sx={{ marginRight: '1rem' }}
                />
                <Button onClick={handleAddClick} variant='contained'>
                    {t('add')}
                </Button>
                <BackButton />
            </Box>
            {booking ? (
                <Card sx={{ marginTop: '1rem' }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {booking.group}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {/* {`${booking.startTime} - ${booking.endTime}`} */}
                        </Typography>
                        <Typography variant="body2">
                            {`Name: ${booking.name}`}<br />
                            {`Mobile Number: ${booking.mobileNo}`}<br />
                            {`Civil ID: ${booking.civilId}`}<br />
                            {`Mobile: ${booking.phoneNumber}`}<br />
                            {`Rent: ${booking.rent}`}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => setOpenModal(true)}>Edit</Button>
                        <Button size="small" onClick={handleDeleteBooking}>Delete</Button>
                    </CardActions>
                </Card>
            ) : (
                <Typography variant="body1" sx={{ marginTop: '1rem' }}>
                    No booking for this date.
                </Typography>
            )}
            <AddNewBooking
                editMode={booking !== null}
                setOpen={handleCloseModal}
                fetchData={fetchBooking}
                open={openModal}
                hallId={id}
                booking={booking}
                onDelete={handleDeleteBooking}
            />
        </Box>
    );
};
export default BookingTimeline;