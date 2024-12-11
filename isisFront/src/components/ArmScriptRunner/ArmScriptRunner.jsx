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

  // Predefined script examples
  const examples = {
    "Neutral Position": `
# Move to neutral position
try:
    mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
    time.sleep(1)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Activate Grip": `
# Activate the grip
try:
    mirobot.pump(1)
    time.sleep(2)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Move Arm to Specific Position": `
# Move the arm to a specific position
try:
    mirobot.writeangle(0, 45, 30, 15, 0, -30, 0)
    time.sleep(2)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Deactivate Grip and Return to Neutral": `
# Deactivate the grip and return to neutral
try:
    mirobot.pump(0)
    time.sleep(1)
    mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
    time.sleep(1)
except Exception as e:
    print(f"Error: {e}")
    `,
    "Execute Full Sequence": `
# Full sequence of movement and grip
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
      message.error("Please enter a Python script.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://14.10.2.192:8067/execute_arm_script', { script });
      if (response.data.status === 'success') {
        message.success("Script executed successfully.");
        console.log("Output:", response.data.output);
      } else {
        message.error("Error executing the script.");
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      message.error("Error communicating with the server.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (value) => {
    setScript(examples[value]);
  };

  return (
    <Card title="Execute Robot Arm Script" style={{ marginTop: '2rem' }}>
      <Title level={4}>Execute Robot Arm Script</Title>
      <Select
        placeholder="Select an example"
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
        placeholder="Write your Python script here..."
        style={{ marginBottom: '1rem' }}
      />
      <Button
        type="primary"
        icon={<PlayCircleOutlined />}
        onClick={handleExecuteScript}
        loading={loading}
        block
      >
        Execute Script
      </Button>
    </Card>
  );
};

export default ArmScriptRunner;
