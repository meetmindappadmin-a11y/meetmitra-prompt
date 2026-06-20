import { useEffect, useState } from 'react';
import {
  ConversationProvider,
  useConversationControls,
  useConversationInput,
  useConversationMode,
  useConversationStatus,
} from '@elevenlabs/react';
import { LoaderCircle, Mic, MicOff, PhoneOff, Sparkles, X } from 'lucide-react';
import { createVoiceSession } from '../../lib/api';
import { clientCrisisRisk } from '../../lib/crisis';
import { useSafety } from '../safety/SafetyProvider';
import { MitraAvatar } from '../../components/MitraAvatar';

interface TranscriptLine {
  role: 'user' | 'agent';
  text: string;
}

export function MitraVoiceAgent({ onClose }: { onClose: () => void }) {
  return (
    <ConversationProvider>
      <VoicePanel onClose={onClose} />
    </ConversationProvider>
  );
}

function VoicePanel({ onClose }: { onClose: () => void }) {
  const { flagCrisis } = useSafety();
  const { startSession, endSession } = useConversationControls();
  const { isMuted, setMuted } = useConversationInput();
  const { status, message: sdkError } = useConversationStatus();
  const { mode } = useConversationMode();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);

  const connected = status === 'connected';
  const busy = starting || status === 'connecting';

  useEffect(() => () => endSession(), [endSession]);

  async function begin() {
    if (busy || connected) return;
    setStarting(true);
    setError(null);
    try {
      const sessionPromise = createVoiceSession();
      const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
      permission.getTracks().forEach((track) => track.stop());
      const { signedUrl } = await sessionPromise;
      startSession({
        signedUrl,
        onMessage: ({ role, message }) => {
          if (role === 'user' && clientCrisisRisk(message)) flagCrisis();
          setTranscript((lines) => [...lines.slice(-7), { role, text: message }]);
        },
        onError: (message) => setError(message),
      });
    } catch (cause) {
      const denied = cause instanceof DOMException && cause.name === 'NotAllowedError';
      setError(
        denied
          ? 'Microphone access is needed for a voice conversation.'
          : cause instanceof Error
            ? cause.message
            : 'Could not start voice right now.',
      );
    } finally {
      setStarting(false);
    }
  }

  function close() {
    endSession();
    onClose();
  }

  const stateLabel = connected
    ? mode === 'speaking'
      ? 'Mitra is speaking'
      : isMuted
        ? 'Microphone muted'
        : 'Mitra is listening'
    : busy
      ? 'Connecting securely…'
      : 'Ready when you are';

  return (
    <section className="mx-4 mt-3 overflow-hidden rounded-3xl border border-primary/20 bg-surface shadow-lift sm:mx-6">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <MitraAvatar size={34} />
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              Voice with Mitra <Sparkles size={14} className="text-primary" />
            </div>
            <p className="text-[11px] text-muted" aria-live="polite">
              {stateLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink"
          aria-label="Close voice conversation"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-4 py-4">
        <div
          className={`mx-auto grid h-24 w-24 place-items-center rounded-full transition ${
            connected ? 'bg-primary-soft text-primary shadow-glow' : 'bg-surface-2 text-muted'
          }`}
          aria-hidden
        >
          {busy ? (
            <LoaderCircle size={34} className="animate-spin" />
          ) : connected && mode === 'speaking' ? (
            <span className="flex items-end gap-1">
              <VoiceBar height="h-4" />
              <VoiceBar height="h-8" />
              <VoiceBar height="h-6" />
              <VoiceBar height="h-9" />
              <VoiceBar height="h-5" />
            </span>
          ) : isMuted ? (
            <MicOff size={34} />
          ) : (
            <Mic size={34} />
          )}
        </div>

        {transcript.length > 0 && (
          <div className="mx-auto mt-4 max-h-28 max-w-xl space-y-1.5 overflow-y-auto rounded-2xl bg-surface-2 p-3">
            {transcript.map((line, index) => (
              <p key={`${index}-${line.text}`} className="text-xs leading-relaxed text-muted">
                <span className="font-semibold text-ink">{line.role === 'agent' ? 'Mitra' : 'You'}:</span>{' '}
                {line.text}
              </p>
            ))}
          </div>
        )}

        {(error || sdkError) && (
          <p className="mt-3 text-center text-sm text-danger" role="alert">
            {error || sdkError}
          </p>
        )}

        <div className="mt-4 flex justify-center gap-2">
          {!connected ? (
            <button
              type="button"
              onClick={begin}
              disabled={busy}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-grad-primary px-5 text-sm font-semibold text-primary-ink shadow-soft transition hover:brightness-[1.04] disabled:opacity-50"
            >
              {busy ? <LoaderCircle size={17} className="animate-spin" /> : <Mic size={17} />}
              Start voice
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMuted(!isMuted)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 text-sm font-semibold text-ink"
              >
                {isMuted ? <Mic size={17} /> : <MicOff size={17} />}
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                type="button"
                onClick={() => endSession()}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-white"
              >
                <PhoneOff size={17} /> End
              </button>
            </>
          )}
        </div>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
          Voice is processed by ElevenLabs. MindMitra is supportive, not medical care.
        </p>
      </div>
    </section>
  );
}

function VoiceBar({ height }: { height: string }) {
  return <span className={`w-1.5 animate-pulse rounded-full bg-primary ${height}`} />;
}
