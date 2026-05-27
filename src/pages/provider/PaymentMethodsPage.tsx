import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PlusIcon, TrashIcon } from '../../components/icons/Icons';

// Dummy data for payment methods
const DUMMY_PAYMENT_METHODS = [
    { id: '1', type: 'MTN Mobile Money', detail: '**** **** 6789', isDefault: true },
    { id: '2', type: 'Orange Money', detail: '**** **** 1234', isDefault: false },
];

const PaymentMethodsPage: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState(DUMMY_PAYMENT_METHODS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMethodType, setNewMethodType] = useState('MTN Mobile Money');
            const [newMethodDetail, setNewMethodDetail] = useState('');
    const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

    const handleSetDefault = (id: string) => {
        const updatedMethods = paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id,
        }));
        setPaymentMethods(updatedMethods);
    };

    const handleAddMethod = () => {
        if (!newMethodDetail.trim()) {
            alert('Please enter the account details.');
            return;
        }

        const newMethod = {
            id: `new-${Date.now()}`,
            type: newMethodType,
            // Simple masking for display purposes
            detail: `**** **** ${newMethodDetail.slice(-4)}`,
            isDefault: paymentMethods.length === 0,
        };

        setPaymentMethods([...paymentMethods, newMethod]);

        // Reset form and close modal
        setIsModalOpen(false);
        setNewMethodType('MTN Mobile Money');
        setNewMethodDetail('');
    };

    const handleDeleteMethod = () => {
        if (!methodToDelete) return;

        const methodWasDefault = paymentMethods.find(m => m.id === methodToDelete)?.isDefault;

        let updatedMethods = paymentMethods.filter(method => method.id !== methodToDelete);

        if (methodWasDefault && updatedMethods.length > 0) {
            updatedMethods[0] = { ...updatedMethods[0], isDefault: true };
        }

        setPaymentMethods(updatedMethods);
        setMethodToDelete(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-poppins font-bold text-gray-800">Manage Payment Methods</h1>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon className="w-5 h-5"/>}>
                    Add New Method
                </Button>
            </div>

            <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Your Withdrawal Accounts</h2>
                <div className="space-y-4">
                    {paymentMethods.length > 0 ? (
                        paymentMethods.map(method => (
                            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-semibold">{method.type} {method.isDefault && <span className="text-xs text-white bg-primary rounded-full px-2 py-0.5 ml-2">Default</span>}</p>
                                    <p className="text-gray-600 text-sm">{method.detail}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {!method.isDefault && (
                                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>Set as Default</Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => setMethodToDelete(method.id)}
                                        aria-label="Delete payment method"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">You haven't added any payment methods yet.</p>
                    )}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a New Payment Method">
                <form onSubmit={(e) => { e.preventDefault(); handleAddMethod(); }}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">Payment Method Type</label>
                            <select 
                                id="paymentType" 
                                name="paymentType" 
                                value={newMethodType}
                                onChange={(e) => setNewMethodType(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                            >
                                <option>MTN Mobile Money</option>
                                <option>Orange Money</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="accountDetail" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input 
                                type="text" 
                                name="accountDetail" 
                                id="accountDetail" 
                                value={newMethodDetail}
                                onChange={(e) => setNewMethodDetail(e.target.value)}
                                placeholder="+237 6XX XXX XXX" 
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Method
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!methodToDelete} onClose={() => setMethodToDelete(null)} title="Confirm Deletion">
                <div>
                    <p className="text-gray-600 mb-6">Are you sure you want to delete this payment method? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setMethodToDelete(null)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteMethod}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PaymentMethodsPage;
