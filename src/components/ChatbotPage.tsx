import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, RefreshCw, Copy, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Message = { id: string; role: 'user' | 'ai'; text: string };

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

interface ChatbotPageProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentColor?: string;
  systemContext: string;
  starterPrompts: string[];
  /** Optional sidebar content (rendered above chat input context) */
  sidebar?: ReactNode;
  /** When saving to Supabase, extra fields */
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const primaryColor = accentColor || 'var(--color-primary)';
  const primaryLight = accentColor === 'var(--color-accent)'
    ? 'var(--color-accent-light)'
    : 'var(--color-primary-light)';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function reset() {
    setMessages([]);
    setConvId(null);
    setInput('');
  }

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    const userMsg: Message = { id: genId(), role: 'user', text };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    const query = [systemContext, `User_Message: ${text}`].join('\n');

    try {
      const { content, conversation_id } = await callCoze(query, convId);
      setConvId(conversation_id);
      setMessages((p) => [...p, { id: genId(), role: 'ai', text: content }]);

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
    } catch (err: any) {
      setMessages((p) => [...p, {
        id: genId(),
        role: 'ai',
        text: err?.message ?? 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
      }]);
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
    // Split on code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
            return (
              <pre
                key={idx}
                className="text-xs p-3 overflow-x-auto font-mono-code leading-relaxed"
                style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              >
                {code}
              </pre>
            );
          }
          // Bold + line breaks
          const lines = part.split('\n').filter((l) => l !== undefined);
          return (
            <div key={idx}>
              {lines.map((line, li) => {
                const boldified = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
                return line.trim() ? (
                  <p
                    key={li}
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: boldified }}
                  />
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
      className="flex flex-col"
      style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Page header */}
      <div
        className="border-b py-5"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/ai-tools')}
            className="flex items-center gap-1.5 text-sm mb-4 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={13} />
            Công Cụ AI
          </button>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-9 flex-shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: primaryLight,
                  clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))',
                }}
              >
                {icon}
              </div>
              <div>
                <h1
                  className="font-display font-bold text-xl sm:text-2xl leading-tight"
                  style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
                >
                  {title}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Online indicator */}
              <div className="hidden sm:flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 animate-pulse-dot"
                  style={{ backgroundColor: 'var(--color-success)', borderRadius: '50%' }}
                />
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Online</span>
              </div>

              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 btn-ghost text-sm"
                title="Cuộc trò chuyện mới"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">Cuộc trò chuyện mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6 gap-6">

        {/* Optional sidebar */}
        {sidebar && (
          <aside
            className="hidden lg:block w-72 flex-shrink-0 border self-start"
            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            {sidebar}
          </aside>
        )}

        {/* Chat */}
        <div
          className="flex-1 flex flex-col min-w-0 border"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide" style={{ minHeight: '300px', maxHeight: 'calc(100vh - 280px)' }}>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-12 space-y-6">
                <div
                  className="w-16 h-14 flex items-center justify-center opacity-60"
                  style={{
                    backgroundColor: primaryLight,
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}
                >
                  {icon}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Hãy bắt đầu bằng một câu hỏi
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>hoặc thử các gợi ý bên dưới</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {starterPrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setInput(p)}
                      className="text-xs px-3 py-2 border transition-colors text-left"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-muted)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.color = 'var(--color-text)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] sm:max-w-[78%] px-4 py-3 text-sm leading-relaxed relative group"
                  style={
                    msg.role === 'user'
                      ? { backgroundColor: primaryColor, color: '#ffffff' }
                      : {
                          backgroundColor: 'var(--color-bg-muted)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)',
                        }
                  }
                >
                  {msg.role === 'user'
                    ? <p className="whitespace-pre-wrap">{msg.text}</p>
                    : formatAiText(msg.text)
                  }
                  {msg.role === 'ai' && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                    >
                      {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 px-4 py-3"
                  style={{ backgroundColor: 'var(--color-bg-muted)', border: '1px solid var(--color-border)' }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="typing-dot w-1.5 h-1.5"
                      style={{ backgroundColor: primaryColor, borderRadius: '50%', animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div
            className="p-4 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
                rows={1}
                className="flex-1 input-field resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor, color: '#ffffff' }}
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-light)' }}>
              AI có thể mắc lỗi. Hãy tư duy phê phán và kiểm chứng thông tin quan trọng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
