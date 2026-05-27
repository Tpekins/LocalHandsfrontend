import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

// Helper function to convert file to Base64
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ProviderSettingsPage: React.FC = () => {
  const { currentUser, updateUser, changePassword } = useAuth();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue(currentUser);
      if (currentUser.portfolioImages) {
        setFileList(
          currentUser.portfolioImages.map((url, index) => ({
            uid: `-${index + 1}`,
            name: `image-${index + 1}.png`,
            status: 'done',
            url: url,
          }))
        );
      }
    }
  }, [currentUser, form]);

  const onFinish = async (values: any) => {
    const { currentPassword, newPassword, confirmNewPassword, portfolio, ...profileData } = values;

    try {
      const newPortfolioImages = await Promise.all(
        fileList
          .filter((file) => file.originFileObj)
          .map((file) => getBase64(file.originFileObj as File))
      );

      const existingPortfolioImages = fileList
        .filter((file) => !file.originFileObj && file.url)
        .map((file) => file.url);

      const allPortfolioImages = [...(existingPortfolioImages as string[]), ...newPortfolioImages];

      // Only send allowed user fields to updateUser
      const allowedFields = ['name', 'email', 'phone', 'location'];
      const filteredData: any = {};
      for (const key of allowedFields) {
        if (profileData[key] !== undefined) filteredData[key] = profileData[key];
      }
      // Do NOT send portfolioImages if not supported by backend user PATCH
      updateUser(filteredData);
      message.success('Profile information saved!');

      if (currentPassword && newPassword) {
        const success = await changePassword(currentPassword, newPassword);
        if (success) {
          message.success('Password changed successfully!');
          form.resetFields(['currentPassword', 'newPassword', 'confirmNewPassword']);
        } else {
          message.error('Failed to change password. Please check your current password.');
        }
      }
    } catch (error) {
      message.error('An error occurred while updating your profile.');
      console.error('Update failed:', error);
    }
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div className="p-4">
      <Title level={2} className="mb-6">Account & Profile Settings</Title>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{
          ...currentUser,
          profileHeadline: 'Experienced Web Developer & Designer',
          profileBio: 'Specializing in React, Node.js, and creating beautiful user experiences.',
        }}>
        <Card title="Personal Information" className="mb-6 shadow-sm">
          <Form.Item name="name" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email Address">
            <Input />
          </Form.Item>
        </Card>

        <Card title="Public Profile" className="mb-6 shadow-sm">
          <Form.Item name="profileHeadline" label="Profile Headline">
            <Input placeholder="e.g., Expert Plumber, Creative Graphic Designer" />
          </Form.Item>
          <Form.Item name="profileBio" label="Profile Bio / Summary">
            <TextArea rows={5} placeholder="Tell clients about your skills, experience, and what makes you stand out." />
          </Form.Item>
          <Form.Item name="location" label="Service Area">
            <Input placeholder="e.g., San Francisco Bay Area" />
          </Form.Item>
          <Form.Item name="portfolio" label="Portfolio Images">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>
        </Card>

        <Card title="Change Password" className="mb-6 shadow-sm">
          <Form.Item name="currentPassword" label="Current Password">
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ min: 8, message: 'Password must be at least 8 characters.' }]}
            hasFeedback
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item
            name="confirmNewPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue('newPassword') || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProviderSettingsPage;
