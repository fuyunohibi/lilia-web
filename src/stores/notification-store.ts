// stores/notification-store.ts
import { create } from "zustand";

interface Notification {
  device_id: string;
  sensor: string;
  code: string;
  message: string;
  device_address: string;
  timestamp?: string;
}

interface NotificationStore {
  alerts: Notification[];
  addAlert: (alert: Notification) => void;
  clearAlerts: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 10) })),
  clearAlerts: () => set({ alerts: [] }),
}));
