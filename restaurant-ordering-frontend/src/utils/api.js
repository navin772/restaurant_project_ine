// src/utils/api.js (example file name)
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',  // Replace with your backend URL
    timeout: 10000,  // Adjust as needed
});

export default instance;
