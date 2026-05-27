import React, { useState } from 'react';
import { Service } from '../types';
import Button from './Button';

interface ServiceFormProps {
  service?: Service;
  onSave: (data: Partial<Service>) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel, readOnly }) => {
  const [title, setTitle] = useState(service?.title || '');
  const [providerName, setProviderName] = useState(service?.providerName || '');
  const [category, setCategory] = useState(service?.category?.name || '');
  const [price, setPrice] = useState(service?.price || 0);
  const [rating, setRating] = useState(service?.rating || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      providerName,
      category: { ...service?.category, name: category } as any,
      price,
      rating,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
          <input
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Service Title"
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
          <input
            name="providerName"
            value={providerName}
            onChange={e => setProviderName(e.target.value)}
            placeholder="Provider Name"
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            name="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Category"
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            name="price"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            placeholder="Price"
            type="number"
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <input
            name="rating"
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            placeholder="Rating"
            type="number"
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {!readOnly && (
          <Button type="submit" variant="primary" size="md">
            Save
          </Button>
        )}
        <Button onClick={onCancel} variant="outline" size="md" className="ml-2">
          {readOnly ? 'Close' : 'Cancel'}
        </Button>
      </form>
    </div>
  );
};

export default ServiceForm;
