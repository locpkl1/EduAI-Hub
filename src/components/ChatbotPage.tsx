import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Plus, MessageSquare, ArrowLeft, Copy, Check, ChevronRight, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

/* ─── Types ── */
type Message = { id: string; role: 'user' | 'ai'; text: string };
type ChatSession = { id: string; title: string; messages: Message[]; convId: string | null; createdAt: number };

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

type CozeApiResponse = { content?: string; conversation_id?: string; error?: string };

async function callCoze(
  message: string,
  conversationId?: string | null
): Promise<{ content: string; conversation_id: string }> {
  const res = await fetch('/api/coze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });
  const data = (await res.json().catch(() => ({}))) as CozeApiResponse;
  if (!res.ok) throw new Error(data.error ?? `API error ${res.status}`);
  if (!data.content || !data.conversation_id) throw new Error('Phản hồi không hợp lệ từ API');
  return { content: data.content, conversation_id: data.conversation_id };
}

export interface ChatbotPageProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentColor?: string;
  systemContext: string;
  starterPrompts: string[];
  sidebar?: ReactNode;
  saveSubject?: string;
  saveBookSeries?: string;
  saveChapter?: string;
}

export default function ChatbotPage({
  title,
  subtitle,
  icon,
  accentColor,
  systemContext,
  starterPrompts,
  sidebar,
  saveSubject = '',
  saveBookSeries = '',
  saveChapter = '',
}: ChatbotPageProps) {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const primaryColor = accentColor || 'var(--color-primary)';

  /* ─── Sessions (chat history) ── */
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [];
  const convId = activeSession?.convId ?? null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* Auto-resize textarea */
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [input]);

  function createNewSession() {
    const id = genId();
    const session: ChatSession = {
      id,
      title: 'Cuộc trò chuyện mới',
      messages: [],
      convId: null,
      createdAt: Date.now(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    setInput('');
  }

  function deleteSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSessionId(remaining[0]?.id ?? null);
    }
  }

  function updateSession(id: string, patch: Partial<ChatSession>) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const text = input.trim();

    /* Ensure a session exists */
    let sessionId = activeSessionId;
    if (!sessionId) {
      const id = genId();
      const session: ChatSession = {
        id,
        title: text.slice(0, 40),
        messages: [],
        convId: null,
        createdAt: Date.now(),
      };
      setSessions((prev) => [session, ...prev]);
      sessionId = id;
      setActiveSessionId(id);
    }

    const userMsg: Message = { id: genId(), role: 'user', text };
    updateSession(sessionId, {
      messages: [...(sessions.find((s) => s.id === sessionId)?.messages ?? []), userMsg],
      title: sessions.find((s) => s.id === sessionId)?.title === 'Cuộc trò chuyện mới' || !sessions.find((s) => s.id === sessionId)
        ? text.slice(0, 40)
        : sessions.find((s) => s.id === sessionId)!.title,
    });
    setInput('');
    setLoading(true);

    const currentConvId = sessions.find((s) => s.id === sessionId)?.convId ?? null;
    const query = [systemContext, `User_Message: ${text}`].join('\n');

    try {
      const { content, conversation_id } = await callCoze(query, currentConvId);
      const aiMsg: Message = { id: genId(), role: 'ai', text: content };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, convId: conversation_id, messages: [...s.messages, aiMsg] }
            : s
        )
      );
      if (!isGuest && user) {
        await supabase.from('saved_prompts').insert({
          user_id: user.id,
          purpose: text.substring(0, 80),
          prompt_content: content,
          subject: saveSubject,
          book_series: saveBookSeries,
          chapter: saveChapter,
        }).catch(() => {});
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.';
      const aiMsg: Message = { id: genId(), role: 'ai', text: errMsg };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, aiMsg] }
            : s
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatAiText(text: string): ReactNode {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
            return (
              <pre
                key={idx}
                className="text-xs p-3 overflow-x-auto font-mono-code leading-relaxed rounded-lg"
                style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              >
                {code}
              </pre>
            );
          }
          const lines = part.split('\n');
          return (
            <div key={idx}>
              {lines.map((line, li) => {
                const boldified = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
                return line.trim() ? (
                  <p key={li} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: boldified }} />
                ) : (
                  <br key={li} />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="flex"
      style={{ height: 'calc(100vh - 60px)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* ─── Left sidebar: chat history ── */}
      <aside
        className="flex-shrink-0 flex flex-col border-r transition-all duration-200"
        style={{
          width: sidebarOpen ? '260px' : '0px',
          overflow: 'hidden',
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
        }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            Lịch sử
          </span>
          <button
            type="button"
            onClick={createNewSession}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            title="Cuộc trò chuyện mới"
          >
            <Plus size={12} />
            Mới
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
          {sessions.length === 0 && (
            <p className="text-xs px-2 py-4 text-center" style={{ color: 'var(--color-text-light)' }}>
              Chưa có cuộc trò chuyện nào.
            </p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm"
              style={{
                backgroundColor: s.id === activeSessionId ? 'var(--color-bg-muted)' : 'transparent',
                color: s.id === activeSessionId ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
              onClick={() => setActiveSessionId(s.id)}
            >
              <MessageSquare size={13} className="flex-shrink-0 opacity-60" />
              <span className="flex-1 truncate text-xs font-medium">{s.title}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                style={{ color: 'var(--color-text-light)' }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ─── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
        >
          {/* Toggle sidebar */}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-muted)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
            title="Mở/đóng lịch sử"
          >
            <ChevronRight
              size={16}
              style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            />
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/ai-tools')}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-text)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Công Cụ AI</span>
          </button>

          <div className="w-px h-5 flex-shrink-0" style={{ backgroundColor: 'var(--color-border)' }} />

          {/* Icon + title */}
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{ backgroundColor: `color-mix(in srgb, ${accentColor ?? 'var(--color-primary)'} 15%, transparent)` }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>{title}</p>
            <p className="text-xs hidden sm:block truncate" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
          </div>

          {/* Online dot */}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: 'var(--color-success)' }} />
            <span className="text-xs hidden sm:block" style={{ color: 'var(--color-text-light)' }}>Online</span>
          </div>
        </div>

        {/* Optional context sidebar rendered above chat only on mobile */}
        {sidebar && (
          <div className="lg:hidden border-b px-4 py-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
            {sidebar}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Desktop context sidebar */}
          {sidebar && (
            <aside
              className="hidden lg:block w-64 flex-shrink-0 border-r overflow-y-auto"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
            >
              {sidebar}
            </aside>
          )}

          {/* Messages + input */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Messages scroll area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ backgroundColor: 'var(--color-bg)' }}>
              {messages.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-2xl mb-5"
                    style={{ backgroundColor: `color-mix(in srgb, ${accentColor ?? 'var(--color-primary)'} 12%, transparent)` }}
                  >
                    {icon}
                  </div>
                  <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--color-text)' }}>
                    {title}
                  </h3>
                  <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {subtitle}
                  </p>
                  {/* Starter chips */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {starterPrompts.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setInput(p)}
                        className="text-xs px-3.5 py-2 rounded-full border transition-all text-left"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-muted)',
                          backgroundColor: 'var(--color-bg-card)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = primaryColor;
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-muted)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-card)';
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* AI avatar */}
                      {msg.role === 'ai' && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `color-mix(in srgb, ${accentColor ?? 'var(--color-primary)'} 15%, transparent)` }}
                        >
                          <div style={{ transform: 'scale(0.65)' }}>{icon}</div>
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`relative group ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                        {msg.role === 'user'
                          ? <p className="whitespace-pre-wrap">{msg.text}</p>
                          : formatAiText(msg.text)
                        }
                        {msg.role === 'ai' && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="absolute -bottom-7 right-0 flex items-center gap-1 text-[11px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                          >
                            {copiedId === msg.id ? <><Check size={10} /> Đã sao chép</> : <><Copy size={10} /> Sao chép</>}
                          </button>
                        )}
                      </div>

                      {/* User avatar */}
                      {msg.role === 'user' && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          B
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `color-mix(in srgb, ${accentColor ?? 'var(--color-primary)'} 15%, transparent)` }}
                      >
                        <div style={{ transform: 'scale(0.65)' }}>{icon}</div>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-4 py-3"
                        style={{
                          backgroundColor: 'var(--color-bg-muted)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '4px var(--radius-chat) var(--radius-chat) var(--radius-chat)',
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="typing-dot w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: primaryColor, animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} className="h-4" />
                </div>
              )}
            </div>

            {/* Input bar */}
            <div
              className="flex-shrink-0 px-4 py-4 border-t"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
            >
              <div className="max-w-3xl mx-auto">
                <div
                  className="flex items-end gap-3 p-2 rounded-2xl border transition-all"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
                  onFocusCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = primaryColor;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px color-mix(in srgb, ${primaryColor} 10%, transparent)`;
                  }}
                  onBlurCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhắn tin... (Enter để gửi, Shift+Enter xuống dòng)"
                    rows={1}
                    className="flex-1 bg-transparent outline-none resize-none text-sm py-1.5 px-2"
                    style={{
                      color: 'var(--color-text)',
                      minHeight: '36px',
                      maxHeight: '160px',
                      lineHeight: '1.5',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="chat-send-btn flex-shrink-0"
                    style={{ backgroundColor: input.trim() && !loading ? primaryColor : 'var(--color-border)' }}
                    title="Gửi"
                  >
                    <Send size={14} />
                  </button>
                </div>
                <p className="text-[11px] mt-2 text-center" style={{ color: 'var(--color-text-light)' }}>
                  AI có thể mắc lỗi. Hãy tư duy phê phán và kiểm chứng thông tin quan trọng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
