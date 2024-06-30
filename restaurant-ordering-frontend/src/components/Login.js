// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.css'; // Import the Login.css file for styles

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isStaff, setIsStaff] = useState(false);
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let url = '/api/token/';
            if (isStaff) {
                url = '/api/staff-login/';
            }
            const response = await axios.post(url, { username, password });
            localStorage.setItem('token', response.data.access);
            if (isStaff) {
                history.push('/staff'); // Redirect to staff page if staff login checkbox is checked
            } else {
                history.push('/menu'); // Redirect to menu page for regular users
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>
                            Staff Login:
                            <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} />
                        </label>
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
