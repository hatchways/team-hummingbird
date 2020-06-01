import { createContext, useContext } from "react";

export const AuthContext = createContext();
export const NotificationContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function useNotification() {
  return useContext(NotificationContext);
}
