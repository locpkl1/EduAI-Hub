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
  ChevronRight,
  Copy,
  TrendingUp,
  Users,
  BarChart2,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ─────────────────────────────────────────────────────── data ── */

const stats = [
  { value: '3', label: 'Chatbot AI chuyên biệt' },
  { value: '50+', label: 'Prompt mẫu chất lượng' },
  { value: '3', label: 'Bộ sách giáo khoa' },
  { value: '∞', label: 'Tiềm năng học tập' },
];

const chartData = [
  { name: 'T2', prompts: 3, hoc: 45 },
  { name: 'T3', prompts: 7, hoc: 60 },
  { name: 'T4', prompts: 5, hoc: 52 },
  { name: 'T5', prompts: 12, hoc: 78 },
  { name: 'T6', prompts: 9, hoc: 85 },
  { name: 'T7', prompts: 15, hoc: 90 },
  { name: 'CN', prompts: 11, hoc: 72 },
];

const previewLessons = [
  {
    title: 'Cách biến AI thành gia sư cá nhân',
    tag: 'Chiến lược',
    tagColor: '#4d9eff',
    desc: 'Thiết lập vai trò cho AI, đặt câu hỏi liên tục và xây dựng phiên học hiệu quả.',
    readTime: '5 phút',
  },
  {
    title: 'Học tiếng Anh với AI — từ A đến Z',
    tag: 'Tiếng Anh',
    tagColor: '#a78bfa',
    desc: 'Từ luyện nói với AI đến ôn grammar, viết luận và mở rộng vốn từ tự nhiên.',
    readTime: '8 phút',
  },
  {
    title: 'Những lỗi sai thường gặp khi dùng AI học tập',
    tag: 'Kinh nghiệm',
    tagColor: '#fb923c',
    desc: 'Copy paste, tin tuyệt đối, hỏi quá mơ hồ — và cách khắc phục từng lỗi.',
    readTime: '6 phút',
  },
];

/* ─────────────────────────────────────────────── main component ── */

