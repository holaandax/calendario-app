// src/components/Calendar.js

import React, { useState, useEffect } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

// Configuración de BigCalendar
BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

const Calendar = ({ user }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events/all');
                setEvents(response.data);
            } catch (error) {
                console.error('Error al obtener eventos', error);
            }
        };
        
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => event.user === user.username);

    return (
        <div>
            <h2>Calendario de {user.username}</h2>
            <BigCalendar
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default Calendar;
