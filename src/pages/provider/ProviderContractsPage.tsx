import React from 'react';
import { Table, Tag, Button, Typography, Card, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useContracts } from '../../contexts/ContractsContext';
import ContractFormModal from '../../components/contracts/ContractFormModal';
import { Contract } from '../../types';
import { formatCurrency } from '../../utils/currency';

const { Title } = Typography;

const ProviderContractsPage: React.FC = () => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editContractData, setEditContractData] = React.useState<Contract | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { contracts, deleteContract, addContract, editContract } = useContracts();
  const myContracts = contracts.filter((contract: Contract) => contract.provider.id === currentUser?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const handleEdit = (record: Contract) => {
    setEditContractData(record);
    setFormOpen(true);
  };

  const handleDelete = (record: Contract) => {
    Modal.confirm({
      title: 'Delete Contract',
      content: 'Are you sure you want to delete this contract?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteContract(record);
        message.success('Contract deleted');
      },
    });
  };

  const handleAddContract = () => {
    setEditContractData(null);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: any) => {
    if (editContractData) {
      // Edit
      editContract({ ...editContractData, ...values });
      message.success('Contract updated');
    } else {
      // Add
      const newContract: Contract = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        provider: currentUser,
        providerId: currentUser?.id || '',
        client: { id: '', name: '' }, // placeholder, should be selected in real app
        status: 'active',
      };
      addContract(newContract);
      message.success('Contract added');
    }
    setFormOpen(false);
    setEditContractData(null);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditContractData(null);
  };

  const handleChat = () => {
    navigate('/provider/chat');
  };

  const columns = [
    {
      title: 'Service',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'name'],
      key: 'client',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: 'Completion Date',
      dataIndex: 'completionDate',
      key: 'completionDate',
      render: (date: Date | undefined) => date ? date.toLocaleDateString() : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Contract) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<EyeOutlined />} size="small" onClick={() => navigate(`/provider/contracts/${record.id}`)}>View</Button>
          <Button icon={<MessageOutlined />} size="small" onClick={handleChat}>Chat</Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>My Contracts</Title>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleAddContract}>
        Add Contract
      </Button>
      <ContractFormModal
        open={formOpen}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        initialValues={editContractData || undefined}
        isEdit={!!editContractData}
      />
      <Card>
        <Table
          dataSource={myContracts}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} contracts`
          }}
        />
      </Card>
    </div>
  );
};

export default ProviderContractsPage;
