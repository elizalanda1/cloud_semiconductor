import React, { useState } from 'react';
import { Button, Form, Input, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './FormLogin.css';
import { login } from '../../services/auth.js';

const FormLogin = () => {
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  // Estado de carga
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true); // Activa el estado de carga
  
    try {
      // Llama a la función loginF con los valores del formulario
      const response = await login(values.username, values.password);
  
      // Guarda el token en localStorage si el inicio de sesión es exitoso (para implementar en el futuro)
      // localStorage.setItem('token', response.data.token);
      console.log('Inicio de sesión exitoso');
      
      // Redirige al dashboard o a la ruta deseada después del login
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setLoginError(true); // Muestra mensaje de error
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };
  
  

  const onFinishFailed = () => {
    setLoginError(true);
  };

  return (
    <Card title="Iniciar Sesión" className="login-card">
      <h2>Bienvenido</h2>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa tu Usuario!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Ususario" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
        </Form.Item>

        {loginError && <p style={{ color: 'red' }}>Credenciales incorrectas. Inténtalo de nuevo.</p>}

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Iniciar Sesión
          </Button>
        </Form.Item>

        <Form.Item>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </Form.Item>

        <Form.Item>
        <Button type="link" onClick={() => navigate('/registro')}>
          Crear cuenta
        </Button>
        </Form.Item>

      </Form>
    </Card>
  );
};

export default FormLogin;
