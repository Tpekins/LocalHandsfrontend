import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Contract } from '../types';

interface ContractsContextType {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  editContract: (contract: Contract) => void;
  deleteContract: (contract: Contract) => void;
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export const ContractsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  const addContract = (contract: Contract) => {
    setContracts(prev => [...prev, contract]);
  };

  const editContract = (updatedContract: Contract) => {
    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
  };

  const deleteContract = (contract: Contract) => {
    setContracts(prev => prev.filter(c => c.id !== contract.id));
  };

  return (
    <ContractsContext.Provider value={{ contracts, addContract, editContract, deleteContract }}>
      {children}
    </ContractsContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (context === undefined) {
    throw new Error('useContracts must be used within a ContractsProvider');
  }
  return context;
};
