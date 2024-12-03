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
    return <p>Loading Inventory...</p>;
  }

  return (
    <div className="inventory-container">
      <Button type="primary" onClick={loadInventoryData} className="update-button">
        Update Inventory
      </Button>
      {inventoryData.map((item) => (
        <Card key={item._id} title={`Circuito: ${item.name}`} className="inventory-card">
          <p>Total Amount: {item.totalQuantity}</p>
          <p>Good: {item.goodQuantity}</p>
          <p>Defective: {item.defectiveQuantity}</p>
          <p>Last Update: {new Date(item.lastUpdated).toLocaleString()}</p>
        </Card>
      ))}
    </div>
  );
};

export default InventoryCard;
