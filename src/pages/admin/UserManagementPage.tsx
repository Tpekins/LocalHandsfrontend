
import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal'; // For view/edit modals
import { DUMMY_USERS } from '../../utils/dummyData';
import { User, Role } from '../../types';
import { EditIcon, DeleteIcon, EyeIcon, ChevronDownIcon } from '../../components/icons/Icons'; 
import Input from '../../components/Input';
import Select from '../../components/Select';
import { USER_ROLES } from '../../constants';


const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // For actions dropdown per row
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(false);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleSuspendUser = (userId: string) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? {...u, status: 'Suspended'} : u));
        // Update DUMMY_USERS as well for demo persistence
        const userIdx = DUMMY_USERS.findIndex(u => u.id === userId);
        if (userIdx > -1) DUMMY_USERS[userIdx].status = 'Suspended';
        alert('User suspended.');
    }
    setOpenDropdownId(null);
  };
  
  const handleModalSave = (updatedUser: User) => {
    // Simulate API call
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    const userIdx = DUMMY_USERS.findIndex(u => u.id === updatedUser.id);
    if (userIdx > -1) DUMMY_USERS[userIdx] = updatedUser;
    alert('User updated successfully.');
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">User Management</h1>
      
      <Card className="p-4 shadow-md">
        <Input 
            placeholder="Search users (name, email, role)..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="mb-0"
        />
      </Card>

      <Card className="shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-lightGray transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover mr-3" src={user.avatar || `https://picsum.photos/seed/${user.id}/40/40`} alt={user.name} />
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.registeredAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    ${user.status === 'Suspended' ? 'bg-red-100 text-red-800' : ''}
                    ${user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {user.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button onClick={() => toggleDropdown(user.id)} className="text-gray-500 hover:text-gray-700 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <ChevronDownIcon className="w-5 h-5"/>
                    </button>
                    {openDropdownId === user.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                            <button onClick={() => handleViewUser(user)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                                <EyeIcon className="w-4 h-4 mr-2"/> View
                            </button>
                            <button onClick={() => handleEditUser(user)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                                <EditIcon className="w-4 h-4 mr-2"/> Edit
                            </button>
                            {user.status !== 'Suspended' && (
                               <button onClick={() => handleSuspendUser(user.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                                <DeleteIcon className="w-4 h-4 mr-2"/> Suspend
                            </button>
                            )}
                        </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
            <p className="text-center py-8 text-gray-500">No users found matching your criteria.</p>
        )}
      </Card>
      
      {isModalOpen && selectedUser && (
        <UserModal 
            user={selectedUser} 
            isEditMode={isEditMode} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleModalSave} 
        />
      )}
    </div>
  );
};

// Modal Component for View/Edit User
interface UserModalProps {
    user: User;
    isEditMode: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, isEditMode, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState<Role>(user.role);
    const [status, setStatus] = useState<'Active' | 'Suspended' | 'Pending' | undefined>(user.status);

    const roleOptions = USER_ROLES.map(r => ({ value: r, label: r }));
    const statusOptions = [
        {value: 'Active', label: 'Active'},
        {value: 'Suspended', label: 'Suspended'},
        {value: 'Pending', label: 'Pending'},
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...user, name, email, role, status });
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={isEditMode ? "Edit User" : "View User Details"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Name" value={name} onChange={e => setName(e.target.value)} disabled={!isEditMode} required />
                <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!isEditMode} required />
                <Select label="Role" options={roleOptions} value={role} onChange={e => setRole(e.target.value as Role)} disabled={!isEditMode} required />
                <Select label="Status" options={statusOptions} value={status || ''} onChange={e => setStatus(e.target.value as 'Active' | 'Suspended' | 'Pending')} disabled={!isEditMode} />
                
                <div className="text-xs text-gray-500">
                    <p>User ID: {user.id}</p>
                    <p>Registered: {new Date(user.registeredAt).toLocaleString()}</p>
                </div>

                {isEditMode && (
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </div>
                )}
                 {!isEditMode && (
                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="primary" onClick={onClose}>Close</Button>
                    </div>
                )}
            </form>
        </Modal>
    );
};


export default UserManagementPage;
