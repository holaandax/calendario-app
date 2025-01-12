// src/services/auth.js

import axios from 'axios';

// Función para hacer login
export const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        return response.data;
    } catch (error) {
        console.error('Error al hacer login:', error);
        throw error;
    }
};
