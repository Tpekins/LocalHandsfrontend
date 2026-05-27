import React, { useState } from 'react';
import { Card, Calendar, Typography, Badge, Modal, Form, Input, TimePicker, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { Title } = Typography;

interface Booking {
  type: 'success' | 'warning' | 'error';
  content: string;
  date: Dayjs;
}

const ClientBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleFinishBooking = (values: { title: string; time: Dayjs }) => {
    if (selectedDate) {
      const newBooking: Booking = {
        type: 'success',
        content: `${values.title} - ${values.time.format('h:mm A')}`,
        date: selectedDate.clone().hour(values.time.hour()).minute(values.time.minute()),
      };
      setBookings([...bookings, newBooking]);
      form.resetFields();
      setModalVisible(false);
    }
  };

  const getListData = (value: Dayjs) => {
    return bookings.filter(booking => booking.date.isSame(value, 'day'));
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Title level={2}>My Bookings</Title>
      
      <Card>
        <Calendar 
          dateCellRender={dateCellRender}
          onSelect={handleSelectDate}
        />
      </Card>

      <Modal
        title={`Book a Service for ${selectedDate?.format('MMMM D, YYYY')}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinishBooking}
          initialValues={{ time: dayjs('09:00', 'HH:mm') }}
        >
          <Form.Item
            name="title"
            label="Booking Title"
            rules={[{ required: true, message: 'Please enter a title for your booking.' }]}
          >
            <Input placeholder="e.g., Kitchen Repair" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Booking Time"
            rules={[{ required: true, message: 'Please select a time.' }]}
          >
            <TimePicker use12Hours format="h:mm A" minuteStep={15} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientBookingsPage;
