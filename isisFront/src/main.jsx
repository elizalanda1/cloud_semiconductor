import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';

// Encuentra el contenedor donde montar la aplicación
const container = document.getElementById('root');

// Usa createRoot para montar el componente App
const root = createRoot(container);

root.render(
  <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}> {/* Cambia el color primario */}
    <App />
  </ConfigProvider>
);
