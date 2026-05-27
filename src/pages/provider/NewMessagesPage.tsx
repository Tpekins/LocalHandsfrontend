import React from 'react';


const NewMessagesPage: React.FC = () => {
  // Dummy data for conversations
  const conversations = [
    { id: 1, name: 'John Doe', lastMessage: 'Sure, I can do that. When would you like to start?', timestamp: '10:30 AM', unread: 2 },
    { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the update!', timestamp: 'Yesterday', unread: 0 },
    { id: 3, name: 'Alice Johnson', lastMessage: 'Can you send me the invoice?', timestamp: '2 days ago', unread: 0 },
  ];

  const activeConversation = conversations[0]; // Dummy active conversation

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-120px)]">
        <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-6">Messages</h1>
        <div className="flex h-full bg-white rounded-lg shadow-lg">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <input type="text" placeholder="Search messages..." className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <ul className="overflow-y-auto">
                    {conversations.map(convo => (
                        <li key={convo.id} className={`p-4 cursor-pointer hover:bg-gray-100 ${convo.id === activeConversation.id ? 'bg-gray-100' : ''}`}>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-800">{convo.name}</span>
                                <span className="text-xs text-gray-500">{convo.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                            {convo.unread > 0 && (
                                <div className="flex justify-end">
                                    <span className="text-xs bg-primary text-white rounded-full px-2 py-1">{convo.unread}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Message View */}
            <div className="w-2/3 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                    <img src={`https://i.pravatar.cc/40?u=${activeConversation.name}`} alt={activeConversation.name} className="w-10 h-10 rounded-full" />
                    <h2 className="text-xl font-semibold text-gray-800">{activeConversation.name}</h2>
                </div>
                <div className="flex-grow p-6 overflow-y-auto bg-gray-50 space-y-4">
                    {/* Dummy Messages */}
                    <div className="flex justify-end">
                        <div className="bg-primary text-white p-3 rounded-lg max-w-md">
                            <p>Hello! I was wondering if you are available for a new project.</p>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-white border p-3 rounded-lg max-w-md">
                            <p>{activeConversation.lastMessage}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex space-x-3">
                        <input type="text" placeholder="Type your message..." className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary" />
                        <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-accent transition-colors">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default NewMessagesPage;
