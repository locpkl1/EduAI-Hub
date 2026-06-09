import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowRight,
  Brain,
  Sparkles,
  BookOpen,
  MessageSquare,
  Target,
  Zap,
  Shield,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Copy,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Học cách dùng AI',
    desc: 'Không chỉ dùng AI để trả lời — mà dạy bạn giao tiếp với AI hiệu quả',
    color: 'primary',
  },
  {
    icon: Target,
    title: 'Prompt chính xác',
    desc: 'Tạo và lưu trữ các prompt học tập được tối ưu theo từng môn, từng mục tiêu',
    color: 'accent',
  },
  {
    icon: Shield,
    title: 'Học có trách nhiệm',
    desc: 'Hiểu giới hạn của AI, kiểm chứng thông tin và không phụ thuộc vào máy móc',
    color: 'success',
  },
  {
    icon: Zap,
    title: 'Tiết kiệm thời gian',
    desc: 'Công cụ AI tích hợp giúp tóm tắt, ôn tập, lập kế hoạch học nhanh hơn',
    color: 'warning',
  },
];

const previewLessons = [
  {
    title: 'Cách biến AI thành gia sư cá nhân',
    tag: 'Chiến lược',
    tagType: 'primary',
    desc: 'Thiết lập vai trò cho AI, đặt câu hỏi liên tục và xây dựng phiên học hiệu quả',
    readTime: '5 phút',
  },
  {
    title: 'Học tiếng Anh với AI — từ A đến Z',
    tag: 'Tiếng Anh',
    tagType: 'accent',
    desc: 'Từ luyện nói với AI đến ôn grammar, viết luận và mở rộng vốn từ tự nhiên',
    readTime: '8 phút',
  },
  {
    title: 'Những lỗi sai thường gặp khi dùng AI học tập',
    tag: 'Kinh nghiệm',
    tagType: 'warning',
    desc: 'Copy paste, tin tuyệt đối, hỏi quá mơ hồ — và cách khắc phục từng lỗi',
    readTime: '6 phút',
  },
];

const stats = [
  { value: '12+', label: 'Công cụ AI tích hợp' },
  { value: '50+', label: 'Prompt mẫu chất lượng' },
  { value: '3', label: 'Bộ sách giáo khoa' },
  { value: '∞', label: 'Tiềm năng học tập' },
];

