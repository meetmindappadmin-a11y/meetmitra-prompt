import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Entry, Profile } from '@shared/types';
import { storage } from '../lib/storage';

interface AppState {
  profile: Profile | null;
  entries: Entry[];
  hasOnboarded: boolean;
  saveProfile: (profile: Profile) => void;
  addEntry: (entry: Entry) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => storage.loadProfile());
  const [entries, setEntries] = useState<Entry[]>(() => storage.loadEntries());

  // Persist locally whenever state changes (privacy-first: never leaves device).
  useEffect(() => {
    if (profile) storage.saveProfile(profile);
  }, [profile]);
  useEffect(() => {
    storage.saveEntries(entries);
  }, [entries]);

  const value = useMemo<AppState>(
    () => ({
      profile,
      entries,
      hasOnboarded: Boolean(profile?.consentedAt),
      saveProfile: (p) => setProfile(p),
      addEntry: (e) => setEntries((prev) => [...prev, e]),
      resetAll: () => {
        storage.clearAll();
        setProfile(null);
        setEntries([]);
      },
    }),
    [profile, entries],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
