import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd';

ReactDOM.render(
  <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}> {/* Cambia el color primario */}
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);
