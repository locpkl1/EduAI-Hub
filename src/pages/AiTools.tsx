import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  MessageSquare,
  Target,
  BookOpen,
  Lightbulb,
  Send,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Info,
} from 'lucide-react';
import { grades, bookSeries, subjects } from '../data/educationData';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type ChatbotType = 'ai-guide' | 'prompt-guide';
type Message = { id: string; role: 'user' | 'ai'; text: string };

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

// ── Coze API call ──
type CozeApiResponse = { content?: string; conversation_id?: string; error?: string };

async function callCoze(message: string, conversationId?: string | null): Promise<{ content: string; conversation_id: string }> {
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

// ── Tool cards config ──
const tools = [
  {
    id: 'ai-guide',
    icon: Brain,
    title: 'Chatbot Hướng Dẫn Sử Dụng AI',
    desc: 'Học cách dùng AI đúng cách, tránh lỗi thường gặp và biến AI thành công cụ học tập chủ động',
    badge: 'Chatbot',
    badgeColor: 'primary',
    features: ['Giải thích AI là gì', 'Hướng dẫn học cùng AI', 'Cảnh báo lỗi thường gặp'],
    type: 'chatbot' as const,
  },
  {
    id: 'prompt-guide',
    icon: Sparkles,
    title: 'Chatbot Hướng Dẫn Tạo Prompt',
    desc: 'Học cách viết prompt hiệu quả, cải thiện prompt yếu và tạo mẫu prompt theo nhu cầu học tập',
    badge: 'Chatbot',
    badgeColor: 'primary',
    features: ['Sửa prompt yếu → mạnh', 'Tạo prompt theo môn học', 'Giải thích tại sao prompt hiệu quả'],
    type: 'chatbot' as const,
  },
  {
    id: 'prompt-creator',
    icon: Target,
    title: 'Tạo Prompt Học Tập',
    desc: 'Công cụ tạo prompt tối ưu theo môn học, lớp và mục tiêu cụ thể với AI Coze',
    badge: 'Công cụ',
    badgeColor: 'accent',
    features: ['Theo môn, lớp, bài học', 'Lưu vào kho prompt', 'Lịch sử tương tác'],
    type: 'link' as const,
    link: '/prompt-creator',
  },
  {
    id: 'plan',
    icon: Lightbulb,
    title: 'Gợi Ý Kế Hoạch Học',
    desc: 'Nhập môn học và thời gian, nhận kế hoạch ôn tập cá nhân hóa từ AI',
    badge: 'Công cụ',
    badgeColor: 'accent',
    features: ['Lịch ôn theo tuần', 'Phân bổ thời gian thông minh', 'Nhắc nhở lịch kiểm tra'],
    type: 'external' as const,
  },
  {
    id: 'summarize',
    icon: BookOpen,
    title: 'Tóm Tắt Tài Liệu',
    desc: 'Rút gọn nội dung dài thành điểm chính, từ khoá quan trọng và sơ đồ tư duy',
    badge: 'Công cụ',
    badgeColor: 'accent',
    features: ['Rút gọn theo chương', 'Danh sách điểm quan trọng', 'Gợi ý từ khoá ôn thi'],
    type: 'external' as const,
  },
  {
    id: 'qa',
    icon: MessageSquare,
    title: 'Hỏi Đáp Theo Môn Học',
    desc: 'Đặt câu hỏi và luyện tập theo từng môn với ngữ cảnh lớp học Việt Nam',
    badge: 'Công cụ',
    badgeColor: 'accent',
    features: ['12 môn học phổ thông', 'Lớp 10, 11, 12', 'Hỏi và kiểm tra kiến thức'],
    type: 'external' as const,
  },
];

const badgeColorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'var(--color-primary-light)', text: 'var(--color-primary)' },
  accent: { bg: 'var(--color-accent-light)', text: 'var(--color-accent)' },
};

