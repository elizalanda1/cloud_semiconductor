import React, { useState } from 'react';
import { Button, Form, Input, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './FormLogin.css';

const FormLogin = () => {
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { username, password } = values;
    if (username === 'admin' && password === '12345') {
      navigate('/dashboard');
    } else {
      setLoginError(true);
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
          rules={[{ required: true, message: 'Por favor ingresa tu nombre de usuario!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nombre de usuario" />
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
