import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic, List, Avatar, Typography, Tooltip, Input, Divider } from 'antd';
import { 
  FireOutlined, 
  ThunderboltOutlined, 
  DashboardOutlined, 
  AndroidOutlined,
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
import jointsImage from './joints.png'; // Correct Import
import './RobotArmControlView.css';

const { Header, Content } = Layout;
const { Title } = Typography;
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

  const filteredCommands = commandHistory.filter(item => 
    item.command.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const limitedCommands = filteredCommands.slice(-7);

  const handleGamepadStatusChange = (connected) => {
    setIsGamepadConnected(connected);
  };

  return (
    <Layout className="layout">
      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <Nav />
      </Header>
  
      <Content style={{ height: 'calc(100vh - 64px)', padding: '10px', overflow: 'auto' }}>
        {/* First Row: Cameras */}
        <Row gutter={[10, 10]}>
          <Col xs={24} md={12}>
            <Card 
              title="Lateral View: Camera 1" 
              bodyStyle={{ padding: 5 }} 
              style={{ margin: 0 }}
            >
              <CameraFeed2 style={{ width: '100%' }} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              title="Top View: Camera 2" 
              bodyStyle={{ padding: 5 }} 
              style={{ margin: 0 }}
            >
              <CameraFeed style={{ width: '100%' }} />
            </Card>
          </Col>
        </Row>

        {/* Second Row: Sensors & Status and Robot/Gamepad Diagram + Sliders/Buttons */}
        <Row gutter={[10, 10]} style={{ marginTop: 10 }}>
          <Col xs={24} md={16}>
            {/* Sensors & Status */}
            <Card 
              title="Sensors & Status" 
              bodyStyle={{ padding: 10 }} 
              style={{ marginBottom: 10 }}
            >
              <Row gutter={[10, 10]} justify="space-around" align="middle">
                {sensorData.concat(extraData).map((data) => (
                  <Col key={data.title} xs={12} sm={6} md={3} style={{ textAlign: 'center' }}>
                    <Tooltip title={data.description}>
                      <Statistic 
                        title={data.title} 
                        value={data.value} 
                        prefix={data.icon} 
                      />
                    </Tooltip>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Robot/Gamepad Diagram and Sliders/Buttons */}
            <Row gutter={[10, 10]}>
              <Col xs={24} md={12}>
                <Card 
                  title="Robot/Gamepad Diagram" 
                  bodyStyle={{ padding: 10 }} 
                  style={{ marginBottom: 10 }}
                >
                  {controlMode === 'gamepad' ? (
                    <div style={{ textAlign: 'center' }}>
                      <GamepadFront style={{ width: '80%', marginBottom: '8px' }} />
                      <GamepadUpside style={{ width: '80%' }} />
                    </div>
                  ) : (
                    <div className="joints-image-container">
                      <img
                        src={jointsImage}
                        alt="Robot Joints"
                        className="joints-image"
                      />
                    </div>
                  )}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  title="Sliders/Buttons" 
                  bodyStyle={{ padding: 10 }} 
                  style={{ marginBottom: 10 }}
                >
                  <RobotArmControl
                    setControlMode={setControlMode}
                    controlMode={controlMode}
                    onCommandSend={handleCommandSend}
                    onAnglesChange={handleAnglesChange}
                    onGamepadStatusChange={handleGamepadStatusChange}
                    className="custom-sliders"
                  />
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Right Column: Command History and Python Script Output */}
          <Col xs={24} md={8}>
            <Row gutter={[10, 10]}>
              {/* Command History */}
              <Col xs={24} md={24}>
                <Card 
                  title="Command History" 
                  bodyStyle={{ padding: '8px', height: '25vh', overflowY: 'auto' }} 
                  style={{ marginBottom: 10 }}
                >
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
                          title={<span style={{ fontSize: '14px', fontWeight: '500' }}>{item.command}</span>}
                          description={<span style={{ fontSize: '12px', color: '#555' }}>{item.timestamp}</span>}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* Python Script Output */}
              <Col xs={24} md={24}>
                <Card 
                  title="Python Script Output" 
                  bodyStyle={{ padding: '10px', height: '45vh', overflowY: 'auto' }} 
                  style={{ marginBottom: 10 }}
                >
                  <ArmScriptRunner />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RobotArmControlView;
