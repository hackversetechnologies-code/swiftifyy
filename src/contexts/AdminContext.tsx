import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TrackingData } from './TrackingContext';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (key: string) => boolean;
  logout: () => void;
  parcels: TrackingData[];
  setParcels: (parcels: TrackingData[]) => void;
  updateParcel: (id: string, updates: Partial<TrackingData>) => void;
  stats: {
    totalParcels: number;
    delivered: number;
    inTransit: number;
    pending: number;
    onTimeDelivery: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [parcels, setParcels] = useState<TrackingData[]>([]);

  const login = (key: string): boolean => {
    // Demo admin key - in production this would be properly secured
    if (key === 'SwiftifyAdmin2025!ComplexSecureKey#$%789XYZLogistics') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateParcel = (id: string, updates: Partial<TrackingData>) => {
    setParcels(prev => prev.map(parcel => 
      parcel.id === id ? { ...parcel, ...updates } : parcel
    ));
  };

  const stats = {
    totalParcels: parcels.length,
    delivered: parcels.filter(p => p.status === 'delivered').length,
    inTransit: parcels.filter(p => p.status === 'in-transit' || p.status === 'out-for-delivery').length,
    pending: parcels.filter(p => p.status === 'pending').length,
    onTimeDelivery: 98.5,
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        parcels,
        setParcels,
        updateParcel,
        stats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};