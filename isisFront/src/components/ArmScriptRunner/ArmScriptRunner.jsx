// src/components/ArmScriptRunner/ArmScriptRunner.jsx

import React, { useState } from 'react';
import { Button, Input, Select, message, Typography, Card } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const ArmScriptRunner = () => {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  // Ejemplos predefinidos de scripts
  const examples = {
    "Posición Neutral": `
# Mover a posición neutral
try:
    mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
    time.sleep(1)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Activar Grip": `
# Activar el grip
try:
    mirobot.pump(1)
    time.sleep(2)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Mover Brazo a Posición Específica": `
# Mover el brazo a una posición específica
try:
    mirobot.writeangle(0, 45, 30, 15, 0, -30, 0)
    time.sleep(2)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Desactivar Grip y Regresar a Neutral": `
# Desactivar grip y regresar a neutral
try:
    mirobot.pump(0)
    time.sleep(1)
    mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
    time.sleep(1)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Ejecutar Secuencia Completa": `
# Secuencia completa de movimiento y grip
try:
    mirobot.writeangle(0, 45, 30, 15, 0, -30, 0)
    time.sleep(2)
    mirobot.pump(1)
    time.sleep(2)
    mirobot.writeangle(0, -45, -30, -15, 0, 30, 0)
    time.sleep(2)
    mirobot.pump(0)
    time.sleep(1)
    mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
    time.sleep(1)
except Exception as e:
    print(f"Error: {e}")
    `,
  };

  const handleExecuteScript = async () => {
    if (!script.trim()) {
      message.error("Por favor, ingresa un script de Python.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://14.10.2.192:8067/execute_arm_script', { script });
      if (response.data.status === 'success') {
        message.success("Script ejecutado exitosamente.");
        console.log("Output:", response.data.output);
      } else {
        message.error("Error al ejecutar el script.");
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      message.error("Error al comunicarse con el servidor.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (value) => {
    setScript(examples[value]);
  };

  return (
    <Card title="Ejecutar Script del Brazo Robótico" style={{ marginTop: '2rem' }}>
      <Title level={4}>Ejecutar Script del Brazo Robótico</Title>
      <Select
        placeholder="Selecciona un ejemplo"
        style={{ width: '100%', marginBottom: '1rem' }}
        onChange={handleSelectExample}
      >
        {Object.keys(examples).map((example) => (
          <Option key={example} value={example}>
            {example}
          </Option>
        ))}
      </Select>
      <TextArea
        rows={10}
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Escribe tu script de Python aquí..."
        style={{ marginBottom: '1rem' }}
      />
      <Button
        type="primary"
        icon={<PlayCircleOutlined />}
        onClick={handleExecuteScript}
        loading={loading}
        block
      >
        Ejecutar Script
      </Button>
    </Card>
  );
};

export default ArmScriptRunner;
