import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en': require('date-fns/locale/en-US'),
  'es': require('date-fns/locale/es')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Estilos con styled-components
const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #333;
  background-color: #f4f4f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
`;

const Button = styled.button`
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px 0;
  &:hover {
    background-color: #005bb5;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 200px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledCalendar = styled(Calendar)`
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
`;

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      setUser(response.data.user);
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/events')
        .then((response) => {
          const validEvents = response.data.map(event => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.error('Fecha inválida en el evento', event);
              return null;
            }

            return {
              title: event.title,
              start: startDate,
              end: endDate,
              user: event.user,  // Aquí cambiamos 'username' por 'user' para que coincida
            };
          }).filter(event => event !== null);

          setEvents(validEvents);
        })
        .catch((error) => {
          console.error('Error al obtener eventos:', error);
        });
    }
  }, [user]);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const startDate = new Date(newEvent.startDate);
    const endDate = new Date(newEvent.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Fechas inválidas');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/events', {
        title: newEvent.title,
        start: startDate,
        end: endDate,
        user: user.username,  // Aquí 'user' es el objeto con la propiedad 'username'
      });
      setEvents([...events, {
        title: newEvent.title,
        start: startDate,
        end: endDate,
        user: user.username,
      }]);
      setNewEvent({ title: '', startDate: new Date(), endDate: new Date() });
    } catch (err) {
      console.error('Error al añadir el evento:', err);
    }
  };

  if (!user) {
    return (
      <Container>
        <Title>Calendario Lito & Lita</Title>
        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            name="username"
            placeholder="Usuario (Lito o Lita)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Iniciar sesión</Button>
        </Form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Container>
    );
  }

  return (
    <Container>
      <Title>Bienvenido, {user.username}</Title>
      <Button onClick={() => setUser(null)}>Cerrar sesión</Button>

      <StyledCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.user === 'Lito' ? 'blue' : 'pink',
          }
        })}
      />

      <h2>Añadir un nuevo evento</h2>
      <Form onSubmit={handleAddEvent}>
        <Input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          placeholder="Título del evento"
        />
        <Input
          type="date"
          value={format(newEvent.startDate, 'yyyy-MM-dd')}
          onChange={(e) => setNewEvent({ ...newEvent, startDate: new Date(e.target.value) })}
        />
        <Input
          type="date"
          value={format(newEvent.endDate, 'yyyy-MM-dd')}
          onChange={(e) => setNewEvent({ ...newEvent, endDate: new Date(e.target.value) })}
        />
        <Button type="submit">Añadir evento</Button>
      </Form>
    </Container>
  );
}

export default App;
