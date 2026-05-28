import React, { useState, useEffect } from 'react';
import { Card, Calendar, Typography, Badge, Modal, Form, TimePicker, Button as AntButton, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import { Booking as ApiBooking, BookingStatus, Service } from '../../types';
import api from '../../utils/api';
import { toast } from 'sonner';

const { Title } = Typography;

/*
 * ClientBookingsPage – GET /api/booking?clientId= + POST /api/booking
 *
 * Data flow:
 *   On mount → api.get("/booking", { params: { clientId: currentUser.id } })
 *     → Backend returns bookings with included service + client relations
 *   Bookings are mapped to Ant Design Calendar date cells
 *
 *   On create → api.post("/booking", { serviceId, clientId, startTime, endTime, location })
 *     → Inserts new booking into the database
 */

interface CalendarBooking {
  type: 'success' | 'warning' | 'error';
  content: string;
  date: Dayjs;
}

const ClientBookingsPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  // → GET /api/booking?clientId= + GET /api/services (for the form dropdown)
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);

        const [bookingsRes, servicesRes] = await Promise.all([
          api.get<ApiBooking[]>('/booking', { params: { clientId: currentUser.id } }),
          api.get<Service[]>('/services', { params: { status: 'available' } }),
        ]);

        setBookings(bookingsRes.data);
        setServices(servicesRes.data);
      } catch {
        toast.error('Failed to load bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  // → POST /api/booking
  const handleFinishBooking = async (values: { serviceId: number; time: Dayjs }) => {
    if (!selectedDate || !currentUser) return;

    setCreating(true);
    try {
      const startTime = selectedDate.clone().hour(values.time.hour()).minute(values.time.minute());
      const endTime = startTime.clone().add(1, 'hour');

      const { data } = await api.post<ApiBooking>('/booking', {
        serviceId: values.serviceId,
        clientId: currentUser.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      setBookings((prev) => [...prev, data]);
      form.resetFields();
      setModalVisible(false);
      toast.success('Booking created successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setCreating(false);
    }
  };

  // Map API bookings to calendar display format
  const getListData = (value: Dayjs): CalendarBooking[] => {
    return bookings
      .filter((b) => dayjs(b.startTime).isSame(value, 'day'))
      .map((b) => ({
        type: b.status === BookingStatus.COMPLETED ? 'success' : b.status === BookingStatus.CANCELED ? 'error' : 'warning',
        content: b.service?.title || 'Booking',
        date: dayjs(b.startTime),
      }));
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: s.title,
  }));

  if (isLoading) {
    return (
      <div>
        <Title level={2}>My Bookings</Title>
        <p>Loading bookings...</p>
      </div>
    );
  }

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
            name="serviceId"
            label="Select Service"
            rules={[{ required: true, message: 'Please select a service.' }]}
          >
            <Select
              placeholder="Choose a service..."
              options={serviceOptions}
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Booking Time"
            rules={[{ required: true, message: 'Please select a time.' }]}
          >
            <TimePicker use12Hours format="h:mm A" minuteStep={15} />
          </Form.Item>

          <Form.Item>
            <AntButton type="primary" htmlType="submit" loading={creating}>
              Create Booking
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientBookingsPage;