export default function LandingPage() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div>
      {/* ══════════════════════════════════════════════ HERO ══ */}
      <section className="relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        {/* Ambient glow orbs */}
        <div
          className="pointer-events-none absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(100px)' }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 bg-grid opacity-30"
          style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left copy */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Headline */}
              <div className="space-y-2">
                <h1
                  className="font-display font-bold leading-[1.05] text-balance"
                  style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
                >
                  Học thông minh
                </h1>
                <h1
                  className="font-display font-bold leading-[1.05]"
                  style={{
                    fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #34d399 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  cùng AI
                </h1>
                <h1
                  className="font-display font-bold leading-[1.05] text-balance"
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    letterSpacing: '-0.02em',
                    color: 'var(--color-text-light)',
                  }}
                >
                  không phải nhờ AI
                </h1>
              </div>

              <p className="text-base sm:text-lg leading-relaxed max-w-lg text-pretty" style={{ color: 'var(--color-text-muted)' }}>
                Edu-AI Hub dạy học sinh Việt Nam cách{' '}
                <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>giao tiếp với AI</strong>,
                đặt prompt hiệu quả, kiểm chứng thông tin và biến AI thành công cụ tự học chủ động.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 items-center">
                <Link to="/ai-tools" className="group relative overflow-hidden btn-primary flex items-center gap-2">
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                  />
                  Khám phá Công Cụ AI
                  <ArrowRight size={15} />
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
                    <ChevronRight size={15} />
                  </Link>
                )}
              </div>

              {/* Trusted by */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  {['#3b82f6', '#a78bfa', '#34d399', '#fb923c'].map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: c, borderColor: 'var(--color-bg)', zIndex: 4 - i }}
                    >
                      {['HS', 'LH', 'MT', 'KT'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Dành riêng cho học sinh lớp 10–12 Việt Nam
                </span>
              </div>
            </div>

            {/* Right — Hero terminal mockup */}
            <div className="relative hidden lg:flex items-center justify-center">
              <HeroTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ STATS ══ */}
      <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'var(--color-border)' }}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-6 px-4 text-center"
                style={{ background: 'var(--color-bg)' }}
              >
                <p
                  className="font-display font-bold"
                  style={{ fontSize: '2.2rem', letterSpacing: '-0.04em', color: 'var(--color-primary)' }}
                >
                  {s.value}
                </p>
                <p className="text-xs mt-1 text-pretty" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ BENTO FEATURES ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-primary)' }}>
              Tại sao chọn Edu-AI Hub
            </p>
            <h2
              className="font-display font-bold text-balance"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
            >
              Nền tảng học AI đầu tiên
              <br />
              <span style={{ color: 'var(--color-primary)' }}>dành riêng cho học sinh Việt</span>
            </h2>
          </div>
          <Link to="/guides" className="btn-outline flex-shrink-0 flex items-center gap-2 text-sm self-start sm:self-auto">
            Xem hướng dẫn <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-auto">

          {/* Large card — spans 2 cols on lg */}
          <BentoCard className="lg:col-span-2" accent="#3b82f6">
            <div className="flex flex-col h-full gap-4">
              <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                <Brain size={20} color="#3b82f6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl mb-2" style={{ letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
                  Học cách dùng AI
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Không chỉ dùng AI để trả lời — mà dạy bạn giao tiếp với AI hiệu quả, xây dựng tư duy đặt câu hỏi và kiểm chứng kết quả.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#3b82f6' }}>
                Bắt đầu học <ArrowRight size={14} />
              </div>
            </div>
          </BentoCard>

          {/* Small card */}
          <BentoCard accent="#a78bfa">
            <div className="w-9 h-9 flex items-center justify-center mb-4" style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)' }}>
              <Target size={18} color="#a78bfa" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2" style={{ letterSpacing: '-0.02em', color: 'var(--color-text)' }}>Prompt chính xác</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Tạo và lưu trữ các prompt học tập được tối ưu theo từng môn, từng mục tiêu cụ thể.
            </p>
          </BentoCard>

          {/* Small card */}
          <BentoCard accent="#34d399">
            <div className="w-9 h-9 flex items-center justify-center mb-4" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}>
              <Shield size={18} color="#34d399" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2" style={{ letterSpacing: '-0.02em', color: 'var(--color-text)' }}>Học có trách nhiệm</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Hiểu giới hạn của AI, kiểm chứng thông tin và không phụ thuộc vào máy móc.
            </p>
          </BentoCard>

          {/* Large card — spans 2 cols on lg */}
          <BentoCard className="lg:col-span-2" accent="#fb923c">
            <div className="flex flex-col sm:flex-row gap-6 h-full">
              <div className="flex-1 space-y-3">
                <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)' }}>
                  <Zap size={18} color="#fb923c" />
                </div>
                <h3 className="font-display font-bold text-xl" style={{ letterSpacing: '-0.02em', color: 'var(--color-text)' }}>Tiết kiệm thời gian học</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Chatbot tích hợp giúp bạn luyện tập, đặt câu hỏi và nhận phản hồi ngay lập tức — không cần rời khỏi trang.
                </p>
              </div>
              {/* Mini chart decoration */}
              <div className="hidden sm:flex flex-col justify-center w-40 h-24 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ogradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="hoc" stroke="#fb923c" strokeWidth={2} fill="url(#ogradient)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-[10px] text-center mt-1" style={{ color: 'var(--color-text-light)' }}>Năng suất học / tuần</p>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* ══════════════════════════════ AI TOOLS — only 3 chatbots ══ */}
      <section style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Copy */}
            <div className="space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>
                Công Cụ AI
              </p>
              <h2
                className="font-display font-bold text-balance"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
              >
                Ba chatbot AI
                <br />
                <span style={{ color: 'var(--color-primary)' }}>chuyên biệt cho học sinh</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Mỗi chatbot được thiết kế cho một mục đích cụ thể — từ học cách dùng AI, tạo prompt học tập, đến tạo prompt đa dụng cho mọi tình huống.
              </p>
              <Link to="/ai-tools" className="btn-primary inline-flex items-center gap-2">
                Xem tất cả công cụ <ArrowRight size={15} />
              </Link>
            </div>

            {/* 3 chatbot cards */}
            <div className="space-y-3">
              {[
                {
                  icon: MessageSquare,
                  title: 'Chatbot Hướng Dẫn AI',
                  desc: 'Học cách dùng AI đúng cách, tránh lỗi thường gặp và xây dựng tư duy AI.',
                  to: '/ai-tools/huong-dan-ai',
                  accent: '#3b82f6',
                  num: '01',
                },
                {
                  icon: Sparkles,
                  title: 'Chatbot Tạo Prompt Học Tập',
                  desc: 'Tạo prompt học tập chuyên biệt theo môn học, lớp và mục tiêu cụ thể.',
                  to: '/ai-tools/prompt-hoc-tap',
                  accent: '#a78bfa',
                  num: '02',
                },
                {
                  icon: Layers,
                  title: 'Chatbot Tạo Prompt Đa Dụng',
                  desc: 'Chat tự do, tạo prompt cho mọi tình huống — viết lách, công việc, sáng tạo.',
                  to: '/ai-tools/prompt-da-dung',
                  accent: '#34d399',
                  num: '03',
                },
              ].map((tool) => (
                <ChatbotEntryCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ DASHBOARD PREVIEW ══ */}
      <section style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-primary)' }}>
              Dashboard học tập
            </p>
            <h2
              className="font-display font-bold text-balance"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
            >
              Theo dõi tiến trình
              <br />
              <span style={{ color: 'var(--color-primary)' }}>học tập của bạn</span>
            </h2>
          </div>

          <DashboardPreview />
        </div>
      </section>

      {/* ════════════════════════════════════════ LESSONS PREVIEW ══ */}
      <section style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-primary)' }}>
                Bài Học nổi bật
              </p>
              <h2
                className="font-display font-bold text-balance"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
              >
                Học từ kinh nghiệm
                <br />
                <span style={{ color: 'var(--color-primary)' }}>dùng AI thực tế</span>
              </h2>
            </div>
            <Link to="/lessons" className="btn-outline flex-shrink-0 flex items-center gap-2 text-sm">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewLessons.map((l) => (
              <LessonCard key={l.title} {...l} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ CTA ══ */}
      <section style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div
            className="relative overflow-hidden px-8 py-16 sm:px-16 sm:py-20 text-center"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, var(--color-bg-card)) 0%, var(--color-bg-card) 60%)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 30%, var(--color-border))',
            }}
          >
            {/* Ambient orb */}
            <div
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />
            <div className="relative space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>
                Bắt đầu ngay hôm nay
              </p>
              <h2
                className="font-display font-bold text-balance"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: 'var(--color-text)' }}
              >
                Bắt đầu hành trình học
                <br />
                <span style={{ color: 'var(--color-primary)' }}>thông minh cùng AI</span>
              </h2>
              <p className="max-w-lg mx-auto text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Hoàn toàn miễn phí. Không cần cài đặt. Dành cho học sinh lớp 10–12 Việt Nam.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/ai-tools" className="group relative overflow-hidden btn-primary flex items-center gap-2">
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                  />
                  Bắt đầu học với AI
                  <ArrowRight size={15} />
                </Link>
                <Link to="/guides" className="btn-outline flex items-center gap-2">
                  Đọc Hướng Dẫn
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────── sub-components ── */

