import React from "react";
import { Table, Tag, Button, Typography, Card, Modal, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useContracts } from "../../contexts/ContractsContext";
import ContractFormModal from "../../components/contracts/ContractFormModal";
import FabshiPaymentModal from "../../components/FabshiPaymentModal";
import { Contract, ContractStatus } from "../../types";
import { formatCurrency } from "../../utils/currency";

const { Title } = Typography;

const ClientContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { contracts, deleteContract, addContract, editContract } = useContracts();

  const [formOpen, setFormOpen] = React.useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | undefined>(
    undefined
  );
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [payingContract, setPayingContract] = React.useState<Contract | null>(
    null
  );

  const handleChat = () => {
    navigate("/client/chat");
  };

  const handleDelete = (record: Contract) => {
    Modal.confirm({
      title: "Delete Contract",
      content: "Are you sure you want to delete this contract?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteContract(record);
        message.success("Contract deleted");
      },
    });
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: any) => {
    if (editingContract) {
      // Edit
      const updatedContract: Contract = {
        ...editingContract,
        ...values,
      };
      editContract(updatedContract);
      message.success("Contract updated (mock)");
    } else {
      // Add - construct a minimal Contract from form values
      if (!currentUser) return;
      const newContract: Contract = {
        id: Date.now(),
        serviceOrder: {
          id: Date.now(),
          service: {
            id: Date.now(),
            title: values.title || "",
            description: "",
            price: values.price || 0,
            status: "available",
            featured: false,
            provider: currentUser,
            providerId: currentUser.id,
            category: undefined,
            assets: [],
            views: 0,
            createdAt: new Date().toISOString(),
          },
          serviceId: Date.now(),
          client: currentUser,
          clientId: currentUser.id,
          description: "",
          budget: values.price,
          status: {} as any,
          createdAt: new Date().toISOString(),
        },
        serviceOrderId: Date.now(),
        escrowAmount: values.price || 0,
        status: ContractStatus.ACTIVE,
        payments: [],
        createdAt: new Date().toISOString(),
      };
      addContract(newContract);
      message.success("Contract added");
    }
    setFormOpen(false);
    setEditingContract(null);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingContract(null);
  };

  let myContracts = contracts.filter(
    (contract) => contract.serviceOrder.clientId === currentUser?.id
  );

  // Seed mock contracts for testing if none exist
  if ((!myContracts || myContracts.length === 0) && currentUser) {
    myContracts = [
      {
        id: 1,
        serviceOrder: {
          id: 1,
          service: { id: 1, title: "Plumbing Service", description: "", price: 15000, status: "available", featured: false, provider: { id: 101, name: "Jane Doe", email: "", phoneNumber: "+237 650 123 456", role: {} as any, createdAt: "" }, providerId: 101, category: { id: 1, name: "Plumbing" }, categoryId: 1, assets: [], views: 0, createdAt: new Date().toISOString() },
          serviceId: 1,
          client: currentUser,
          clientId: currentUser.id,
          description: "",
          budget: 15000,
          status: {} as any,
          createdAt: new Date().toISOString(),
        },
        serviceOrderId: 1,
        escrowAmount: 15000,
        status: ContractStatus.ACTIVE,
        payments: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        serviceOrder: {
          id: 2,
          service: { id: 2, title: "Electrical Installation", description: "", price: 22000, status: "available", featured: false, provider: { id: 102, name: "Alice Smith", email: "", phoneNumber: "+237 651 234 567", role: {} as any, createdAt: "" }, providerId: 102, category: { id: 2, name: "Electrical" }, categoryId: 2, assets: [], views: 0, createdAt: new Date().toISOString() },
          serviceId: 2,
          client: currentUser,
          clientId: currentUser.id,
          description: "",
          budget: 22000,
          status: {} as any,
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        serviceOrderId: 2,
        escrowAmount: 22000,
        status: ContractStatus.COMPLETED,
        payments: [],
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: 3,
        serviceOrder: {
          id: 3,
          service: { id: 3, title: "Painting Job", description: "", price: 8000, status: "available", featured: false, provider: { id: 103, name: "Bob Johnson", email: "", phoneNumber: "+237 652 345 678", role: {} as any, createdAt: "" }, providerId: 103, category: { id: 3, name: "Painting" }, categoryId: 3, assets: [], views: 0, createdAt: new Date().toISOString() },
          serviceId: 3,
          client: currentUser,
          clientId: currentUser.id,
          description: "",
          budget: 8000,
          status: {} as any,
          createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        },
        serviceOrderId: 3,
        escrowAmount: 8000,
        status: ContractStatus.COMPLETED,
        payments: [],
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
    ];
  }

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE:
        return "blue";
      case ContractStatus.COMPLETED:
        return "green";
      case ContractStatus.DISPUTED:
        return "red";
      default:
        return "default";
    }
  };

  // State for view/edit modals
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [viewedContract, setViewedContract] = React.useState<Contract | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingContract, setEditingContract] = React.useState<Contract | null>(
    null
  );
  const [editForm, setEditForm] = React.useState({
    title: '',
    price: 0,
    providerPhone: ''
  });

  const columns = [
    {
      title: "Service",
      dataIndex: ["serviceOrder", "service", "title"],
      key: "service",
    },
    {
      title: "Provider",
      dataIndex: ["serviceOrder", "service", "provider", "name"],
      key: "provider",
    },
    {
      title: "Escrow Amount",
      dataIndex: "escrowAmount",
      key: "escrowAmount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ContractStatus) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Contract) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setViewedContract(record);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>
          <Button icon={<MessageOutlined />} size="small" onClick={handleChat}>
            Chat
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingContract(record);
              setEditForm({
                title: record.serviceOrder.service.title,
                price: record.escrowAmount,
                providerPhone: record.serviceOrder.service.provider.phoneNumber || ''
              });
              setEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleOpenPayment(record)}
          >
            Make Payment
          </Button>
        </div>
      ),
    },
  ];

  const handleOpenPayment = (contract: Contract) => {
    setPayingContract(contract);
    setPaymentModalOpen(true);
    setPaymentError(undefined);
    setPaymentSuccess(false);
  };

  const handlePayment = async (paymentInfo: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    phoneNumber?: string;
    paymentOption?: string;
  }) => {
    setPaymentLoading(true);
    setPaymentError(undefined);
    setPaymentSuccess(false);
    
    try {
      // Validate payment information
      if (paymentInfo.paymentOption === 'card') {
        if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
          throw new Error("Please fill in all card details");
        }
        // Basic card validation (mock)
        if (paymentInfo.cardNumber.length < 13) {
          throw new Error("Invalid card number");
        }
      } else if (paymentInfo.paymentOption === 'mobile_money') {
        if (!paymentInfo.phoneNumber) {
          throw new Error("Phone number is required for mobile money");
        }
        // Basic phone validation (mock)
        if (!paymentInfo.phoneNumber.match(/^\+237\d{8,9}$/)) {
          throw new Error("Invalid Cameroonian phone number");
        }
      }
      
      // TODO: Replace with actual Fabshi payment API call
      console.log("Processing payment:", {
        amount: payingContract?.escrowAmount,
        contractTitle: payingContract?.serviceOrder.service.title,
        paymentInfo
      });
      
      await new Promise((res) => setTimeout(res, 1500)); // Simulate API call
      setPaymentSuccess(true);
      
      // Close modal after success delay
      setTimeout(() => {
        setPaymentModalOpen(false);
        setPayingContract(null);
        message.success("Payment processed successfully!");
      }, 1200);
    } catch (err: any) {
      setPaymentError(err.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleClosePayment = () => {
    setPaymentModalOpen(false);
    setPayingContract(null);
    setPaymentError(undefined);
    setPaymentSuccess(false);
  };

  const handleEditSubmit = () => {
    if (editingContract) {
      const updatedContract: Contract = {
        ...editingContract,
        escrowAmount: editForm.price,
        serviceOrder: {
          ...editingContract.serviceOrder,
          service: {
            ...editingContract.serviceOrder.service,
            title: editForm.title,
          },
        },
      };
      editContract(updatedContract);
      message.success("Contract updated successfully");
      setEditModalOpen(false);
      setEditingContract(null);
    }
  };

  return (
    <div>
      <Title level={2}>My Contracts</Title>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleAddContract}
      >
        Add Contract
      </Button>
      <ContractFormModal
        open={formOpen}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        initialValues={editingContract ? editingContract : undefined}
        isEdit={!!editingContract}
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
              `${range[0]}-${range[1]} of ${total} contracts`,
          }}
        />
      </Card>
      <FabshiPaymentModal
        open={paymentModalOpen}
        amount={payingContract?.escrowAmount || 0}
        contractTitle={payingContract?.serviceOrder.service.title || ""}
        receiverNumber={
          payingContract?.serviceOrder.service.provider.phoneNumber || "+237 6XX XXX XXX"
        }
        onCancel={handleClosePayment}
        onPay={handlePayment}
        loading={paymentLoading}
        error={paymentError}
        success={paymentSuccess}
      />

      {/* View Contract Modal */}
      <Modal
        open={viewModalOpen}
        title="Contract Details"
        onCancel={() => setViewModalOpen(false)}
        footer={null}
      >
        {viewedContract && (
          <div style={{ lineHeight: 2 }}>
            <div>
              <b>Service:</b> {viewedContract.serviceOrder.service.title}
            </div>
            <div>
              <b>Provider:</b> {viewedContract.serviceOrder.service.provider.name}
            </div>
            <div>
              <b>Provider Phone:</b>{" "}
              {viewedContract.serviceOrder.service.provider.phoneNumber || "-"}
            </div>
            <div>
              <b>Escrow Amount:</b> {formatCurrency(viewedContract.escrowAmount)}
            </div>
            <div>
              <b>Status:</b> {viewedContract.status}
            </div>
            <div>
              <b>Created:</b>{" "}
              {new Date(viewedContract.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Contract Modal */}
      <Modal
        open={editModalOpen}
        title="Edit Contract"
        onCancel={() => {
          setEditModalOpen(false);
          setEditingContract(null);
        }}
        onOk={handleEditSubmit}
        okText="Save"
        cancelText="Cancel"
      >
        {editingContract && (
          <form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              Service:
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                style={{
                  width: "100%",
                  marginTop: 4,
                  marginBottom: 8,
                  padding: 4,
                }}
              />
            </label>
            <label>
              Escrow Amount:
              <input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                style={{
                  width: "100%",
                  marginTop: 4,
                  marginBottom: 8,
                  padding: 4,
                }}
              />
            </label>
            <label>
              Provider Phone:
              <input
                value={editForm.providerPhone}
                onChange={(e) => setEditForm({...editForm, providerPhone: e.target.value})}
                style={{
                  width: "100%",
                  marginTop: 4,
                  marginBottom: 8,
                  padding: 4,
                }}
              />
            </label>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ClientContractsPage;
