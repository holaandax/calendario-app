// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.post('/', async (req, res) => {
  const { title, start, end, user } = req.body;

  try {
    const newEvent = new Event({
      title,
      start,
      end,
      user
    });

    await newEvent.save();
    res.json({ msg: 'Evento creado exitosamente', event: newEvent });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear evento', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener eventos' });
  }
});



module.exports = router;
