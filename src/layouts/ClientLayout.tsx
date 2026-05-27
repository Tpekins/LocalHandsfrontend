import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DropResult } from 'react-beautiful-dnd';
import Sidebar from '../components/Sidebar';
import { CLIENT_NAV_ITEMS } from '../constants';
import { Role, NavItem } from '../types';

const ClientLayout: React.FC = () => {
  const [navItems, setNavItems] = useState<NavItem[]>(() => {
    const savedOrder = localStorage.getItem('client-nav-order');
    if (savedOrder) {
      const savedLabels = JSON.parse(savedOrder);
      return savedLabels.map((label: string) => CLIENT_NAV_ITEMS.find(item => item.label === label)).filter(Boolean) as NavItem[];
    }
    return CLIENT_NAV_ITEMS;
  });

  useEffect(() => {
    const labels = navItems.map(item => item.label);
    localStorage.setItem('client-nav-order', JSON.stringify(labels));
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
      {/* <Header /> Simplified header can be used or main header */}
      <div className="flex flex-1 pt-0"> {/* Adjusted pt-0 if header is not fixed or specific to dashboard */}
        <Sidebar navItems={navItems} role={Role.CLIENT} onDragEnd={onDragEnd} />
        <main className="flex-grow p-6 md:p-8 ml-64"> {/* ml-64 for sidebar width */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
    