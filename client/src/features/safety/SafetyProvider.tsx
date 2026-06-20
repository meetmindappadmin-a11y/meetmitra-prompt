import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { CrisisCard } from './CrisisCard';

interface SafetyState {
  /** Open the help/resources card (user-initiated). */
  openHelp: () => void;
  /** Surface the card because a crisis signal was detected. */
  flagCrisis: () => void;
}

const SafetyContext = createContext<SafetyState | null>(null);

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [reason, setReason] = useState<'help' | 'crisis' | null>(null);

  const value = useMemo<SafetyState>(
    () => ({
      openHelp: () => setReason('help'),
      flagCrisis: () => setReason('crisis'),
    }),
    [],
  );

  return (
    <SafetyContext.Provider value={value}>
      {children}
      {reason && <CrisisCard reason={reason} onClose={() => setReason(null)} />}
    </SafetyContext.Provider>
  );
}

export function useSafety(): SafetyState {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used within a SafetyProvider');
  return ctx;
}
