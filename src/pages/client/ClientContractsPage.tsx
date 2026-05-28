import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Typography, Card, Modal, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FabshiPaymentModal from "../../components/FabshiPaymentModal";
import { Contract, ContractStatus } from "../../types";
import { formatCurrency } from "../../utils/currency";
import api from "../../utils/api";
import { toast } from "sonner";

const { Title } = Typography;

/*
 * ClientContractsPage – GET /api/contract
 *
 * Data flow:
 *   On mount → api.get("/contract") fetches all contracts
 *     → Filtered client-side for contracts where serviceOrder.clientId matches currentUser.id
 *     → Displayed in an Ant Design table with view, edit, delete, and payment actions
 *
 * Payment: opens FabshiPaymentModal for MTN Mobile Money via POST /api/payments/fapshi/direct-pay.
 * Edit: updates contract locally and calls PATCH /api/contract/:id.
 * Delete: calls DELETE /api/contract/:id.
 */
const ClientContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // → GET /api/contract on mount
  useEffect(() => {
    const fetchContracts = async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);
        const { data } = await api.get<Contract[]>('/contract');
        setContracts(data);
      } catch {
        toast.error('Failed to load contracts.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContracts();
  }, [currentUser]);

  const handleChat = () => {
    navigate("/client/chat");
  };

  // → DELETE /api/contract/:id
  const handleDelete = (record: Contract) => {
    Modal.confirm({
      title: "Delete Contract",
      content: "Are you sure you want to delete this contract?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await api.delete(`/contract/${record.id}`);
          setContracts((prev) => prev.filter((c) => c.id !== record.id));
          message.success("Contract deleted");
        } catch {
          message.error("Failed to delete contract.");
        }
      },
    });
  };

  // Filter contracts for current client
  const myContracts = contracts.filter(
    (contract) => contract.serviceOrder?.clientId === currentUser?.id
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

  // View/edit modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewedContract, setViewedContract] = useState<Contract | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    price: 0,
    providerPhone: '',
  });

  // Payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | undefined>(undefined);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payingContract, setPayingContract] = useState<Contract | null>(null);

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
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
                title: record.serviceOrder?.service?.title || '',
                price: record.escrowAmount,
                providerPhone: record.serviceOrder?.service?.provider?.phoneNumber || '',
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

  const handlePayment = async (paymentInfo: { phoneNumber: string }) => {
    setPaymentLoading(true);
    setPaymentError(undefined);
    setPaymentSuccess(false);

    try {
      if (!paymentInfo.phoneNumber?.match(/^\+237\d{8,9}$/)) {
        throw new Error("Invalid Cameroonian phone number");
      }

      // → POST /api/payments/fapshi/direct-pay
      await api.post('/payments/fapshi/direct-pay', {
        amount: payingContract?.escrowAmount,
        phone: paymentInfo.phoneNumber,
        externalId: `contract-${payingContract?.id}-${Date.now()}`,
        email: currentUser?.email,
      });

      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentModalOpen(false);
        setPayingContract(null);
        message.success("Payment processed successfully!");
      }, 1200);
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || err.message || "Payment failed.");
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

  // → PATCH /api/contract/:id
  const handleEditSubmit = async () => {
    if (!editingContract) return;

    try {
      await api.patch(`/contract/${editingContract.id}`, {
        escrowAmount: editForm.price,
      });

      setContracts((prev) =>
        prev.map((c) =>
          c.id === editingContract.id
            ? { ...c, escrowAmount: editForm.price }
            : c
        )
      );
      message.success("Contract updated successfully");
      setEditModalOpen(false);
      setEditingContract(null);
    } catch {
      message.error("Failed to update contract.");
    }
  };

  if (isLoading) {
    return (
      <div>
        <Title level={2}>My Contracts</Title>
        <p>Loading contracts...</p>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>My Contracts</Title>

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
        contractTitle={payingContract?.serviceOrder?.service?.title || ""}
        receiverNumber={
          payingContract?.serviceOrder?.service?.provider?.phoneNumber || "+237 6XX XXX XXX"
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
              <b>Service:</b> {viewedContract.serviceOrder?.service?.title}
            </div>
            <div>
              <b>Provider:</b> {viewedContract.serviceOrder?.service?.provider?.name}
            </div>
            <div>
              <b>Provider Phone:</b>{" "}
              {viewedContract.serviceOrder?.service?.provider?.phoneNumber || "-"}
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
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                style={{ width: "100%", marginTop: 4, marginBottom: 8, padding: 4 }}
              />
            </label>
            <label>
              Escrow Amount:
              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: Number(e.target.value) })
                }
                style={{ width: "100%", marginTop: 4, marginBottom: 8, padding: 4 }}
              />
            </label>
            <label>
              Provider Phone:
              <input
                value={editForm.providerPhone}
                onChange={(e) =>
                  setEditForm({ ...editForm, providerPhone: e.target.value })
                }
                style={{ width: "100%", marginTop: 4, marginBottom: 8, padding: 4 }}
              />
            </label>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ClientContractsPage;
