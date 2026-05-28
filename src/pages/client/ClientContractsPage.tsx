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

  const myContracts = contracts.filter(
    (contract) => contract.serviceOrder.clientId === currentUser?.id
  );

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
    phoneNumber: string;
  }) => {
    setPaymentLoading(true);
    setPaymentError(undefined);
    setPaymentSuccess(false);

    try {
      if (!paymentInfo.phoneNumber?.match(/^\+237\d{8,9}$/)) {
        throw new Error("Invalid Cameroonian phone number");
      }

      // TODO: Replace with actual Fabshi payment API call
      // Card payments should use Fabshi's hosted/iframe integration
      // to avoid handling raw card data client-side (PCI-DSS compliance).
      console.log("Processing payment:", {
        amount: payingContract?.escrowAmount,
        contractTitle: payingContract?.serviceOrder.service.title,
        paymentInfo
      });

      await new Promise((res) => setTimeout(res, 1500));
      setPaymentSuccess(true);

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
