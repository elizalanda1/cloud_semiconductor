import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from 'antd';
import { fetchInventoryData, updateInventoryName, deleteInventoryItem } from '../../services/Api';
import './index.css';

const InventoryCrud = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // Almacena el ID del elemento en edición
  const [newName, setNewName] = useState(''); // Almacena el nuevo nombre durante la edición

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

  const handleEditClick = (id, currentName) => {
    setEditing(id);
    setNewName(currentName); // Establece el nombre actual como inicial
  };

  const handleSaveClick = async (id) => {
    try {
      await updateInventoryName(id, newName);
      setEditing(null); // Finaliza el modo de edición
      loadInventoryData(); // Recarga los datos
    } catch (error) {
      console.error('Error al actualizar el nombre:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteInventoryItem(id);
      loadInventoryData(); // Recarga los datos
    } catch (error) {
      console.error('Error al borrar el elemento del inventario:', error);
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
        Update Inventory
      </Button>
      {inventoryData.map((item) => (
        <Card key={item._id} className="inventory-card">
          <div className="card-header">
            {editing === item._id ? (
              <>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="edit-input"
                />
                <Button
                  type="primary"
                  onClick={() => handleSaveClick(item._id)}
                  className="save-button"
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <Button
                  type="link"
                  onClick={() => handleEditClick(item._id, item.name)}
                  className="edit-button"
                >
                  Edit
                </Button>
              </>
            )}
            <Button
              type="link"
              danger
              onClick={() => handleDeleteClick(item._id)}
              className="delete-button"
            >
              Drop
            </Button>
          </div>
          <p>Total Amount: {item.totalQuantity}</p>
          <p>Good: {item.goodQuantity}</p>
          <p>Defective: {item.defectiveQuantity}</p>
          <p>last Update: {new Date(item.lastUpdated).toLocaleString()}</p>
        </Card>
      ))}
    </div>
  );
};

export default InventoryCrud;
