import React from 'react';
import { Table, Tag, Button, Typography, Card, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useContracts } from '../../contexts/ContractsContext';
import ContractFormModal from '../../components/contracts/ContractFormModal';
import { Contract, ContractStatus } from '../../types';
import { formatCurrency } from '../../utils/currency';

const { Title } = Typography;

const ProviderContractsPage: React.FC = () => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editContractData, setEditContractData] = React.useState<Contract | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { contracts, deleteContract, addContract, editContract } = useContracts();
  const myContracts = contracts.filter((contract: Contract) => contract.serviceOrder.service.provider.id === currentUser?.id);

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE: return 'blue';
      case ContractStatus.COMPLETED: return 'green';
      case ContractStatus.DISPUTED: return 'red';
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
      editContract({ ...editContractData, ...values });
      message.success('Contract updated');
    } else {
      const newContract: Contract = {
        id: Date.now(),
        serviceOrder: values.serviceOrder,
        serviceOrderId: values.serviceOrderId || 0,
        escrowAmount: values.escrowAmount || 0,
        status: ContractStatus.ACTIVE,
        payments: [],
        createdAt: new Date().toISOString(),
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
      key: 'service',
      render: (_: any, record: Contract) => record.serviceOrder.service.title,
    },
    {
      title: 'Client',
      key: 'client',
      render: (_: any, record: Contract) => record.serviceOrder.client.name,
    },
    {
      title: 'Price',
      key: 'price',
      render: (_: any, record: Contract) => formatCurrency(record.serviceOrder.service.price),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ContractStatus) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      key: 'startDate',
      render: (_: any, record: Contract) => new Date(record.serviceOrder.createdAt).toLocaleDateString(),
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