"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ConsultationContextValue = {
  isOpen: boolean;
  openConsultation: () => void;
  closeConsultation: () => void;
};

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openConsultation = useCallback(() => setIsOpen(true), []);
  const closeConsultation = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openConsultation, closeConsultation }),
    [isOpen, openConsultation, closeConsultation],
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) {
    throw new Error("useConsultation must be used within ConsultationProvider");
  }
  return ctx;
}
