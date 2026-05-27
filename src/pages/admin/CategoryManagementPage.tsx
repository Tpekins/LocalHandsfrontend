import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { DUMMY_CATEGORIES } from '../../utils/dummyData';
import { Category } from '../../types';
import { PlusCircleIcon, EditIcon, DeleteIcon } from '../../components/icons/Icons';

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(DUMMY_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for modal
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // Icon selection would be complex, using placeholder for now
  // const [icon, setIcon] = useState<string>(''); 

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentCategory({});
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect existing services.')) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      // Update DUMMY_CATEGORIES
      const catIdx = DUMMY_CATEGORIES.findIndex(c => c.id === categoryId);
      if (catIdx > -1) DUMMY_CATEGORIES.splice(catIdx, 1);
      alert('Category deleted.');
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
        alert("Category name is required.");
        return;
    }

    const categoryData = {
      name,
      description,
      // icon: findIconComponent(icon), // Complex logic needed here
      imageUrl: currentCategory?.imageUrl || `https://picsum.photos/seed/newcat${Date.now()}/100/100`,
    };

    if (isEditMode && currentCategory?.id) {
      const updatedCategory = { ...currentCategory, ...categoryData, id: currentCategory.id } as Category;
      setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      // Update DUMMY_CATEGORIES
      const catIdx = DUMMY_CATEGORIES.findIndex(c => c.id === updatedCategory.id);
      if (catIdx > -1) DUMMY_CATEGORIES[catIdx] = updatedCategory;
      alert('Category updated.');
    } else {
      const newCategory = { ...categoryData, id: `cat-${Date.now()}` } as Category;
      setCategories(prev => [newCategory, ...prev]);
      DUMMY_CATEGORIES.unshift(newCategory);
      alert('Category created.');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Category Management</h1>
        <Button variant="primary" size="md" leftIcon={<PlusCircleIcon className="w-5 h-5"/>} onClick={openCreateModal}>
          Add New Category
        </Button>
      </div>

      <Card className="shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category.id} className="hover:bg-lightGray transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.icon ? <category.icon className="w-8 h-8 text-primary" /> : <img src={category.imageUrl} alt={category.name} className="w-8 h-8 rounded-sm"/>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-sm truncate">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(category)} aria-label="Edit">
                        <EditIcon className="w-5 h-5 text-blue-600 hover:text-blue-800"/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)} aria-label="Delete">
                        <DeleteIcon className="w-5 h-5 text-red-600 hover:text-red-800"/>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditMode ? 'Edit Category' : 'Create New Category'}
          size="md"
        >
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <Input label="Category Name" name="name" value={name} onChange={e => setName(e.target.value)} required />
            <div>
              <label htmlFor="catDescriptionModal" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea id="catDescriptionModal" name="description" rows={3} className="w-full p-2 border border-gray-300 rounded-md" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            {/* Icon selection UI would go here */}
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
