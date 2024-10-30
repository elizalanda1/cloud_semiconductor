import axios from 'axios';

export const register = async (username, password) => {
    return axios.post('http://localhost:3000/api/user/register', {
        username,
        password,
        roles: ['Admin'],
    });
};

export const login = async (username, password) => {
    return axios.post('http://localhost:3000/api/user/login', {
        username,
        password,
    });
};

export const updateUserData = async (userData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/user/update`,
        userData,
        {
          // Comentado para futuras versiones: Añadir el token de autorización
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