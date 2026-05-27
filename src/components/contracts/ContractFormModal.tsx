import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Button } from 'antd';
import { Contract } from '../../types';

interface ContractFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (contract: Partial<Contract>) => void;
  initialValues?: Partial<Contract>;
  isEdit?: boolean;
}

const ContractFormModal: React.FC<ContractFormModalProps> = ({ open, onCancel, onSubmit, initialValues, isEdit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit Contract' : 'Add Contract'}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
        <Form.Item name="title" label="Service Title" rules={[{ required: true, message: 'Please enter the service title' }]}> <Input /> </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price' }]}> <InputNumber min={1} style={{ width: '100%' }} /> </Form.Item>
        <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please select a start date' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
        <Form.Item name="completionDate" label="Completion Date"> <DatePicker style={{ width: '100%' }} /> </Form.Item>
        <Form.Item name="terms" label="Terms & Conditions" rules={[{ required: true, message: 'Please enter terms' }]}> <Input.TextArea rows={3} /> </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">{isEdit ? 'Save' : 'Add'}</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ContractFormModal;
