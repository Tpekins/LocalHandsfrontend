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
    editContract(null);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: any) => {
    if (editingContract) {
      // Edit
      // Here you would update the contract in state/backend
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
    editContract(null);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    editContract(null);
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
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: "Completion Date",
      dataIndex: "completionDate",
      key: "completionDate",
      render: (date: Date | undefined) =>
        date ? date.toLocaleDateString() : "-",
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
  }) => {
    setPaymentLoading(true);
    setPaymentError(undefined);
    setPaymentSuccess(false);
    try {
      // TODO: Replace with Fabshi payment API call
      await new Promise((res) => setTimeout(res, 1500)); // Simulate async payment
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentModalOpen(false);
        setPayingContract(null);
      }, 1200);
    } catch (err) {
      setPaymentError("Payment failed. Please try again.");
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
        visible={paymentModalOpen}
        amount={payingContract?.price || 0}
        contractTitle={payingContract?.title || ""}
        receiverNumber={
          (payingContract?.provider as any)?.phone || "+237 6XX XXX XXX"
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
                ? new Date(viewedContract.startDate).toLocaleDateString()
                : "-"}
            </div>
            <div>
              <b>Completion Date:</b>{" "}
              {viewedContract.completionDate
                ? new Date(viewedContract.completionDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Contract Modal (mocked, only title, price, provider phone) */}
      <Modal
        open={editModalOpen}
        title="Edit Contract"
        onCancel={() => setEditModalOpen(false)}
        onOk={() => setEditModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        {editingContract && (
          <form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              Service:
              <input
                defaultValue={editingContract.title}
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
                defaultValue={editingContract.price}
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
                defaultValue={((editingContract?.provider as any)?.phone) || ""}
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
