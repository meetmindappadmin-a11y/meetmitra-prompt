import type { ChatMessage, Entry, Profile } from '@shared/types';

// Local-first persistence. Everything stays on this device — that's the privacy
// guarantee we make to students, and why no account/auth is needed.

const KEYS = {
  profile: 'mindmitra.profile.v1',
  entries: 'mindmitra.entries.v1',
  chat: 'mindmitra.chat.v1',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode / quota). Fail silently — the
    // app still works in-memory for this session.
  }
}

export const storage = {
  loadProfile(): Profile | null {
    return read<Profile | null>(KEYS.profile, null);
  },
  saveProfile(profile: Profile): void {
    write(KEYS.profile, profile);
  },
  loadEntries(): Entry[] {
    return read<Entry[]>(KEYS.entries, []);
  },
  saveEntries(entries: Entry[]): void {
    write(KEYS.entries, entries);
  },
  loadChat(): ChatMessage[] {
    return read<ChatMessage[]>(KEYS.chat, []);
  },
  saveChat(messages: ChatMessage[]): void {
    write(KEYS.chat, messages);
  },
  clearAll(): void {
    for (const key of Object.values(KEYS)) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  },
};
