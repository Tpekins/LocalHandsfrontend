import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Typography, Card, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { Contract, ContractStatus } from '../../types';
import { formatCurrency } from '../../utils/currency';
import api from '../../utils/api';
import { toast } from 'sonner';

const { Title } = Typography;

// GET /api/contract — filtered by provider's ID
const ProviderContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    api.get<Contract[]>('/contract')
      .then(({ data }) => setContracts(data))
      .catch(() => toast.error('Failed to load contracts.'))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  // Filter contracts where the service provider matches the current user
  const myContracts = contracts.filter(
    (c) => c.serviceOrder?.service?.provider?.id === currentUser?.id
  );

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE: return 'blue';
      case ContractStatus.COMPLETED: return 'green';
      case ContractStatus.DISPUTED: return 'red';
      default: return 'default';
    }
  };

  // DELETE /api/contract/:id
  const handleDelete = (record: Contract) => {
    Modal.confirm({
      title: 'Delete Contract',
      content: 'Are you sure you want to delete this contract?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.delete(`/contract/${record.id}`);
          setContracts((prev) => prev.filter((c) => c.id !== record.id));
          message.success('Contract deleted');
        } catch { message.error('Failed to delete contract.'); }
      },
    });
  };

  const columns = [
    {
      title: 'Service',
      key: 'service',
      render: (_: any, record: Contract) => record.serviceOrder?.service?.title || 'N/A',
    },
    {
      title: 'Client',
      key: 'client',
      render: (_: any, record: Contract) => record.serviceOrder?.client?.name || 'N/A',
    },
    {
      title: 'Escrow',
      dataIndex: 'escrowAmount',
      key: 'escrowAmount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ContractStatus) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Start Date',
      key: 'startDate',
      render: (_: any, record: Contract) => new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Contract) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<EyeOutlined />} size="small" onClick={() => navigate(`/provider/contracts/${record.id}`)}>View</Button>
          <Button icon={<MessageOutlined />} size="small" onClick={() => navigate('/provider/chat')}>Chat</Button>
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)}>Delete</Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div><Title level={2}>My Contracts</Title><p>Loading contracts...</p></div>;
  }

  return (
    <div>
      <Title level={2}>My Contracts</Title>
      <Card>
        <Table
          dataSource={myContracts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t, r) => `${r[0]}-${r[1]} of ${t} contracts` }}
        />
      </Card>
    </div>
  );
};

export default ProviderContractsPage;