export default function LandingPage() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 bg-grid opacity-40"
          style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left */}
            <div className="space-y-7 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <span className="section-label">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                  Dự án sáng tạo học sinh
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-balance">
                Học thông minh
                <br />
                <span style={{ color: 'var(--color-primary)' }}>cùng AI</span>
                <br />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75em' }}>
                  không phải nhờ AI
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed max-w-lg text-pretty" style={{ color: 'var(--color-text-muted)' }}>
                Edu-AI Hub dạy học sinh Việt Nam cách <strong style={{ color: 'var(--color-text)' }}>giao tiếp với AI</strong>,
                {' '}đặt prompt hiệu quả, kiểm chứng thông tin và biến AI thành công cụ tự học
                chủ động thay vì phụ thuộc máy móc.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/ai-tools" className="btn-primary flex items-center gap-2">
                  Khám phá Công Cụ AI
                  <ArrowRight size={16} />
                </Link>
                {!user ? (
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="btn-outline flex items-center gap-2"
                  >
                    <GoogleIcon />
                    Đăng nhập Google
                  </button>
                ) : (
                  <Link to="/lessons" className="btn-outline flex items-center gap-2">
                    Xem Bài Học
                    <ChevronRight size={16} />
                  </Link>
                )}
              </div>

              {/* External AI links */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thực hành tại:</span>
                <a
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  ChatGPT <ExternalLink size={10} />
                </a>
                <a
                  href="https://gemini.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Gemini <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Right — Mock UI */}
            <div className="relative hidden lg:block">
              <MockChatUI />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        className="border-y"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold font-mono" style={{ color: 'var(--color-primary)' }}>
                  {s.value}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">Tại sao chọn Edu-AI Hub</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-balance">
            Nền tảng học AI đầu tiên
            <br />
            <span style={{ color: 'var(--color-primary)' }}>dành riêng cho học sinh Việt</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS — asymmetric grid ── */}
      <section
        className="py-20 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <div>
              <span className="section-label mb-4 inline-flex">Cách hoạt động</span>
              <h2 className="text-3xl font-bold mt-4 mb-8 text-balance">
                Từ người dùng AI<br />thành người <span style={{ color: 'var(--color-primary)' }}>master AI</span>
              </h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Học cách đặt câu hỏi', desc: 'Hiểu cấu trúc prompt: vai trò, ngữ cảnh, mục tiêu, định dạng đầu ra' },
                  { step: '02', title: 'Thực hành với chatbot', desc: 'Dùng chatbot tích hợp để luyện tập, nhận phản hồi ngay lập tức' },
                  { step: '03', title: 'Lưu & chia sẻ prompt', desc: 'Xây dựng kho prompt cá nhân, tham khảo mẫu prompt chất lượng' },
                  { step: '04', title: 'Đọc bài học kinh nghiệm', desc: 'Học từ những chia sẻ thực tế về cách dùng AI hiệu quả' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
                      style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt preview card */}
            <div className="space-y-4">
              <MockPromptCard />
              <div className="grid grid-cols-2 gap-4">
                <MockMiniCard icon={BookOpen} title="Sách Giáo Khoa" desc="3 bộ sách, lớp 10–12" link="/textbooks" />
                <MockMiniCard icon={TrendingUp} title="Bài Học AI" desc="Kinh nghiệm thực tế" link="/lessons" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LESSONS PREVIEW ── */}
      <section
        className="py-20 border-t"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <span className="section-label mb-3 inline-flex">Bài Học nổi bật</span>
              <h2 className="text-3xl font-bold mt-3 text-balance">
                Học từ kinh nghiệm
                <br />
                <span style={{ color: 'var(--color-primary)' }}>dùng AI thực tế</span>
              </h2>
            </div>
            <Link
              to="/lessons"
              className="btn-outline flex items-center gap-2 flex-shrink-0 text-sm"
            >
              Xem tất cả
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {previewLessons.map((lesson) => (
              <LessonCard key={lesson.title} {...lesson} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TOOLS PREVIEW ── */}
      <section className="py-20 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label mb-4 inline-flex">Công Cụ AI</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4 text-balance">
              Trung tâm điều khiển học tập AI
            </h2>
            <p className="max-w-xl mx-auto text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Chatbot, trình tạo prompt, gợi ý kế hoạch học, tóm tắt tài liệu — tất cả trong một nơi
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { icon: MessageSquare, title: 'Chatbot Hướng Dẫn AI', desc: 'Học cách dùng AI đúng cách, tránh lỗi thường gặp', badge: 'Chatbot' },
              { icon: Sparkles, title: 'Chatbot Tạo Prompt', desc: 'Viết, cải thiện và giải thích prompt hiệu quả', badge: 'Chatbot' },
              { icon: Lightbulb, title: 'Tạo Prompt Học Tập', desc: 'Tạo prompt theo môn, lớp, mục tiêu cụ thể', badge: 'Công cụ' },
              { icon: Target, title: 'Gợi Ý Kế Hoạch Học', desc: 'Lập lịch học cá nhân hóa với AI hỗ trợ', badge: 'Công cụ' },
              { icon: BookOpen, title: 'Tóm Tắt Tài Liệu', desc: 'Rút gọn nội dung dài thành điểm chính cần nhớ', badge: 'Công cụ' },
              { icon: Brain, title: 'Hỏi Đáp Theo Môn', desc: 'Đặt câu hỏi và luyện tập theo từng môn học', badge: 'Công cụ' },
            ].map((tool) => (
              <ToolPreviewCard key={tool.title} {...tool} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/ai-tools" className="btn-primary inline-flex items-center gap-2">
              Xem tất cả Công Cụ AI
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="rounded-2xl p-10 sm:p-14 relative overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
          >
            {/* Background decoration */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <div className="relative">
              <span className="section-label mb-4 inline-flex">Bắt đầu ngay hôm nay</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-5 text-balance">
                Bắt đầu hành trình
                <br />
                <span style={{ color: 'var(--color-primary)' }}>học thông minh cùng AI</span>
              </h2>
              <p className="max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Hoàn toàn miễn phí. Không cần cài đặt. Dành cho học sinh lớp 10–12 Việt Nam.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/ai-tools" className="btn-primary flex items-center gap-2">
                  Bắt đầu học với AI
                  <ArrowRight size={16} />
                </Link>
                <Link to="/guides" className="btn-outline flex items-center gap-2">
                  Đọc Hướng Dẫn
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Sub-components ── */

function FeatureCard({ icon: Icon, title, desc, color }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
  };
  const bgMap: Record<string, string> = {
    primary: 'var(--color-primary-light)',
    accent: 'var(--color-accent-light)',
    success: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
    warning: 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
  };

  return (
    <div className="card-hover p-6 space-y-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: bgMap[color] }}
      >
        <Icon size={20} style={{ color: colorMap[color] }} />
      </div>
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      </div>
    </div>
  );
}

function LessonCard({ title, tag, tagType, desc, readTime }: {
  title: string;
  tag: string;
  tagType: string;
  desc: string;
  readTime: string;
}) {
  return (
    <Link to="/lessons" className="card-hover p-6 flex flex-col gap-3 block">
      <div className="flex items-center justify-between gap-2">
        <span className={`tag tag-${tagType}`}>{tag}</span>
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-light)' }}>{readTime}</span>
      </div>
      <h3 className="font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>{title}</h3>
      <p className="text-sm leading-relaxed flex-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
        Đọc tiếp <ChevronRight size={14} />
      </div>
    </Link>
  );
}

function ToolPreviewCard({ icon: Icon, title, desc, badge }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  badge: string;
}) {
  return (
    <Link to="/ai-tools" className="card-hover p-5 flex gap-4 block">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      >
        <Icon size={18} style={{ color: 'var(--color-primary)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{title}</h3>
          <span
            className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-light)', border: '1px solid var(--color-border)' }}
          >
            {badge}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      </div>
    </Link>
  );
}

function MockMiniCard({ icon: Icon, title, desc, link }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  link: string;
}) {
  return (
    <Link to={link} className="card-hover p-4 flex flex-col gap-2 block">
      <Icon size={18} style={{ color: 'var(--color-primary)' }} />
      <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{title}</p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
    </Link>
  );
}

function MockChatUI() {
  const messages = [
    { role: 'user', text: 'Giúp tôi ôn Toán lớp 12 — tích phân' },
    {
      role: 'ai',
      text: 'Tôi sẽ hướng dẫn bạn cách đặt prompt hiệu quả:\n\n"Tôi là HS lớp 12, ôn Tích phân — cho tôi 3 công thức cơ bản, 1 ví dụ mỗi công thức, sau đó cho 2 bài tập mức trung bình."',
    },
    { role: 'user', text: 'Vì sao prompt này hiệu quả hơn?' },
    { role: 'ai', text: 'Vì nó có: Ngữ cảnh (lớp 12), Mục tiêu (3 công thức), Định dạng (ví dụ + bài tập), Độ khó (trung bình). AI sẽ biết chính xác bạn cần gì.' },
  ];

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-card"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-3"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
        </div>
        <div className="flex items-center gap-2">
          <Brain size={14} style={{ color: 'var(--color-primary)' }} />
          <span className="text-xs font-medium font-mono" style={{ color: 'var(--color-text-muted)' }}>
            Chatbot Hướng Dẫn AI
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }
                  : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        <div className="flex justify-start">
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
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
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 border-t flex items-center gap-2"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div
          className="flex-1 h-8 rounded-lg px-3 flex items-center text-xs"
          style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-light)', border: '1px solid var(--color-border)' }}
        >
          Hỏi về cách dùng AI...
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <ArrowRight size={14} style={{ color: 'var(--color-bg)' }} />
        </div>
      </div>
    </div>
  );
}

function MockPromptCard() {
  return (
    <div
      className="rounded-xl border p-5 space-y-4"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-light)' }}>
          Prompt mẫu — Tiếng Anh
        </span>
        <span className="tag tag-primary">Học tập</span>
      </div>
      <div
        className="rounded-lg p-4 text-sm font-mono leading-relaxed"
        style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)', border: '1px dashed var(--color-border-strong)' }}
      >
        &ldquo;Bạn là giáo viên tiếng Anh. Tôi đang học Unit 3 — Environment. Hãy giải thích 5 từ vựng quan trọng theo cấu trúc: Từ → Nghĩa → Ví dụ câu. Dùng tiếng Việt để giải thích.&rdquo;
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="tag">Tiếng Anh</span>
          <span className="tag">Từ vựng</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)' }}
          onClick={() => navigator.clipboard.writeText('Bạn là giáo viên tiếng Anh...')}
        >
          <Copy size={12} /> Sao chép
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
