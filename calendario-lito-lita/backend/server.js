// Importar las dependencias necesarias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Para poder leer JSON en las peticiones

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado a MongoDB Atlas");
}).catch(err => {
  console.log("Error al conectar a MongoDB Atlas", err);
});

// Importar las rutas
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

// Usar las rutas en el servidor
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Definir un puerto para el servidor
const PORT = process.env.PORT || 5000;

const path = require('path');

// Servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Manejar rutas no coincidentes y servir el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
