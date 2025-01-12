// backend/models/Event.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  user: {  // La propiedad user debe ser la misma en frontend y backend
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Event', eventSchema);
