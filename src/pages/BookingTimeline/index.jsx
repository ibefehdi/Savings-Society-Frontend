import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axiosInstance from '../../constants/axiosInstance';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField } from '@mui/material';
import AddNewBooking from './AddNewBooking';

const BookingTimeline = () => {
    const [bookings, setBookings] = useState([]);
    const { id } = useParams();
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openModal, setOpenModal] = useState(false);

    const fetchBookings = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await axiosInstance.get(`/bookingsbydate?hallId=${id}&date=${formattedDate}`);
            const bookingsData = response.data.data;
            const formattedBookings = bookingsData.map((booking) => {
                const startTime24 = booking.startTime;
                const endTime24 = booking.endTime;
                const startTime12 = new Date(`${formattedDate}T${startTime24}`).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });
                const endTime12 = new Date(`${formattedDate}T${endTime24}`).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });
                return {
                    title: `${booking.group}: ${startTime12} (${startTime24}) - ${endTime12} (${endTime24})`,
                    start: new Date(`${formattedDate}T${startTime24}`),
                    end: new Date(`${formattedDate}T${endTime24}`),
                };
            });
            setBookings(formattedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [id, selectedDate]);

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

    return (
        <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <TextField type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} sx={{ marginRight: '1rem' }} />
                <Button onClick={handleAddClick} variant="contained">{t('add')}</Button>
            </Box>
            <FullCalendar
                key={selectedDate.toISOString()}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridDay"
                events={bookings}
                validRange={{ start: selectedDate, end: selectedDate }}
                headerToolbar={{
                    left: '',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                allDaySlot={false}
            />
            <AddNewBooking editMode={false} setOpen={handleCloseModal} fetchData={fetchBookings} open={openModal} hallId={id} />
        </Box>
    );
};

export default BookingTimeline;