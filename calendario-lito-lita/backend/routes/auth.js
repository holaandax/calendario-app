// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Ruta para login de usuarios
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar al usuario en la base de datos
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        // Comparar la contraseña sin encriptar
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Si el login es exitoso, devolver el usuario
        res.json({ msg: 'Login exitoso', user });
    } catch (error) {
        console.error("Error en login:", error);  // Para ver el error en la consola
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Ruta para registrar usuarios
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Comprobar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario sin encriptar la contraseña
        const newUser = new User({
            username,
            password,  // No encriptamos la contraseña
        });

        await newUser.save();
        res.json({ msg: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        console.error(error);  // Imprimir error en consola para debugging
        res.status(500).json({ msg: 'Error al registrar el usuario' });
    }
});

module.exports = router;
