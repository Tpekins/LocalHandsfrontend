
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { NavItem, Role } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { LogoutIcon } from './icons/Icons';

interface SidebarProps {
  navItems: NavItem[];
  role: Role;
  onDragEnd: (result: DropResult) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, role, onDragEnd }) => {
  const { settings } = useSettings();
  const { logout } = useAuth();
  const roleColor = role === Role.CLIENT ? 'text-primary' : role === Role.PROVIDER ? 'text-secondary' : 'text-red-500';

  return (
    <div className="w-64 bg-gray-800 text-gray-100 flex flex-col min-h-screen fixed top-0 left-0 pt-5 shadow-lg">
      <div className="px-6 mb-8">
        <Link to="/" className="text-3xl font-poppins font-bold text-white">
          {settings.platformName}
        </Link>
        <p className={`text-sm font-semibold mt-1 ${roleColor}`}>{role} Dashboard</p>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sidebar-nav">
          {(provided) => (
            <nav
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-grow px-3"
            >
              {navItems.map((item, index) => (
                <Draggable key={item.label} draggableId={item.label} index={index}>
                  {(provided, snapshot) => (
                    <NavLink
                      to={item.path}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-3 mb-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                        ${snapshot.isDragging ? 'bg-gray-600' : ''}
                        ${isActive ? 'bg-primary text-white shadow-sm' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                      }
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                      {item.label}
                    </NavLink>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </nav>
          )}
        </Droppable>
      </DragDropContext>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-150 ease-in-out"
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
    