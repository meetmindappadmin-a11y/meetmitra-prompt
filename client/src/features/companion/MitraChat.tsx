import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ChatMessage, ChatRequest, Mood } from '@shared/types';
import { useApp } from '../../context/AppContext';
import { useSafety } from '../safety/SafetyProvider';
import { analyzeEntry, streamChat } from '../../lib/api';
import { storage } from '../../lib/storage';
import { createEntry } from '../../lib/entry';
import { buildRecentContext } from '../../lib/insights';
import { examContext } from '../../lib/exam';
import { clientCrisisRisk } from '../../lib/crisis';
import { MitraAvatar } from '../../components/MitraAvatar';

function openingLine(name: string, countdown: string | null, hasHistory: boolean): string {
  if (!hasHistory) {
    return `Hey ${name}. I'm really glad you're here. Whatever today has been like, you can just say it plainly — I'm listening.`;
  }
  return `Hey ${name}.${countdown ? ` ${countdown}.` : ''} How are you holding up right now? Say it however it comes.`;
}

export function MitraChat() {
  const { profile, entries, addEntry } = useApp();
  const { flagCrisis } = useSafety();
  const navigate = useNavigate();
  const location = useLocation();
  const checkinMood = ((location.state as { mood?: Mood } | null)?.mood ?? 3) as Mood;

  const name = profile?.name ?? 'friend';
  const countdown = examContext(profile?.exam ?? null, profile?.examDate ?? null).countdown;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = storage.loadChat();
    if (saved.length > 0) return saved;
    return [{ role: 'assistant', content: openingLine(name, countdown, false) }];
  });
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const createdEntry = useRef(false);

  const recentContext = useMemo(() => buildRecentContext(entries), [entries]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streaming]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');

    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    storage.saveChat(next);

    if (clientCrisisRisk(text)) flagCrisis();

    // The first thing the student types this session becomes an analysed entry,
    // so talking to Mitra also feeds the Insight Engine.
    if (!createdEntry.current) {
      createdEntry.current = true;
      analyzeEntry({ text, mood: checkinMood, exam: profile?.exam ?? null }).then((res) => {
        addEntry(createEntry(checkinMood, text, 'talk', res?.analysis ?? null));
        if (res?.analysis.riskLevel === 'elevated') flagCrisis();
      });
    }

    // Anthropic requires the first message to be from the user — drop the seeded greeting.
    const apiMessages = [...next];
    while (apiMessages.length && apiMessages[0]!.role === 'assistant') apiMessages.shift();

    const req: ChatRequest = {
      messages: apiMessages,
      profile: {
        name,
        exam: profile?.exam ?? null,
        examDate: profile?.examDate ?? null,
      },
      recentContext,
    };

    setSending(true);
    setStreaming('');
    try {
      let acc = '';
      await streamChat(req, (delta) => {
        acc += delta;
        setStreaming(acc);
      });
      const done: ChatMessage[] = [...next, { role: 'assistant', content: acc }];
      setMessages(done);
      storage.saveChat(done);
    } catch {
      const fallback =
        "I'm having a little trouble connecting, but I'm still here with you. Want to tell me more, or take a breathing minute together?";
      const done: ChatMessage[] = [...next, { role: 'assistant', content: fallback }];
      setMessages(done);
      storage.saveChat(done);
    } finally {
      setSending(false);
      setStreaming(null);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-line bg-surface/85 px-3 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-lg px-2 py-1 text-sm text-muted transition hover:text-ink"
          aria-label="Back to Today"
        >
          ‹ Today
        </button>
        <MitraAvatar size={34} />
        <div className="min-w-0 leading-tight">
          <div className="font-display text-[15px] font-semibold text-ink">Mitra</div>
          <div className="text-[11px] text-muted">Here with you</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {streaming !== null &&
          (streaming === '' ? <TypingBubble /> : <ChatBubble role="assistant" content={streaming} />)}
      </div>

      <form
        className="flex shrink-0 items-end gap-2 border-t border-line bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="Tell Mitra anything…"
          aria-label="Message to Mitra"
          className="max-h-32 flex-1 resize-none rounded-2xl border border-line bg-surface-2 px-4 py-2.5 text-[15px] text-ink outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label="Send"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-grad-primary text-primary-ink shadow-soft transition hover:brightness-[1.04] disabled:opacity-40 disabled:shadow-none"
        >
          ↑
        </button>
      </form>
    </div>
  );
}

function ChatBubble({ role, content }: ChatMessage) {
  const isMitra = role === 'assistant';
  return (
    <div className={`flex items-end gap-2 ${isMitra ? 'justify-start' : 'justify-end'}`}>
      {isMitra && <MitraAvatar size={26} />}
      <div
        className={`max-w-[82%] animate-rise whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isMitra
            ? 'rounded-bl-md border border-line bg-surface text-ink shadow-soft'
            : 'rounded-br-md bg-grad-primary text-primary-ink'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

// Mirrors the onboarding typing indicator so Mitra "thinks" before the first token.
function TypingBubble() {
  return (
    <div className="flex items-end gap-2" aria-live="polite" aria-label="Mitra is typing">
      <MitraAvatar size={26} />
      <div className="rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-muted shadow-soft">
        <span className="inline-flex gap-1">
          <Dot /> <Dot /> <Dot />
        </span>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />;
}
