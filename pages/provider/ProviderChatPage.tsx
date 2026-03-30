import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, Avatar, List, Typography, Card, Image, Space, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { ChatConversation, ChatMessage } from '../../types';

const { Sider, Content, Header, Footer } = Layout;
const { Text, Title } = Typography;

const ProviderChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { conversations, sendMessage } = useChat();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(conversations.length > 0 ? conversations[0] : null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = selectedConversation
    ? conversations.find(c => c.id === selectedConversation.id)?.messages || []
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !currentUser || !selectedConversation) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date(),
    };

    sendMessage(selectedConversation.id, message);
    setNewMessage('');
  };

  const handleSendImage = (imageUrl: string) => {
    if (!currentUser || !selectedConversation) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: '',
      timestamp: new Date(),
      imageUrl: imageUrl,
    };

    sendMessage(selectedConversation.id, message);
  };

  const getParticipant = (convo: ChatConversation) => {
      return convo.participants.find(p => p.id !== currentUser?.id);
  }

  const uploadProps: UploadProps = {
    name: 'file',
    showUploadList: false,
    beforeUpload: (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    },
    customRequest: ({ file, onSuccess }) => {
        // Simulate upload
        setTimeout(() => {
            const imageUrl = URL.createObjectURL(file as Blob);
            handleSendImage(imageUrl);
            if (onSuccess) {
                onSuccess('ok');
            }
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
                        <List
                            itemLayout="horizontal"
                            dataSource={conversations}
                            renderItem={item => {
                                const participant = getParticipant(item);
                                return (
                                    <List.Item
                                        onClick={() => setSelectedConversation(item)}
                                        className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversation?.id === item.id ? 'bg-blue-50' : ''}`}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={participant?.avatar} />}
                                            title={<Text strong>{participant?.name}</Text>}
                                            description={<Text ellipsis>{item.lastMessage.text}</Text>}
                                        />
                                        {item.unreadCount > 0 && <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.unreadCount}</div>}
                                    </List.Item>
                                );
                            }}
                        />
                    </div>
                </Sider>
                <Layout className="flex flex-col h-full">
                    {selectedConversation ? (
                        <Layout className="h-full">
                            <Header className="p-4 border-b border-gray-200 bg-white flex items-center h-auto">
                                <Avatar src={getParticipant(selectedConversation)?.avatar} className="mr-4" />
                                <Title level={5} className="mb-0">{getParticipant(selectedConversation)?.name}</Title>
                            </Header>
                            <Content className="p-6 overflow-y-auto flex-grow bg-gray-50">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex my-2 ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-3 rounded-lg max-w-lg ${msg.senderId === currentUser?.id ? 'bg-blue-500 text-white' : 'bg-white shadow'}`}>
                                            <Text className={msg.senderId === currentUser?.id ? 'text-white' : ''}>{msg.text}</Text>
                                            {msg.imageUrl && <Image src={msg.imageUrl} alt="attachment" width={200} className="rounded-lg mt-2"/>}
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

export default ProviderChatPage;
