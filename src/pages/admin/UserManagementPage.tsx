
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { User, UserRole } from '../../types';
import { EditIcon, DeleteIcon, EyeIcon, ChevronDownIcon } from '../../components/icons/Icons';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { USER_ROLES } from '../../constants';
import api from '../../utils/api';
import { toast } from 'sonner';

/*
 * UserManagementPage — CRUD against /api/user
 *
 * GET /api/user        → load all users on mount
 * PATCH /api/user/:id  → update user name, email, role
 * DELETE /api/user/:id → remove user (also deletes their profile via cascade)
 */

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /* Load all users on mount */
  useEffect(() => {
    api.get<User[]>('/user')
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((user) =>
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

  /* DELETE /api/user/:id */
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/user/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('User deleted.');
    } catch { toast.error('Failed to delete user.'); }
    setOpenDropdownId(null);
  };

  /* PATCH /api/user/:id — save from modal */
  const handleModalSave = async (updatedUser: User) => {
    try {
      const { data } = await api.patch<User>(`/user/${updatedUser.id}`, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      toast.success('User updated.');
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch { toast.error('Failed to update user.'); }
  };

  const toggleDropdown = (userId: number) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  if (loading) {
    return <div className="space-y-8"><h1 className="text-3xl font-poppins font-bold text-gray-800">User Management</h1><p className="text-gray-500">Loading users...</p></div>;
  }

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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-lightGray transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm mr-3">{user.name.charAt(0).toUpperCase()}</div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button onClick={() => toggleDropdown(user.id)} className="text-gray-500 hover:text-gray-700 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <ChevronDownIcon className="w-5 h-5" />
                  </button>
                  {openDropdownId === user.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                      <button onClick={() => handleViewUser(user)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                        <EyeIcon className="w-4 h-4 mr-2" /> View
                      </button>
                      <button onClick={() => handleEditUser(user)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                        <EditIcon className="w-4 h-4 mr-2" /> Edit
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                        <DeleteIcon className="w-4 h-4 mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="text-center py-8 text-gray-500">No users found matching your criteria.</p>}
      </Card>

      {isModalOpen && selectedUser && (
        <UserModal user={selectedUser} isEditMode={isEditMode} onClose={() => setIsModalOpen(false)} onSave={handleModalSave} />
      )}
    </div>
  );
};

/* Inline modal for view/edit */
interface UserModalProps { user: User; isEditMode: boolean; onClose: () => void; onSave: (user: User) => void; }

const UserModal: React.FC<UserModalProps> = ({ user, isEditMode, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const roleOptions = USER_ROLES.map((r) => ({ value: r, label: r }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, name, email, role });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEditMode ? 'Edit User' : 'View User Details'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditMode} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditMode} required />
        <Select label="Role" options={roleOptions} value={role} onChange={(e) => setRole(e.target.value as UserRole)} disabled={!isEditMode} />
        <div className="text-xs text-gray-500">
          <p>User ID: {user.id}</p>
          <p>Registered: {new Date(user.createdAt).toLocaleString()}</p>
        </div>
        {isEditMode ? (
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        ) : (
          <div className="flex justify-end pt-4">
            <Button type="button" variant="primary" onClick={onClose}>Close</Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default UserManagementPage;
