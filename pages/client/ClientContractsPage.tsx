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
import { Contract } from "../../types";
import { formatCurrency } from "../../utils/currency";

const { Title } = Typography;

import FabshiPaymentModal from "../../components/FabshiPaymentModal";

const ClientContractsPage: React.FC = () => {
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
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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
      // Add
      const newContract: Contract = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        clientId: currentUser?.id || "",
        provider: { id: "", name: "" }, // placeholder, should be selected in real app
        status: "active",
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

  const { contracts, deleteContract, addContract, editContract } =
    useContracts();
  let myContracts = contracts.filter(
    (contract) => contract.clientId === currentUser?.id
  );

  // Seed mock contracts for testing if none exist
  if ((!myContracts || myContracts.length === 0) && currentUser) {
    myContracts = [
      {
        id: "mock_001",
        clientId: currentUser.id,
        provider: {
          id: "prov_1",
          name: "Jane Doe",
          phone: "+237 650 123 456",
        } as any,
        title: "Plumbing Service",
        price: 15000,
        status: "active",
        startDate: new Date(),
        completionDate: undefined,
      },
      {
        id: "mock_002",
        clientId: currentUser.id,
        provider: {
          id: "prov_2",
          name: "Alice Smith",
          phone: "+237 651 234 567",
        } as any,
        title: "Electrical Installation",
        price: 22000,
        status: "completed",
        startDate: new Date(Date.now() - 86400000 * 10),
        completionDate: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: "mock_003",
        clientId: currentUser.id,
        provider: {
          id: "prov_3",
          name: "Bob Johnson",
          phone: "+237 652 345 678",
        } as any,
        title: "Painting Job",
        price: 8000,
        status: "cancelled",
        startDate: new Date(Date.now() - 86400000 * 20),
        completionDate: undefined,
      },
    ];
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
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
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Provider",
      dataIndex: ["provider", "name"],
      key: "provider",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrency(price),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString();
      },
    },
    {
      title: "Completion Date",
      dataIndex: "completionDate",
      key: "completionDate",
      render: (date: Date | string | undefined) => {
        if (!date) return "-";
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString();
      },
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
                title: record.title,
                price: record.price,
                providerPhone: record.provider?.phone || ''
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
        amount: payingContract?.price,
        contractTitle: payingContract?.title,
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
        title: editForm.title,
        price: editForm.price,
        provider: {
          ...editingContract.provider,
          phone: editForm.providerPhone
        }
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
        amount={payingContract?.price || 0}
        contractTitle={payingContract?.title || ""}
        receiverNumber={
          payingContract?.provider?.phone || "+237 6XX XXX XXX"
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
              <b>Service:</b> {viewedContract.title}
            </div>
            <div>
              <b>Provider:</b> {viewedContract.provider?.name}
            </div>
            <div>
              <b>Provider Phone:</b>{" "}
              {(viewedContract.provider as any)?.phone || "-"}
            </div>
            <div>
              <b>Price:</b> {formatCurrency(viewedContract.price)}
            </div>
            <div>
              <b>Status:</b> {viewedContract.status}
            </div>
            <div>
              <b>Start Date:</b>{" "}
              {viewedContract.startDate
                ? (typeof viewedContract.startDate === 'string' ? new Date(viewedContract.startDate) : viewedContract.startDate).toLocaleDateString()
                : "-"}
            </div>
            <div>
              <b>Completion Date:</b>{" "}
              {viewedContract.completionDate
                ? (typeof viewedContract.completionDate === 'string' ? new Date(viewedContract.completionDate) : viewedContract.completionDate).toLocaleDateString()
                : "-"}
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
              Price:
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
