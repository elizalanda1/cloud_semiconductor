import React, { useState } from 'react';
import { List, Input, Button, message } from 'antd';
import { updateUserData } from '../../services/auth';
import './index.css';

const UserUpdate = ({ userData }) => {
  const [formData, setFormData] = useState(userData);
  const [editingField, setEditingField] = useState(null);

  // Función para activar la edición de un campo específico
  const handleEditClick = (field) => {
    setEditingField(field);
  };

  // Función para manejar los cambios en el campo de entrada
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Función para guardar los cambios
  const handleSaveClick = async () => {
    try {
      await updateUserData(formData);
      message.success('Información actualizada correctamente');
      setEditingField(null); // Desactiva el modo de edición
    } catch (error) {
      message.error('Error al actualizar la información');
    }
  };

  // Función para cancelar la edición
  const handleCancelClick = () => {
    setFormData(userData); // Restaura los datos originales
    setEditingField(null);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={[
        { field: 'name', label: 'Nombre', value: formData.name },
        { field: 'email', label: 'Correo', value: formData.email },
        { field: 'phone', label: 'Teléfono', value: formData.phone },
      ]}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.label}
            description={
              editingField === item.field ? (
                <div>
                  <Input
                    value={formData[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                  />
                  <div className="button-group">
                    <Button type="primary" onClick={handleSaveClick}>
                      Guardar
                    </Button>
                    <Button onClick={handleCancelClick}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div>
                  {item.value}
                  <Button type="link" onClick={() => handleEditClick(item.field)}>
                    Editar
                  </Button>
                </div>
              )
            }
          />
        </List.Item>
      )}
    />
  );
};

export default UserUpdate;
