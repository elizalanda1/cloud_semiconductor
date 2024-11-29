import axios from 'axios';

const BASE_URL = 'http://14.10.2.192:8068/api'; // URL base de la API

export const register = async (username, password) => {
  return axios.post(
    `${BASE_URL}/user/register`,
    {
      username,
      password,
      roles: ['Admin'],
    },
    {
      withCredentials: true, // Permite el uso de credenciales
    }
  );
};

export const login = async (username, password) => {
  return axios.post(
    `${BASE_URL}/user/login`,
    {
      username,
      password,
    },
    {
      withCredentials: true, // Permite el uso de credenciales
    }
  );
};

export const updateUserData = async (userData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/update`,
      userData,
      {
        withCredentials: true, // Permite el uso de credenciales
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   'Content-Type': 'application/json',
        // },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos del usuario:', error);
    throw error;
  }
};
