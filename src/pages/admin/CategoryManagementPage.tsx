import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { Category } from '../../types';
import { PlusCircleIcon, EditIcon, DeleteIcon } from '../../components/icons/Icons';
import api from '../../utils/api';
import { toast } from 'sonner';

/*
 * CategoryManagementPage — full CRUD against /api/category
 *
 * GET    /api/category       → load list on mount
 * POST   /api/category       → create new category
 * PATCH  /api/category/:id   → update category name/description
 * DELETE /api/category/:id   → remove category
 */

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  /* Load categories on mount */
  useEffect(() => {
    api.get<Category[]>('/category')
      .then(({ data }) => setCategories(data))
      .catch(() => toast.error('Failed to load categories.'))
      .finally(() => setLoading(false));
  }, []);

  const openCreateModal = () => { setIsEditMode(false); setCurrentCategory(null); setName(''); setDescription(''); setIsModalOpen(true); };
  const openEditModal = (category: Category) => { setIsEditMode(true); setCurrentCategory(category); setName(category.name); setDescription(category.description || ''); setIsModalOpen(true); };

  /* DELETE /api/category/:id */
  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('Delete this category? This may affect existing services.')) return;
    try {
      await api.delete(`/category/${categoryId}`);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      toast.success('Category deleted.');
    } catch { toast.error('Failed to delete category.'); }
  };

  /* POST or PATCH /api/category */
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('Category name is required.'); return; }

    const payload = { name, description };

    try {
      if (isEditMode && currentCategory) {
        const { data } = await api.patch<Category>(`/category/${currentCategory.id}`, payload);
        setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)));
        toast.success('Category updated.');
      } else {
        const { data } = await api.post<Category>('/category', payload);
        setCategories((prev) => [data, ...prev]);
        toast.success('Category created.');
      }
      setIsModalOpen(false);
    } catch { toast.error('Operation failed.'); }
  };

  if (loading) {
    return <div className="space-y-8"><h1 className="text-3xl font-poppins font-bold text-gray-800">Category Management</h1><p className="text-gray-500">Loading categories...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Category Management</h1>
        <Button variant="primary" size="md" leftIcon={<PlusCircleIcon className="w-5 h-5" />} onClick={openCreateModal}>Add New Category</Button>
      </div>

      <Card className="shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-lightGray transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-sm truncate">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(category)} aria-label="Edit">
                    <EditIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)} aria-label="Delete">
                    <DeleteIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Category' : 'Create New Category'} size="md">
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <Input label="Category Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <div>
              <label htmlFor="catDesc" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea id="catDesc" name="description" rows={3} className="w-full p-2 border border-gray-300 rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{isEditMode ? 'Save Changes' : 'Create Category'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CategoryManagementPage;
