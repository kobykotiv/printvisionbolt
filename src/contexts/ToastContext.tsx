import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastType } from '../components/ui/Toast';

<<<<<<< HEAD
interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
=======
interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([]);
  let nextId = 0;

  const showToast = (message: string, type: ToastType) => {
    const id = nextId++;
    setToasts((current) => [...current, { id, message, type }]);
>>>>>>> parent of ee2cfdb (implementing cms)
  };

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = (message: string, type?: ToastType) => {
    addToast(message, type);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}