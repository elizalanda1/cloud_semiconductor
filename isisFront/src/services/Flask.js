// src/services/slackService.js

import axios from 'axios';
//http://127.0.0.1:5000
const BASE_URL = 'http://127.0.0.1:5000';

// Función para iniciar el movimiento hacia la posición 'Good'
export const startWalkGood = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/startwalk_good`);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar el movimiento 'Good':", error);
    throw error;
  }
};

// Función para iniciar el movimiento hacia la posición 'Defective'
export const startWalkDefective = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/startwalk_defective`);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar el movimiento 'Defective':", error);
    throw error;
  }
};

// Función para activar el paro de emergencia
export const emergencyStop = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/emergency_stop`);
    return response.data;
  } catch (error) {
    console.error('Error al activar el paro de emergencia:', error);
    throw error;
  }
};

// Función para obtener la URL del flujo de video en tiempo real
export const getVideoFeedUrl = () => {
  return `${BASE_URL}/video_feed`; // Devuelve la URL para el flujo de video
};

//servicio para mover el robot
export const moveArm = async (angles) => {
  try {
    const response = await axios.post(`${BASE_URL}/move_arm`, angles, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al mover el brazo robótico:', error);
    throw error;
  }
};