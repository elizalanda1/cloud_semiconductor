// src/services/slackService.js

import axios from 'axios';

const BASE_URL = 'http://14.10.2.192:8067'; // Cambiado para usar el proxy en Vercel https://isis-back.vercel.app/proxy



export const startWalkGood = async () => {
  try {
    await axios.post(`${BASE_URL}/startwalk_good`, {}, { timeout: 30000 }); // 30 segundos
    console.log("Movimiento 'Good' enviado exitosamente.");
  } catch (error) {
    //throw new Error("No se pudo iniciar el movimiento 'Good': " + error.message);
  }
};

export const startWalkDefective = async () => {
  try {
    await axios.post(`${BASE_URL}/startwalk_defective`, {}, { timeout: 30000 }); // 30 segundos
    console.log("Movimiento 'Defective' enviado exitosamente.");
  } catch (error) {
    //throw new Error("No se pudo iniciar el movimiento 'Defective': " + error.message);
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
  return `${BASE_URL}/video_feed`; // Devuelve la URL para el flujo de video a través del proxy
};

export const getVideoFeedUrl2 = () => {
  return `${BASE_URL}/video_feed2`; 
};


// Servicio para mover el brazo robótico
export const moveArm = async (angles, pump = 0, runWalkingPad = false) => {
  try {
    // Agregar parámetros adicionales al cuerpo de la solicitud
    const payload = {
      ...angles,
      pump,           // Control del pump: 1 para activar, 0 para desactivar
      run_walkingpad: runWalkingPad, // true para ejecutar la caminadora, false para ignorarla
    };

    const response = await axios.post(`${BASE_URL}/move_arm`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al mover el brazo robótico:', error);
    throw error;
  }
};


// Servicio para iniciar la clasificación continua
export const startContinuousClassification = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/start_continuous_classification`, {}, {
      timeout: 30000, // Tiempo de espera de 30 segundos
    });
    console.log("Clasificación continua iniciada exitosamente.");
    return response.data;
  } catch (error) {
    console.error("Error al iniciar la clasificación continua:", error);
    throw error;
  }
};

// Servicio para detener la clasificación continua
export const stopContinuousClassification = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/stop_continuous_classification`, {}, {
      timeout: 30000, // Tiempo de espera de 30 segundos
    });
    console.log("Clasificación continua detenida exitosamente.");
    return response.data;
  } catch (error) {
    console.error("Error al detener la clasificación continua:", error);
    throw error;
  }
};

// Servicio para mover el brazo robótico con el endpoint /move_arm2
export const moveArm2 = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/move_arm2`, {}, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000, // Tiempo de espera de 30 segundos
    });
    console.log("Movimiento con /move_arm2 iniciado exitosamente.");
    return response.data;
  } catch (error) {
    console.error('Error al iniciar el movimiento con /move_arm2:', error);
    throw error;
  }
};

// Servicio para detener el movimiento del brazo robótico en el endpoint /stop_move_arm2
export const stopMoveArm2 = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/stop_move_arm2`, {}, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000, // Tiempo de espera de 30 segundos
    });
    console.log("Movimiento con /move_arm2 detenido exitosamente.");
    return response.data;
  } catch (error) {
    console.error('Error al detener el movimiento con /stop_move_arm2:', error);
    throw error;
  }
};
