import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { fetchInventoryData } from '../../services/Api';
import './index.css';

const InventoryCard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      const data = await fetchInventoryData();
      setInventoryData(data);
    } catch (error) {
      console.error('Error al cargar datos de inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

  if (loading) {
    return <p>Cargando inventario...</p>;
  }

  return (
    <div className="inventory-container">
      <Button type="primary" onClick={loadInventoryData} className="update-button">
        Actualizar Inventario
      </Button>
      {inventoryData.map((item) => (
        <Card key={item._id} title={`Circuito: ${item.name}`} className="inventory-card">
          <p>Cantidad Total: {item.totalQuantity}</p>
          <p>Buenos: {item.goodQuantity}</p>
          <p>Defectuosos: {item.defectiveQuantity}</p>
          <p>Última Actualización: {new Date(item.lastUpdated).toLocaleString()}</p>
        </Card>
      ))}
    </div>
  );
};

export default InventoryCard;
