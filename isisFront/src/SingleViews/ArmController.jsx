import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic, List, Avatar, Typography, Tooltip, Progress, Input } from 'antd';
import { 
  FireOutlined, 
  ThunderboltOutlined, 
  DashboardOutlined, 
  AndroidOutlined,
  SlidersOutlined,
  ControlOutlined,
  WifiOutlined,
  SyncOutlined,
  BarChartOutlined,
  FundOutlined
} from '@ant-design/icons';

import Nav from '../components/Nav';
import RobotArmControl from '../components/RobotArm';
import CameraFeed2 from '../components/Camera2/index';
import CameraFeed from '../components/Camera/index'; 
import GamepadFront from '../components/gamepad/GamepadFront';
import GamepadUpside from '../components/gamepad/GamepadUpside';
import ArmScriptRunner from '../components/ArmScriptRunner/ArmScriptRunner';

import './RobotArmControlView.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const RobotArmControlView = () => {
  const [controlMode, setControlMode] = useState('buttons');
  const [commandHistory, setCommandHistory] = useState([]);
  const [angles, setAngles] = useState({J1:0, J2:0, J3:0, J4:0, J5:0, J6:0});
  const [latency, setLatency] = useState(120);
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const newLatency = Math.floor(Math.random()*41) + 100; 
      setLatency(newLatency);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sensorData = [
    { title: 'Temp', value: '36.5°C', icon: <FireOutlined style={{ color: 'red' }} />, description: "Current temperature at the robot's base." },
    { title: 'Battery', value: '85%', icon: <ThunderboltOutlined style={{ color: 'green' }} />, description: "Remaining battery level." },
    { title: 'Latency', value: `${latency}ms`, icon: <DashboardOutlined style={{ color: 'blue' }} />, description: "Average communication latency." }
  ];

  const extraData = [
    { title: 'Connection', value: 'WiFi', icon: <WifiOutlined />, description: "Type of active connection." },
    { title: 'Signal', value: 'Strong', icon: <BarChartOutlined style={{ color: 'green' }} />, description: "Signal strength." },
    { 
      title: 'Gamepad', 
      value: isGamepadConnected ? 'Connected' : 'Disconnected', 
      icon: <AndroidOutlined style={{ color: isGamepadConnected ? 'green' : 'red' }} />, 
      description: "Gamepad connection status."
    },
    { title: 'CPU Load', value: '35%', icon: <SyncOutlined spin style={{ color: '#1890ff' }} />, description: "Internal robot CPU load." },
  ];

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
      <div style={{ textAlign: 'center', margin:0, padding:0 }}>
        <Title level={4} style={{ marginBottom: '8px' }}>Robot Visual State (6 Joints)</Title>
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

  const filteredCommands = commandHistory.filter(item => 
    item.command.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const limitedCommands = filteredCommands.slice(-7);

  const handleGamepadStatusChange = (connected) => {
    setIsGamepadConnected(connected);
  };

  return (
    <Layout style={{ minHeight: '100vh', margin:0, padding:0 }}>
      <Header style={{ background: '#fff', padding: '0 16px', margin:0 }}>
        <Nav />
      </Header>
  
      <Content style={{ height: 'calc(100vh - 64px)', margin:0, padding:0 }}>
        {/* First row: Cameras */}
        <Row gutter={[10,0]} style={{ margin:0, padding:0 }}>
          {/* On small screens (xs): full width (24). On medium screens (md): half (12/12). */}
          <Col xs={24} md={12} style={{ margin:0, padding:0 }}>
            <Card 
              title="Lateral View: Camera 1" 
              bodyStyle={{ padding:5 }} 
              style={{ margin:0, padding:0 }}
            >
              <CameraFeed2 style={{ width: '100%' }} />
            </Card>
          </Col>
          <Col xs={24} md={12} style={{ margin:0, padding:0 }}>
            <Card 
              title="Top View: Camera 2" 
              bodyStyle={{ padding:5 }} 
              style={{ margin:0, padding:0 }}
            >
              <CameraFeed style={{ width: '100%' }} />
            </Card>
          </Col>
        </Row>
  
        {/* Second and third row: Left (Sensors + Diagram/Sliders) and Right (History) */}
        {/* On mobile (xs): full width. On desktop (md): 16/24 + 8/24 */}
        <Row gutter={[10,0]} style={{ margin:10, padding:10 }}>
          <Col xs={24} md={16} style={{ margin:0, padding:10 }}>
            {/* Sensors & Status */}
            <Card 
              title="Sensors & Status" 
              bodyStyle={{ padding:10 }} 
              style={{ margin:10, padding:10 }}
            >
              <Row gutter={[10,10]} justify="space-around" align="middle" style={{ margin:10, padding:10 }}>
                {sensorData.concat(extraData).map((data) => (
                  <Col key={data.title} xs={12} sm={6} md={3} style={{ textAlign: 'center', margin:0, padding:0 }}>
                    <Tooltip title={data.description}>
                      <Statistic title={data.title} value={data.value} prefix={data.icon} />
                    </Tooltip>
                  </Col>
                ))}
              </Row>
            </Card>
  
            {/* Robot/Gamepad Diagram and Sliders/Buttons */}
            {/* On mobile (xs) they stack, on desktop (md) side by side (12/12) */}
            <Row gutter={[10,0]} style={{ margin:10, padding:10 }}>
              <Col xs={24} md={12} style={{ margin:0, padding:0 }}>
                <Card 
                  title="Robot/Gamepad Diagram" 
                  bodyStyle={{ padding:10 }} 
                  style={{ margin:0, padding:0 }}
                >
                  {controlMode === 'gamepad' && (
                    <div style={{ textAlign: 'center', margin:0, padding:0 }}>
                      <GamepadFront style={{ width: '80%', marginBottom: '8px' }} />
                      <GamepadUpside style={{ width: '80%' }} />
                    </div>
                  )}
                  {controlMode !== 'gamepad' && <RobotStateVisual angles={angles} />}
                </Card>
              </Col>
              <Col xs={24} md={12} style={{ margin:0, padding:0 }}>
                <Card 
                  title="Sliders/Buttons" 
                  bodyStyle={{ padding:10 }} 
                  style={{ margin:0, padding:0 }}
                >
                  <RobotArmControl
                    setControlMode={setControlMode}
                    controlMode={controlMode}
                    onCommandSend={handleCommandSend}
                    onAnglesChange={handleAnglesChange}
                    onGamepadStatusChange={handleGamepadStatusChange}
                    className="custom-sliders"
                  />
                  {/* Add the ArmScriptRunner component */}
                  <ArmScriptRunner />
                </Card>
              </Col>
            </Row>
          </Col>
  
          {/* Command History */}
          {/* On mobile (xs): full width (24), stacked below. On desktop (md): 8/24 on the right */}
          <Col xs={24} md={8} style={{ margin:0, padding:0 }}>
            <Card 
              title="Command History" 
              bodyStyle={{ padding:0 }} 
              style={{ margin:0, padding:0, height:'100%' }}
            >
              <div style={{ padding:'8px' }}>
                <Search
                  placeholder="Search command"
                  onSearch={(value) => setSearchTerm(value)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginBottom: '8px' }}
                />
                <List
                  itemLayout="horizontal"
                  dataSource={limitedCommands}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<FundOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                        title={<span style={{ fontSize: '14px' }}>{item.command}</span>}
                        description={<span style={{ fontSize: '12px' }}>{item.timestamp}</span>}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RobotArmControlView;
