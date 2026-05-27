import React from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';

interface FabshiPaymentModalProps {
  open: boolean;
  amount: number;
  contractTitle: string;
  receiverNumber?: string;
  onCancel: () => void;
  onPay: (paymentInfo: any) => Promise<void>;
  loading: boolean;
  error?: string;
  success?: boolean;
}

const FabshiPaymentModal: React.FC<FabshiPaymentModalProps> = ({
  open,
  amount,
  contractTitle,
  receiverNumber,
  onCancel,
  onPay,
  loading,
  error,
  success,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onPay(values);
    } catch (e) {
      // Validation error
    }
  };

  return (
    <Modal
      open={open}
      title={`Pay for Contract: ${contractTitle}`}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Pay Now"
      cancelText="Cancel"
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <strong>Amount:</strong> <span style={{ color: '#0a0' }}>{amount.toLocaleString(undefined, { style: 'currency', currency: 'XAF' })}</span>
      </div>
      {receiverNumber && (
        <div style={{ marginBottom: 12 }}>
          <strong>Receiver Number:</strong> <span style={{ letterSpacing: 1 }}>{receiverNumber}</span>
        </div>
      )}
      <Form form={form} layout="vertical">
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          initialValue="+237"
          rules={[{ required: true, message: 'Phone number is required' }, { pattern: /^\+237\d{8}$/, message: 'Enter a valid Cameroonian phone number (+237XXXXXXXX)' }]}
        >
          <Input placeholder="+237XXXXXXXX" maxLength={13} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={loading} onClick={handleOk} block>
            Pay Now via Mobile Money
          </Button>
        </Form.Item>
      </Form>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message="Payment successful!" style={{ marginBottom: 16 }} />}
    </Modal>
  );
};

export default FabshiPaymentModal;
