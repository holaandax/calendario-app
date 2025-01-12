// src/components/Login.js

import React, { useState } from 'react';
import { login } from '../services/auth';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            console.log('Login exitoso:', data);
            onLoginSuccess(data.user);  // Redirigir o almacenar el usuario
        } catch (error) {
            setErrorMessage('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Iniciar sesión</button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;