export default function AiTools() {
  const [activeChatbot, setActiveChatbot] = useState<ChatbotType | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Page header */}
      <div
        className="border-b py-12"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-4 inline-flex">Công Cụ AI</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4 text-balance">
            Trung tâm điều khiển
            <br />
            <span style={{ color: 'var(--color-primary)' }}>học tập AI</span>
          </h1>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
            Chatbot, công cụ tạo prompt, hỏi đáp theo môn — tất cả được thiết kế để giúp bạn
            học thông minh hơn chứ không phải phụ thuộc vào AI.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tool grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isActive={activeChatbot === tool.id}
              onActivate={() => {
                if (tool.type === 'chatbot') {
                  setActiveChatbot(activeChatbot === tool.id ? null : tool.id as ChatbotType);
                }
              }}
            />
          ))}
        </div>

        {/* Chatbot panel */}
        {activeChatbot && (
          <ChatbotPanel
            type={activeChatbot}
            onClose={() => setActiveChatbot(null)}
          />
        )}

        {/* External AI links */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
              Thực hành trên nền tảng AI công cộng
            </h3>
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Sau khi học prompt tại đây, thực hành ngay với ChatGPT hoặc Gemini để trải nghiệm thực tế.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 text-sm"
            >
              Thử với ChatGPT <ExternalLink size={13} />
            </a>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 text-sm"
            >
              Thử với Gemini <ExternalLink size={13} />
            </a>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 text-sm"
            >
              Thử với Claude <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ToolCard ── */
function ToolCard({ tool, isActive, onActivate }: {
  tool: typeof tools[number];
  isActive: boolean;
  onActivate: () => void;
}) {
  const Icon = tool.icon;
  const badge = badgeColorMap[tool.badgeColor];

  const handleClick = () => {
    if (tool.type === 'chatbot') onActivate();
  };

  const content = (
    <div
      className="rounded-xl border p-6 flex flex-col gap-4 h-full transition-all duration-200"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
        cursor: tool.type === 'chatbot' ? 'pointer' : 'default',
        boxShadow: isActive ? '0 0 0 2px var(--color-primary-light)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-primary-light)' }}
        >
          <Icon size={20} style={{ color: 'var(--color-primary)' }} />
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {tool.badge}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold mb-2 leading-snug" style={{ color: 'var(--color-text)' }}>{tool.title}</h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>{tool.desc}</p>
        <ul className="space-y-1.5">
          {tool.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {tool.type === 'chatbot' && (
        <div
          className="flex items-center gap-2 text-sm font-semibold pt-2"
          style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
        >
          {isActive ? (
            <>Đang mở chatbot <ArrowRight size={14} /></>
          ) : (
            <>Mở chatbot <ArrowRight size={14} /></>
          )}
        </div>
      )}
    </div>
  );

  if (tool.type === 'link') {
    return <Link to={tool.link!} className="block">{content}</Link>;
  }
  if (tool.type === 'chatbot') {
    return <div onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>{content}</div>;
  }
  return (
    <a
      href={tool.id === 'plan' ? 'https://gemini.google.com' : 'https://chatgpt.com'}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {content}
    </a>
  );
}

