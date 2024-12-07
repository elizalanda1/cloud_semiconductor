import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic, List, Avatar, Typography, Space, Tooltip, Divider, Progress } from 'antd';
import { 
  FireOutlined, 
  ThunderboltOutlined, 
  DashboardOutlined, 
  SmileOutlined, 
  FundOutlined,
  AndroidOutlined,
  SlidersOutlined,
  ControlOutlined,
  WifiOutlined,
  SyncOutlined,
  BarChartOutlined
} from '@ant-design/icons';

import Nav from '../components/Nav';
import RobotArmControl from '../components/RobotArm';
import CameraFeed2 from '../components/Camera2/index';
import CameraFeed from '../components/Camera/index'; 
import GamepadFront from '../components/gamepad/GamepadFront';
import GamepadUpside from '../components/gamepad/GamepadUpside';

import './RobotArmControlView.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const RobotArmControlView = () => {
  // Iniciar en modo 'buttons'
  const [controlMode, setControlMode] = useState('buttons');

  const [commandHistory, setCommandHistory] = useState([
   
  ]);

  const [angles, setAngles] = useState({J1:0, J2:0, J3:0, J4:0, J5:0, J6:0});

  // Nuevo estado para latencia y gamepad
  const [latency, setLatency] = useState(120);
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);

  // Actualizar latencia cada 2 segundos con un valor entre 100 y 140ms
  useEffect(() => {
    const interval = setInterval(() => {
      const newLatency = Math.floor(Math.random()*41) + 100; // entre 100 y 140
      setLatency(newLatency);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sensorData = [
    { title: 'Temp', value: '36.5°C', icon: <FireOutlined style={{ color: 'red' }} />, description: "Temperatura actual de la base del robot." },
    { title: 'Batería', value: '85%', icon: <ThunderboltOutlined style={{ color: 'green' }} />, description: "Nivel de batería restante." },
    // La latencia ahora toma el valor del estado `latency`
    { title: 'Latencia', value: `${latency}ms`, icon: <DashboardOutlined style={{ color: 'blue' }} />, description: "Latencia promedio de la comunicación." }
  ];

  const extraData = [
    { title: 'Conexión', value: 'WiFi', icon: <WifiOutlined />, description: "Tipo de conexión activa." },
    { title: 'Señal', value: 'Fuerte', icon: <BarChartOutlined style={{ color: 'green' }} />, description: "Intensidad de la señal." },
    // Estado del gamepad: si está conectado o no
    { 
      title: 'Gamepad', 
      value: isGamepadConnected ? 'Conectado' : 'Desconectado', 
      icon: <AndroidOutlined style={{ color: isGamepadConnected ? 'green' : 'red' }} />, 
      description: "Estado de la conexión del gamepad."
    },
    { title: 'CPU Load', value: '35%', icon: <SyncOutlined spin style={{ color: '#1890ff' }} />, description: "Carga del CPU interno del robot." },
  ];

  const modeIcons = {
    sliders: <SlidersOutlined />,
    gamepad: <AndroidOutlined />,
    buttons: <ControlOutlined />
  };

  const modeLabel = {
    sliders: "Sliders",
    gamepad: "Gamepad",
    buttons: "Buttons"
  };

  const handleCommandSend = (newCommand) => {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    setCommandHistory((prev) => [...prev, { command: newCommand, timestamp }]);
  };

  const handleAnglesChange = (newAngles) => {
    setAngles(newAngles);
  };

  const L = 25;
  const baseX = 150;
  const baseY = 250; 
  const width = 300;
  const height = 300;

  const rad = (deg) => deg * Math.PI/180;

  const RobotStateVisual = ({angles}) => {
    const x1 = baseX + L * Math.cos(rad(angles.J1));
    const y1 = baseY - L * Math.sin(rad(angles.J1));
    const x2 = x1 + L * Math.cos(rad(angles.J1 + angles.J2));
    const y2 = y1 - L * Math.sin(rad(angles.J1 + angles.J2));
    const x3 = x2 + L * Math.cos(rad(angles.J1 + angles.J2 + angles.J3));
    const y3 = y2 - L * Math.sin(rad(angles.J1 + angles.J2 + angles.J3));
    const x4 = x3 + L * Math.cos(rad(angles.J1 + angles.J2 + angles.J3 + angles.J4));
    const y4 = y3 - L * Math.sin(rad(angles.J1 + angles.J2 + angles.J3 + angles.J4));
    const x5 = x4 + L * Math.cos(rad(angles.J1 + angles.J2 + angles.J3 + angles.J4 + angles.J5));
    const y5 = y4 - L * Math.sin(rad(angles.J1 + angles.J2 + angles.J3 + angles.J4 + angles.J5));
    const x6 = x5 + L * Math.cos(rad(angles.J1 + angles.J2 + angles.J3 + angles.J4 + angles.J5 + angles.J6));
    const y6 = y5 - L * Math.sin(rad(angles.J1 + angles.J2 + angles.J3 + angles.J4 + angles.J5 + angles.J6));

    const gradientId = 'robotGradient';

    return (
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <Title level={4} style={{ marginBottom: '8px' }}>Estado Visual del Robot (6 Joints)</Title>
        <svg width={width} height={height} style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0f2f5" />
              <stop offset="100%" stopColor="#d9d9d9" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gradientId})`} />

          <line x1={baseX} y1={baseY} x2={x1} y2={y1} stroke="#555" strokeWidth="5" strokeLinecap="round" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1890ff" strokeWidth="4" strokeLinecap="round" />
          <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="#1890ff" strokeWidth="4" strokeLinecap="round" />
          <line x1={x3} y1={y3} x2={x4} y2={y4} stroke="#1890ff" strokeWidth="4" strokeLinecap="round" />
          <line x1={x4} y1={y4} x2={x5} y2={y5} stroke="#1890ff" strokeWidth="4" strokeLinecap="round" />
          <line x1={x5} y1={y5} x2={x6} y2={y6} stroke="#1890ff" strokeWidth="4" strokeLinecap="round" />

          <text x={x1+2} y={y1+5} fontSize="12" fill="#333">J1</text>
          <text x={x2+2} y={y2+5} fontSize="12" fill="#333">J2</text>
          <text x={x3+2} y={y3+5} fontSize="12" fill="#333">J3</text>
          <text x={x4+2} y={y4+5} fontSize="12" fill="#333">J4</text>
          <text x={x5+2} y={y5+5} fontSize="12" fill="#333">J5</text>
          <text x={x6+2} y={y6+5} fontSize="12" fill="#333">J6</text>
        </svg>
      </div>
    );
  };

  const angleToPercent = (angle) => ((angle + 180) / 360) * 100;
  const angleEmoji = (angle) => {
    if (angle > 0) return "↗️";
    if (angle < 0) return "↙️";
    return "➡️";
  };

  const JointAnglesCard = () => (
    <Card title="Estado de las Articulaciones" style={{ overflow: 'auto', maxHeight: '500px', marginBottom: '8px' }}>
      <List
        itemLayout="horizontal"
        dataSource={[1,2,3,4,5,6]}
        renderItem={joint => {
          const a = angles[`J${joint}`];
          return (
            <List.Item>
              <List.Item.Meta
                title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>J{joint} {angleEmoji(a)}</span>}
                description={(
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: '12px' }}>Ángulo: {a}°</Text>
                    <Progress
                      percent={angleToPercent(a)}
                      showInfo={false}
                      strokeColor="#1890ff"
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );

  const limitedCommands = commandHistory.slice(-7);

  // Nueva función para actualizar estado del gamepad desde RobotArmControl
  const handleGamepadStatusChange = (connected) => {
    setIsGamepadConnected(connected);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <Nav />
      </Header>

      <Content style={{ height: 'calc(100vh - 64px)', padding: '8px' }}>
        <Row gutter={[8, 8]} style={{ height: '100%' }}>
          {/* Columna Izquierda: Cámaras */}
          <Col xs={24} md={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <Card title="Vista Lateral: Cámara 1" style={{ overflow: 'auto', marginBottom: '8px', maxHeight: '700px' }}>
              <CameraFeed2 style={{ width: '100%' }} />
            </Card>
            <Card title="Vista Superior: Cámara 2" style={{ overflow: 'auto', maxHeight: '700px' }}>
              <CameraFeed style={{ width: '100%' }} />
            </Card>
          </Col>

          {/* Columna Central: Motion Control */}
          <Col xs={24} md={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <Card 
              title="Motion Control"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: '1190px' }}
              extra={<span>Modo: {modeIcons[controlMode]} {modeLabel[controlMode]}</span>}
            >
              <div style={{ marginBottom: '8px' }}>
                <RobotArmControl 
                  setControlMode={setControlMode} 
                  controlMode={controlMode}
                  onCommandSend={handleCommandSend}
                  onAnglesChange={handleAnglesChange} 
                  onGamepadStatusChange={handleGamepadStatusChange} // nueva prop
                  className="custom-sliders"
                />
              </div>
              <Divider>Referencias de Control</Divider>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {controlMode === 'gamepad' && (
                  <div style={{ marginTop: '8px', width: '100%', maxWidth: '150px', textAlign:'center' }}>
                    <Title level={5}>Controles Gamepad</Title>
                    <GamepadFront style={{ width: '100%', marginBottom: '8px' }} />
                    <GamepadUpside style={{ width: '100%' }} />
                  </div>
                )}

                <RobotStateVisual angles={angles} />
              </div>
            </Card>
          </Col>

          {/* Columna Derecha: Sensores & Status + Historial + Joints */}
          <Col xs={24} md={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <Card title="Sensors & Status" style={{ overflow: 'auto', maxHeight: '410px', marginBottom: '8px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={16}>
                  {sensorData.map((data) => (
                    <Col key={data.title} span={8} style={{ textAlign: 'center' }}>
                      <Tooltip title={data.description}>
                        <Statistic title={data.title} value={data.value} prefix={data.icon} />
                      </Tooltip>
                    </Col>
                  ))}
                </Row>

                <Divider dashed style={{ margin: '8px 0' }} />

                <Row gutter={16}>
                  {extraData.map((data) => (
                    <Col key={data.title} span={8} style={{ textAlign: 'center' }}>
                      <Tooltip title={data.description}>
                        <Statistic title={data.title} value={data.value} prefix={data.icon} />
                      </Tooltip>
                    </Col>
                  ))}
                </Row>

                <div style={{ marginTop: '8px' }}>
                  <Title level={5} style={{ marginBottom: 0 }}>
                    Estado del Sistema <SmileOutlined />
                  </Title>
                  <p style={{ marginTop: '4px', fontSize: '12px' }}>
                    Todos los parámetros dentro de rangos operativos seguros.
                  </p>
                </div>
              </Space>
            </Card>

            <Card title="Historial de Comandos" style={{ overflow: 'auto', maxHeight: '300px', marginBottom: '8px' }}>
              {/* Mostrar solo los últimos 7 comandos */}
              <List
                itemLayout="horizontal"
                dataSource={limitedCommands}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<FundOutlined />} style={{ backgroundColor: '#1890ff' }}/>}
                      title={<span style={{ fontSize: '14px' }}>{item.command}</span>}
                      description={<span style={{ fontSize: '12px' }}>{item.timestamp}</span>}
                    />
                  </List.Item>
                )}
              />
              </Card>

            <JointAnglesCard />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RobotArmControlView;


