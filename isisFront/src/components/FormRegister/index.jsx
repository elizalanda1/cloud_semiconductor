import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { register } from '../../services/auth';

const FormRegister = () => {
  const [registerError, setRegisterError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Se crea el formulario para obtener valores
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values.email, values.password);
      console.log('Registro exitoso');
      navigate('/');
    } catch (error) {
      console.error('Error al registrar:', error);
      setRegisterError(true);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value || value === form.getFieldValue('password')) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Las contraseñas no coinciden!'));
  };

  return (
    <Card title="Registrarse" className="register-card">
      <Form form={form} name="register" onFinish={onFinish}> {/* Se añade el form={form} */}
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Por favor ingresa tu correo!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Por favor confirma tu contraseña!' },
            { validator: validatePassword }
          ]}
        >
          <Input.Password placeholder="Confirmar Contraseña" />
        </Form.Item>

        {registerError && <p style={{ color: 'red' }}>Error al registrar. Inténtalo de nuevo.</p>}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="register-button">
            Registrarse
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={() => navigate('/')}>
            ¿Ya tienes una cuenta? Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormRegister;
