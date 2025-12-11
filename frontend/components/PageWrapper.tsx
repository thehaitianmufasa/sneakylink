'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ModalContextType {
  isQuoteModalOpen: boolean;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within PageWrapper');
  }
  return context;
}

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  // Listen for custom 'openQuoteModal' event from buttons
  useEffect(() => {
    const handleOpenModal = () => {
      openQuoteModal();
    };

    window.addEventListener('openQuoteModal', handleOpenModal);
    return () => window.removeEventListener('openQuoteModal', handleOpenModal);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isQuoteModalOpen,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default PageWrapper;
