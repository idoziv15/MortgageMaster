import React from 'react';
import axios from 'axios';

export const isAuthenticated = async () => {
    console.log('token:', sessionStorage.getItem('token'));
    // Check if token is in sessionStorage
    let token = sessionStorage.getItem('token');

    // If token is not found in sessionStorage, check localStorage
    if (!token) {
        token = localStorage.getItem('token');
    }
    console.log('token2:', token);
    // Check token existence
    if (!token) {
        return false;
    }

    // Check if token expired
    const decodedToken = parseToken(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        // Token expired, clear it from storage
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        return false;
    }
    console.log("Token is:", token)
    // Check token validity
    try {
        const response = await axios.post('http://localhost:5000/verify-token', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("res:", response)
        return response.data.valid;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};

const parseToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        return {};
    }
};