function BentoCard({ children, className = '', accent }: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`relative p-6 transition-all duration-200 group ${className}`}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accent ?? 'var(--color-primary)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${accent ?? 'var(--color-primary)'}22, 0 8px 32px -8px ${accent ?? 'var(--color-primary)'}33`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
}

function ChatbotEntryCard({ icon: Icon, title, desc, to, accent, num }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  to: string;
  accent: string;
  num: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-5 p-5 transition-all duration-200"
      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accent;
        (e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, ${accent} 4%, var(--color-bg))`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
        (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)';
      }}
    >
      <div
        className="flex-shrink-0 font-mono font-bold text-2xl w-12 text-right leading-none"
        style={{ color: `color-mix(in srgb, ${accent} 30%, var(--color-border))`, letterSpacing: '-0.04em' }}
      >
        {num}
      </div>
      <div
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
        style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)` }}
      >
        <Icon size={18} color={accent} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-text)' }}>{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      </div>
      <ArrowRight size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }} />
    </Link>
  );
}

function LessonCard({ title, tag, tagColor, desc, readTime }: {
  title: string;
  tag: string;
  tagColor: string;
  desc: string;
  readTime: string;
}) {
  return (
    <Link
      to="/lessons"
      className="flex flex-col gap-4 p-6 transition-all duration-200 group"
      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = tagColor;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1"
          style={{ color: tagColor, background: `color-mix(in srgb, ${tagColor} 12%, transparent)` }}
        >
          {tag}
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-light)' }}>{readTime}</span>
      </div>
      <h3 className="font-display font-bold leading-snug text-balance" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{title}</h3>
      <p className="text-sm leading-relaxed flex-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      <div className="flex items-center gap-1 text-sm font-medium" style={{ color: tagColor }}>
        Đọc tiếp <ChevronRight size={13} />
      </div>
    </Link>
  );
}

