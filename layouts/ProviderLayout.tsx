
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DropResult } from 'react-beautiful-dnd';
import Sidebar from '../components/Sidebar';
import { PROVIDER_NAV_ITEMS } from '../constants';
import { Role, NavItem } from '../types';

const ProviderLayout: React.FC = () => {
  const [navItems, setNavItems] = useState<NavItem[]>(() => {
    const savedOrder = localStorage.getItem('provider-nav-order');
    if (savedOrder) {
      const savedLabels = JSON.parse(savedOrder);
      return savedLabels.map((label: string) => PROVIDER_NAV_ITEMS.find(item => item.label === label)).filter(Boolean) as NavItem[];
    }
    return PROVIDER_NAV_ITEMS;
  });

  useEffect(() => {
    const labels = navItems.map(item => item.label);
    localStorage.setItem('provider-nav-order', JSON.stringify(labels));
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
    <div className="flex flex-col min-h-screen bg-lightGray">
      <div className="flex flex-1">
        <Sidebar navItems={navItems} role={Role.PROVIDER} onDragEnd={onDragEnd} />
        <main className="flex-grow p-6 md:p-8 ml-64"> {/* ml-64 for sidebar width */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
    