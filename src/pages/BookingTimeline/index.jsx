import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axiosInstance from '../../constants/axiosInstance';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import AddNewBooking from './AddNewBooking';
import BackButton from '../../components/BackButton';

const BookingTimeline = () => {
    const [bookings, setBookings] = useState([]);
    const { id } = useParams();
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openModal, setOpenModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await axiosInstance.get(`/bookingsbydate?hallId=${id}&date=${formattedDate}`);
            const bookingsData = response.data.data;
            console.log('Bookings Data: ', bookingsData);
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
                    civilId: `${booking.customerCivilId}`,
                    phoneNumber: `${booking.mobile}`,
                    rent: `${booking.rent}`,
                    bookingId: `${booking.id}`,
                    start: new Date(`${formattedDate}T${startTime24}`),
                    end: new Date(`${formattedDate}T${endTime24}`),
                    extendedProps: {
                        group: booking.group,
                        civilId: booking.customerCivilId,
                        phoneNumber: booking.mobile,
                        rent: booking.rent,
                        startTime: startTime12,
                        endTime: endTime12,
                        bookingId: booking._id,
                    },
                };
            });
            console.log('Formatted Bookings: ', formattedBookings);
            setBookings(formattedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [id, selectedDate]);

    const handleAddClick = () => {
        setSelectedBooking(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        setSelectedDate(newDate);
    };

    const handleEventClick = (eventInfo) => {
        const booking = eventInfo.event.extendedProps;
        setSelectedBooking(booking);
        setOpenModal(true);
    };

    const handleDeleteBooking = async () => {
        try {
            console.log(selectedBooking)
            await axiosInstance.post('/cancelbooking', { bookingId: selectedBooking.bookingId });
            handleCloseModal();
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const eventContent = (eventInfo) => {
        const { civilId, group, startTime, endTime, phoneNumber, rent } = eventInfo.event.extendedProps;

        return (
            <Tooltip sx={{
                '& .MuiTooltip-tooltip': {
                    fontSize: '20px',
                    maxWidth: 'none',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                },
            }}
                title={
                    <div style={{ fontSize: '16px', padding: '8px', lineHeight: '1.5' }}>
                        <b>{`Group: ${group}`}</b>
                        <br />
                        {`Time: ${startTime} - ${endTime}`}
                        <br />
                        {`Civil ID: ${civilId}`}
                        <br />
                        {`Mobile: ${phoneNumber}`}
                        <br />
                        {`Rent: ${rent}`}
                    </div>
                }
                arrow
            >
                <div>
                    <b>{eventInfo.timeText}</b> <br />
                    <i>{eventInfo.event.title}</i>
                </div>
            </Tooltip>
        );
    };

    return (
        <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
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
            <FullCalendar
                key={selectedDate.toISOString()}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView='timeGridDay'
                events={bookings}
                eventClick={handleEventClick}
                validRange={{ start: selectedDate, end: selectedDate }}
                headerToolbar={{
                    left: '',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                allDaySlot={false}
                eventContent={eventContent}
            />
            <AddNewBooking
                editMode={selectedBooking !== null}
                setOpen={handleCloseModal}
                fetchData={fetchBookings}
                open={openModal}
                hallId={id}
                booking={selectedBooking}
                onDelete={handleDeleteBooking}
            />
        </Box>
    );
};

export default BookingTimeline;