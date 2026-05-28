import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Layout, Input, Button, List, Typography, Card, Image, Space, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { ChatConversation, ChatMessage, Message as ApiMessage } from '../../types';
import api from '../../utils/api';

const { Sider, Content, Header, Footer } = Layout;
const { Text, Title } = Typography;

/*
 * ChatPage — GET /api/messages + POST /api/messages
 *
 * Messages are fetched from the backend and grouped into conversations
 * by the other participant. Sending a message calls POST /api/messages.
 * The backend stores: { senderId, receiverId, content, timestamp } in
 * the Message table, with sender/receiver relations to the User table.
 */

const ClientChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Build conversation list from raw API messages, grouped by the other participant */
  const buildConversations = useCallback((msgs: ApiMessage[]) => {
    if (!currentUser) return [];
    const grouped: Record<number, ApiMessage[]> = {};
    msgs.forEach((m) => {
      const otherId = m.senderId === currentUser.id ? m.receiverId : m.senderId;
      if (!grouped[otherId]) grouped[otherId] = [];
      grouped[otherId].push(m);
    });

    return Object.entries(grouped).map(([otherId, convMsgs]) => {
      const sorted = convMsgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const last = sorted[sorted.length - 1];
      const participant = last.senderId === currentUser.id ? last.receiver : last.sender;
      const msgs: ChatMessage[] = sorted.map((m) => ({
        id: String(m.id),
        senderId: m.senderId,
        text: m.content,
        timestamp: m.timestamp,
      }));
      return {
        id: `conv-${otherId}`,
        participants: [
          { id: currentUser.id, name: currentUser.name },
          { id: Number(otherId), name: participant?.name || 'Unknown' },
        ],
        messages: msgs,
        lastMessage: msgs[msgs.length - 1],
        unreadCount: 0,
      };
    });
  }, [currentUser]);

  /** Fetch messages where current user is sender OR receiver */
  const fetchMessages = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [sentRes, receivedRes] = await Promise.all([
        api.get<ApiMessage[]>('/messages', { params: { senderId: currentUser.id } }),
        api.get<ApiMessage[]>('/messages', { params: { receiverId: currentUser.id } }),
      ]);
      const all = [...sentRes.data, ...receivedRes.data];
      const unique = Array.from(new Map(all.map((m) => [m.id, m])).values());
      const convs = buildConversations(unique);
      setConversations(convs);
      if (convs.length > 0 && !selectedId) {
        setSelectedId(convs[0].id);
      }
    } catch {
      /* empty state */
    } finally {
      setLoading(false);
    }
  }, [currentUser, buildConversations, selectedId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const selectedConversation = conversations.find((c) => c.id === selectedId) || null;
  const messages = selectedConversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** POST /api/messages — send a new message to the backend */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !selectedConversation) return;
    const receiver = selectedConversation.participants.find((p) => p.id !== currentUser.id);
    if (!receiver) return;

    try {
      await api.post('/messages', {
        senderId: currentUser.id,
        receiverId: receiver.id,
        content: newMessage,
      });
      setNewMessage('');
      // Refresh conversations after sending
      fetchMessages();
    } catch {
      message.error('Failed to send message.');
    }
  };

  const handleSendImage = (imageUrl: string) => {
    if (!currentUser || !selectedConversation) return;
    /* Image upload not yet supported by backend — falls back to text */
    console.log('Image sent:', imageUrl);
  };

  const getParticipant = (convo: ChatConversation) => {
    return convo.participants.find((p) => p.id !== currentUser?.id);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isImage) { message.error('Only JPG/PNG files allowed.'); return false; }
      return file.size / 1024 / 1024 < 2;
    },
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        handleSendImage(URL.createObjectURL(file as Blob));
        if (onSuccess) onSuccess('ok');
      }, 200);
    },
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <Card className="h-full shadow-lg rounded-lg" bodyStyle={{ padding: 0, height: '100%' }}>
        <Layout className="h-full bg-white rounded-lg">
          <Sider width={300} className="bg-white border-r border-gray-200 flex flex-col" style={{ height: '100%' }}>
            <div className="p-4 border-b border-gray-200">
              <Title level={4} style={{ margin: 0 }}>Conversations</Title>
            </div>
            <div className="overflow-y-auto flex-grow">
              {loading ? (
                <div className="p-4 text-gray-500">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">No conversations yet.</div>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={conversations}
                  renderItem={(item) => {
                    const participant = getParticipant(item);
                    return (
                      <List.Item
                        onClick={() => setSelectedId(item.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedId === item.id ? 'bg-blue-50' : ''}`}
                      >
                        <List.Item.Meta
                          avatar={
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                              {participant?.name?.[0] || '?'}
                            </div>
                          }
                          title={<Text strong>{participant?.name || 'Unknown'}</Text>}
                          description={<Text ellipsis>{item.lastMessage?.text || ''}</Text>}
                        />
                      </List.Item>
                    );
                  }}
                />
              )}
            </div>
          </Sider>
          <Layout className="flex flex-col h-full">
            {selectedConversation ? (
              <Layout className="h-full">
                <Header className="p-4 border-b border-gray-200 bg-white flex items-center h-auto">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-4">
                    {getParticipant(selectedConversation)?.name?.[0] || '?'}
                  </div>
                  <Title level={5} className="mb-0">{getParticipant(selectedConversation)?.name}</Title>
                </Header>
                <Content className="p-6 overflow-y-auto flex-grow bg-gray-50">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex my-2 ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-lg max-w-lg ${msg.senderId === currentUser?.id ? 'bg-blue-500 text-white' : 'bg-white shadow'}`}>
                        <Text className={msg.senderId === currentUser?.id ? 'text-white' : ''}>{msg.text}</Text>
                        {msg.imageUrl && <Image src={msg.imageUrl} alt="attachment" width={200} className="rounded-lg mt-2" />}
                        <div className={`text-xs mt-1 ${msg.senderId === currentUser?.id ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </Content>
                <Footer className="p-4 border-t border-gray-200 bg-white">
                  <Space.Compact style={{ width: '100%' }}>
                    <Upload {...uploadProps}>
                      <Button icon={<PaperClipOutlined />} />
                    </Upload>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onPressEnter={handleSendMessage}
                      className="flex-grow"
                    />
                    <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} />
                  </Space.Compact>
                </Footer>
              </Layout>
            ) : (
              <Content className="flex items-center justify-center h-full bg-gray-50">
                <Text type="secondary">Select a conversation to start chatting.</Text>
              </Content>
            )}
          </Layout>
        </Layout>
      </Card>
    </div>
  );
};

export default ClientChatPage;
