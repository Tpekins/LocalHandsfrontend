import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DropResult } from 'react-beautiful-dnd';
import Sidebar from '../components/Sidebar';
import { ADMIN_NAV_ITEMS } from '../constants';
import { DocumentTextIcon } from '../components/icons/Icons';
import { Role, NavItem } from '../types';

const AdminLayout: React.FC = () => {
    const [navItems, setNavItems] = useState<NavItem[]>(() => {
        const applicationsNavItem: NavItem = {
      path: '/admin/applications',
      label: 'Applications',
      icon: DocumentTextIcon,
    };

    // Combine the original items with our new one, ensuring no duplicates
    const allNavItems = [...ADMIN_NAV_ITEMS];
    if (!allNavItems.find(item => item.label === 'Applications')) {
      allNavItems.push(applicationsNavItem);
    }

    const savedOrder = localStorage.getItem('admin-nav-order');
    if (savedOrder) {
      const savedLabels = JSON.parse(savedOrder);
            return savedLabels.map((label: string) => allNavItems.find(item => item.label === label)).filter(Boolean) as NavItem[];
    }
        return allNavItems;
  });

  useEffect(() => {
    const labels = navItems.map(item => item.label);
    localStorage.setItem('admin-nav-order', JSON.stringify(labels));
  }, [navItems]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    const reorderedItems = Array.from(navItems);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);

    setNavItems(reorderedItems);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <Sidebar navItems={navItems} role={Role.ADMIN} onDragEnd={onDragEnd} />
        <main className="flex-grow p-6 md:p-8 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
    