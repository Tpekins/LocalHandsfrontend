import React from 'react';
import { Card, Form, Input, Button, Typography, Switch, Divider, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  const { currentUser: user, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    updateUser(values);
    message.success('Profile updated successfully!');
  };

  return (
    <div className="p-4">
      <Title level={2} className="mb-6">Settings</Title>
      
      <Card title="Profile Settings" className="mb-6 shadow-sm">
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={user || {}}>
          <Form.Item name="name" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Preferences" className="shadow-sm">
        <div className="flex justify-between items-center">
          <span>Dark Mode</span>
          <Switch checked={isDarkMode} onChange={toggleTheme} />
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <span>Email Notifications</span>
          <Switch defaultChecked />
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <span>SMS Notifications</span>
          <Switch />
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
