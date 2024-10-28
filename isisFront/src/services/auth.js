import axios from 'axios';

export const register = async (email, password) => {
    return axios.post('http://localhost:3000/api/user/register', {
        email,
        password,
        roles: ['Admin'],
    });
};

export const loginF = async (email, password) => {
    return axios.post('http://localhost:3000/api/user/login', {
        email,
        password,
    });
};