function HeroTerminal() {
  const messages = [
    { role: 'user', text: 'Giúp tôi tạo prompt ôn Toán lớp 12 — tích phân' },
    {
      role: 'ai',
      text: 'Đây là prompt tối ưu:\n\n"Tôi là HS lớp 12, ôn tích phân. Cho tôi 3 công thức cơ bản, 1 ví dụ mỗi công thức và 2 bài tập mức trung bình."',
    },
    { role: 'user', text: 'Vì sao prompt này hiệu quả hơn?' },
    {
      role: 'ai',
      text: 'Vì có đủ 4 yếu tố:\n→ Ngữ cảnh  → Mục tiêu\n→ Định dạng  → Độ khó\nAI sẽ biết chính xác bạn cần gì.',
    },
  ];

  return (
    <div
      className="w-full max-w-[480px] overflow-hidden shadow-2xl"
      style={{
        background: 'color-mix(in srgb, var(--color-bg-card) 80%, transparent)',
        border: '1px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-border))',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 0 1px color-mix(in srgb, var(--color-primary) 10%, transparent), 0 32px 80px -16px rgba(0,0,0,0.4), 0 0 80px -20px color-mix(in srgb, var(--color-primary) 20%, transparent)',
        transform: 'perspective(1200px) rotateY(-6deg) rotateX(2deg)',
      }}
    >
      {/* Terminal title bar */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}
      >
        <div className="flex gap-1.5">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex-1 mx-4 h-5 flex items-center justify-center rounded text-[10px] font-mono"
          style={{ background: 'var(--color-bg)', color: 'var(--color-text-light)', border: '1px solid var(--color-border)' }}>
          chatbot.hướng-dẫn-ai
        </div>
        <Brain size={12} style={{ color: 'var(--color-primary)' }} />
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 max-h-72 overflow-hidden">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }}
              >
                <Brain size={10} style={{ color: 'var(--color-primary)' }} />
              </div>
            )}
            <div
              className="max-w-[82%] px-3 py-2.5 text-xs leading-relaxed whitespace-pre-line"
              style={
                msg.role === 'user'
                  ? {
                      background: 'var(--color-primary)',
                      color: '#fff',
                      borderRadius: '8px 8px 2px 8px',
                    }
                  : {
                      background: 'var(--color-bg-muted)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '2px 8px 8px 8px',
                    }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* Typing */}
        <div className="flex justify-start items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }}>
            <Brain size={10} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div
            className="flex items-center gap-1 px-3 py-2 rounded-lg"
            style={{ background: 'var(--color-bg-muted)', border: '1px solid var(--color-border)' }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="typing-dot w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}
      >
        <div
          className="flex-1 h-9 px-3 flex items-center text-xs font-mono gap-2"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid color-mix(in srgb, var(--color-primary) 40%, var(--color-border))',
            color: 'var(--color-text-light)',
            boxShadow: '0 0 12px -4px color-mix(in srgb, var(--color-primary) 20%, transparent)',
          }}
        >
          <span style={{ color: 'var(--color-primary)' }}>›</span>
          Hỏi về cách dùng AI...
        </div>
        <div
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          <ArrowRight size={14} color="#fff" />
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}
    >
      {/* Dashboard header bar */}
      <div
        className="px-6 py-4 flex items-center justify-between gap-4"
        style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}
      >
        <div className="flex items-center gap-2">
          <BarChart2 size={14} style={{ color: 'var(--color-primary)' }} />
          <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-text)' }}>Dashboard học tập</span>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: 'Tuần này', active: true },
            { label: 'Tháng này', active: false },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              className="text-xs font-medium px-3 py-1"
              style={{
                color: tab.active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: tab.active ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'transparent',
                border: tab.active ? '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)' : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Prompt đã tạo', value: '47', icon: Sparkles, color: '#a78bfa' },
            { label: 'Phiên chat', value: '23', icon: MessageSquare, color: '#3b82f6' },
            { label: 'Bài học đọc', value: '12', icon: BookOpen, color: '#34d399' },
            { label: 'Ngày liên tiếp', value: '7', icon: TrendingUp, color: '#fb923c' },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={13} color={s.color} />
                <span className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>{s.label}</span>
              </div>
              <p
                className="font-display font-bold text-2xl"
                style={{ color: s.color, letterSpacing: '-0.04em' }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Chart 1 */}
          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '16px' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>Năng suất học tập</p>
              <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>+18%</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--color-text-light)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 0,
                    fontSize: 11,
                    color: 'var(--color-text)',
                  }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 2' }}
                />
                <Area type="monotone" dataKey="hoc" stroke="#3b82f6" strokeWidth={2} fill="url(#grad1)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2 */}
          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '16px' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>Số Prompt đã tạo</p>
              <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>+32%</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--color-text-light)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 0,
                    fontSize: 11,
                    color: 'var(--color-text)',
                  }}
                  cursor={{ stroke: '#a78bfa', strokeWidth: 1, strokeDasharray: '4 2' }}
                />
                <Area type="monotone" dataKey="prompts" stroke="#a78bfa" strokeWidth={2} fill="url(#grad2)" dot={false} activeDot={{ r: 4, fill: '#a78bfa' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prompt sample */}
        <div
          className="mt-4 p-4 flex items-start gap-4"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-light)' }}>Prompt gần nhất</span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5"
                style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.1)' }}
              >
                Tiếng Anh
              </span>
            </div>
            <p
              className="text-xs leading-relaxed font-mono truncate"
              style={{ color: 'var(--color-text-muted)' }}
            >
              &ldquo;Bạn là giáo viên tiếng Anh. Giải thích 5 từ vựng Unit 3 — Environment...&rdquo;
            </p>
          </div>
          <button
            type="button"
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 transition-colors"
            style={{ color: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
          >
            <Copy size={11} /> Sao chép
          </button>
        </div>
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
