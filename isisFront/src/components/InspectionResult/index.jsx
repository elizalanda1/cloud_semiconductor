import React, { useEffect, useState } from 'react';
import { fetchInspectionResult } from '../../services/Api';
import './index.css';

const InspectionResult = () => {
  const [inspectionResult, setInspectionResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener y actualizar el resultado de la inspección
    const updateInspectionResult = async () => {
      try {
        const result = await fetchInspectionResult();
        setInspectionResult(result);
      } catch (error) {
        console.error('Error al cargar el resultado de inspección:', error);
      } finally {
        setLoading(false);
      }
    };

    // Llama a la función de actualización inmediatamente y luego cada 5 segundos
    updateInspectionResult();
    const intervalId = setInterval(updateInspectionResult, 2000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <p>Cargando resultado de inspección...</p>;
  }

  const resultText = inspectionResult === 'Good' ? 'Good' : 'Defective';
  const resultClass = inspectionResult === 'Good' ? 'result-good' : 'result-defective';

  return (
    <div className={`inspection-result ${resultClass}`}>
      {resultText}
    </div>
  );
};

export default InspectionResult;