/* ── ChatbotPanel ── */
function ChatbotPanel({ type, onClose }: { type: ChatbotType; onClose: () => void }) {
  const { user, isGuest } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const isPromptGuide = type === 'prompt-guide';

  const systemContext = isPromptGuide
    ? `Chatbot hướng dẫn tạo prompt hiệu quả. Người dùng là học sinh lớp ${selectedGrade}${selectedSubject ? `, môn ${selectedSubject}` : ''}.`
    : `Chatbot hướng dẫn sử dụng AI trong học tập. Giúp học sinh lớp ${selectedGrade} Việt Nam dùng AI đúng cách.`;

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { id: genId(), role: 'user', text: input };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    const query = [
      systemContext,
      `User_Message: ${input}`,
    ].join('\n');

    try {
      const { content, conversation_id } = await callCoze(query, convId);
      setConvId(conversation_id);
      const aiMsg: Message = { id: genId(), role: 'ai', text: content };
      setMessages((p) => [...p, aiMsg]);

      if (!isGuest && user) {
        await supabase.from('saved_prompts').insert({
          user_id: user.id,
          purpose: input.substring(0, 50),
          prompt_content: content,
          subject: selectedSubject || '',
          book_series: selectedBook || '',
          chapter: selectedGrade,
        }).catch(() => {});
      }
    } catch (err: any) {
      const errMsg: Message = { id: genId(), role: 'ai', text: err?.message ?? 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' };
      setMessages((p) => [...p, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function reset() {
    setMessages([]);
    setConvId(null);
    setInput('');
  }

  const starterPrompts = isPromptGuide
    ? [
        'Hãy sửa prompt này của tôi: "Giải thích tích phân"',
        'Tạo prompt để học từ vựng tiếng Anh Unit 3',
        'Giải thích tại sao cần thêm vai trò cho AI',
      ]
    : [
        'AI có thể sai không? Khi nào cần kiểm chứng?',
        'Cách học Toán hiệu quả với AI mà không phụ thuộc',
        'Hướng dẫn tôi ôn thi Lý lớp 12 với AI',
      ];

  return (
    <div
      className="rounded-2xl border mb-8 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-primary)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            {isPromptGuide
              ? <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
              : <Brain size={16} style={{ color: 'var(--color-primary)' }} />
            }
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              {isPromptGuide ? 'Chatbot Hướng Dẫn Tạo Prompt' : 'Chatbot Hướng Dẫn Sử Dụng AI'}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: 'var(--color-success)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Đang kết nối</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="p-2 rounded-lg hover:bg-bg-muted transition-colors"
            title="Chat mới"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-bg-muted transition-colors"
            style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Context selectors */}
      <div
        className="px-5 py-3 border-b flex flex-wrap gap-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-light)' }}>Lớp:</span>
          <div className="flex gap-1">
            {grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setSelectedGrade(g.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                style={
                  selectedGrade === g.value
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }
                    : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }
                }
              >
                {g.value}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-light)' }}>Môn:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field py-1.5 text-xs w-36"
          >
            <option value="">Tất cả môn</option>
            {subjects.map((s) => <option key={s.value} value={s.label}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-light)' }}>
              {isPromptGuide
                ? 'Tôi sẽ giúp bạn viết và cải thiện prompt hiệu quả hơn.'
                : 'Tôi sẽ hướng dẫn bạn cách sử dụng AI đúng cách trong học tập.'}
            </p>
            <p className="text-xs text-center" style={{ color: 'var(--color-text-light)' }}>Thử hỏi:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {starterPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setInput(p); }}
                  className="text-xs px-3 py-2 rounded-xl transition-colors hover:border-primary"
                  style={{
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-bg-muted)',
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
              className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group"
              style={
                msg.role === 'user'
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }
                  : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }
              }
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.role === 'ai' && (
                <button
                  type="button"
                  onClick={() => handleCopy(msg.text, msg.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                  style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                >
                  {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
              style={{ backgroundColor: 'var(--color-bg-muted)', border: '1px solid var(--color-border)' }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="typing-dot w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)', animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isPromptGuide ? 'Dán prompt cần cải thiện hoặc hỏi về cách viết prompt...' : 'Hỏi về cách dùng AI trong học tập...'}
            rows={2}
            className="input-field resize-none flex-1 text-sm"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-primary flex items-center justify-center px-4 self-end flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            Enter để gửi · Shift+Enter xuống dòng
          </p>
          <div className="flex gap-2">
            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: 'var(--color-text-light)' }}
            >
              ChatGPT <ExternalLink size={9} />
            </a>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: 'var(--color-text-light)' }}
            >
              Gemini <ExternalLink size={9} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
