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

  const [paymentOption, setPaymentOption] = React.useState<'mobile_money' | 'card'>('mobile_money');

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onPay({ ...values, paymentOption });
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
        <Form.Item name="paymentOption" label="Payment Option" initialValue="mobile_money" rules={[{ required: true, message: 'Select a payment option' }]}
          >
          <Input.Group compact>
            <select
              value={paymentOption}
              onChange={e => setPaymentOption(e.target.value as 'mobile_money' | 'card')}
              style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #d9d9d9' }}
            >
              <option value="mobile_money">Mobile Money</option>
              <option value="card">Card Payment</option>
            </select>
          </Input.Group>
        </Form.Item>
        {paymentOption === 'card' && (
          <>
            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[{ required: true, message: 'Card number is required' }]}
            >
              <Input placeholder="1234 5678 9012 3456" maxLength={19} />
            </Form.Item>
            <Form.Item
              name="expiry"
              label="Expiry Date"
              rules={[{ required: true, message: 'Expiry date is required' }]}
            >
              <Input placeholder="MM/YY" maxLength={5} />
            </Form.Item>
            <Form.Item
              name="cvv"
              label="CVV"
              rules={[{ required: true, message: 'CVV is required' }]}
            >
              <Input placeholder="123" maxLength={4} />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button type="primary" loading={loading} onClick={handleOk} block>
            Pay Now
          </Button>
        </Form.Item>
      </Form>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message="Payment successful!" style={{ marginBottom: 16 }} />}
    </Modal>
  );
};

export default FabshiPaymentModal;
