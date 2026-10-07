import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, BusinessProfile, AppointmentStatus, TaxService } from '../types';
import { INITIAL_APPOINTMENTS, DEFAULT_BUSINESS_PROFILE, TAX_SERVICES } from '../data/servicesData';

interface AppContextType {
  appointments: Appointment[];
  businessProfile: BusinessProfile;
  services: TaxService[];
  activeView: 'booking' | 'dashboard' | 'tracking' | 'services';
  setActiveView: (view: 'booking' | 'dashboard' | 'tracking' | 'services') => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  latestBookedAppointment: Appointment | null;
  setLatestBookedAppointment: (appointment: Appointment | null) => void;
  addAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  toggleDocumentReceived: (appointmentId: string, documentId: string) => void;
  deleteAppointment: (id: string) => void;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  resetAppointmentsToDefault: () => void;
  preselectedServiceId: string | null;
  setPreselectedServiceId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const APPOINTMENTS_STORAGE_KEY = 'taxlink_appointments_v1';
const BUSINESS_PROFILE_STORAGE_KEY = 'taxlink_business_profile_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading appointments from localStorage', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    try {
      const saved = localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading business profile', e);
    }
    return DEFAULT_BUSINESS_PROFILE;
  });

  const [activeView, setActiveView] = useState<'booking' | 'dashboard' | 'tracking' | 'services'>('booking');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [latestBookedAppointment, setLatestBookedAppointment] = useState<Appointment | null>(null);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error('Error saving appointments', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(BUSINESS_PROFILE_STORAGE_KEY, JSON.stringify(businessProfile));
    } catch (e) {
      console.error('Error saving business profile', e);
    }
  }, [businessProfile]);

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `TL-2026-${randomDigits}`;
    const timestamp = new Date().toISOString();

    const newApp: Appointment = {
      ...data,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setAppointments(prev => [newApp, ...prev]);
    setLatestBookedAppointment(newApp);
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      })
    );

    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null);
    }
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updated;
        }
        return item;
      })
    );

    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment(prev => (prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null));
    }
  };

  const toggleDocumentReceived = (appointmentId: string, documentId: string) => {
    setAppointments(prev =>
      prev.map(item => {
        if (item.id === appointmentId) {
          const updatedChecklist = item.documentsChecklist.map(doc => {
            if (doc.documentId === documentId) {
              const nextState = !doc.isProvided;
              return {
                ...doc,
                isProvided: nextState,
                receivedAt: nextState ? new Date().toISOString() : undefined
              };
            }
            return doc;
          });

          // Check if all mandatory documents are received to update status automatically if needed
          const allReceived = updatedChecklist.every(d => d.isProvided);
          let nextStatus = item.status;
          if (allReceived && item.status === 'Documents Awaiting') {
            nextStatus = 'In Progress';
          } else if (!allReceived && item.status === 'In Progress' && updatedChecklist.some(d => !d.isProvided)) {
            // keep as is or pending
          }

          const updated = {
            ...item,
            documentsChecklist: updatedChecklist,
            status: nextStatus,
            updatedAt: new Date().toISOString()
          };
          return updated;
        }
        return item;
      })
    );

    if (selectedAppointment && selectedAppointment.id === appointmentId) {
      setSelectedAppointment(prev => {
        if (!prev) return null;
        const updatedChecklist = prev.documentsChecklist.map(doc => {
          if (doc.documentId === documentId) {
            const nextState = !doc.isProvided;
            return {
              ...doc,
              isProvided: nextState,
              receivedAt: nextState ? new Date().toISOString() : undefined
            };
          }
          return doc;
        });
        return {
          ...prev,
          documentsChecklist: updatedChecklist,
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(item => item.id !== id));
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment(null);
    }
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
  };

  const resetAppointmentsToDefault = () => {
    setAppointments(INITIAL_APPOINTMENTS);
    setBusinessProfile(DEFAULT_BUSINESS_PROFILE);
    localStorage.removeItem(APPOINTMENTS_STORAGE_KEY);
    localStorage.removeItem(BUSINESS_PROFILE_STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        appointments,
        businessProfile,
        services: TAX_SERVICES,
        activeView,
        setActiveView,
        selectedAppointment,
        setSelectedAppointment,
        latestBookedAppointment,
        setLatestBookedAppointment,
        addAppointment,
        updateAppointmentStatus,
        updateAppointment,
        toggleDocumentReceived,
        deleteAppointment,
        updateBusinessProfile,
        resetAppointmentsToDefault,
        preselectedServiceId,
        setPreselectedServiceId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
