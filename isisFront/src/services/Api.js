import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; // Asegúrate de que esta URL corresponda a tu backend

// Función para obtener los datos del inventario
export const fetchInventoryData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/inventory`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos de inventario:', error);
    throw error;
  }
};

// Función para obtener los datos de reportes
export const fetchReportData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/report`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos de reportes:', error);
    throw error;
  }
};

// Actualizar el reporte
export const updateReportData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/report/update`);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos del reporte:', error);
    throw error;
  }
};

// Función para obtener el resultado de inspección más reciente
export const fetchInspectionResult = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/circuits`);
      const circuits = response.data;
  
      if (circuits.length === 0) {
        throw new Error('No hay circuitos disponibles.');
      }
  
      // Ordenar los circuitos por `inspectionDate` en orden descendente y tomar el primero
      const latestCircuit = circuits.sort((a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate))[0];
  
      return latestCircuit.inspectionResult; // Devolvemos el resultado de la inspección más reciente
    } catch (error) {
      console.error('Error al obtener el resultado de la última inspección:', error);
      throw error;
    }
  };

  
  
  // Nueva función para obtener el flujo de la cámara en formato MJPEG
export const fetchCameraStream = async () => {
  try {
    // Nota: Para MJPEG, generalmente no necesitas usar axios, puedes usar una URL directamente
    // Aquí se muestra cómo obtener la URL usando axios por consistencia
    const response = await axios.get(`${BASE_URL}/camera/video`, {
      responseType: 'blob', // Importante para recibir datos binarios
    });
    return URL.createObjectURL(response.data); // Crear una URL temporal para el blob
    //console.log('flujo de la camara envaido',)
  } catch (error) {
    console.error('Error al obtener el flujo de la cámara:', error);
    throw error;
  }
};