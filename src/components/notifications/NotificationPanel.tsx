import React, { useState } from 'react';
import { XIcon } from '../icons/Icons';

export type Notification = {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
};

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose, notifications }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ boxShadow: 'rgba(0,0,0,0.15) -4px 0px 32px 0px' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 focus:outline-none">
          <XIcon className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        {notifications.length === 0 ? (
          <div className="text-gray-500 text-center mt-12">No notifications yet.</div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li key={n.id} className={`rounded-lg p-4 shadow-sm border ${n.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{n.message}</span>
                  <span className="text-xs text-gray-400 ml-2">{n.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
