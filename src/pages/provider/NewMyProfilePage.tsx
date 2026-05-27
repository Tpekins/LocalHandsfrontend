import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

const NewMyProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // In a real app, you would fetch the full user profile.
  // Here we use the basic info from the auth context and allow editing.
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In a real app, you would send this data to your backend.
    console.log('Saving profile:', { name, email, avatar });
    setIsEditing(false);
    alert('Profile saved successfully! (UI only)');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-6">My Profile</h1>
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img src={avatar} alt={name} className="w-32 h-32 rounded-full object-cover border-4 border-primary" />
          <div className="flex-grow w-full">
            {isEditing ? (
              <div className="space-y-4">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label="Avatar URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
                <p className="text-gray-600">{email}</p>
                <p className="text-sm text-gray-500">Role: {currentUser?.role}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewMyProfilePage;
