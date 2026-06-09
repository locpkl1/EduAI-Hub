import { Link } from 'react-router-dom';
import { Brain, Sparkles, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';

const chatbots = [
  {
    id: 'ai-guide',
    href: '/ai-tools/huong-dan-ai',
    icon: Brain,
    number: '01',
    title: 'Chatbot Hướng Dẫn\nSử Dụng AI',
    desc: 'Học cách dùng AI đúng cách, tránh lỗi thường gặp và biến AI thành công cụ học tập chủ động — không phụ thuộc.',
    tags: ['AI cơ bản', 'Tư duy phê phán', 'Học chủ động'],
    accent: 'primary',
  },
  {
    id: 'prompt-study',
    href: '/ai-tools/prompt-hoc-tap',
    icon: Sparkles,
    number: '02',
    title: 'Chatbot Hướng Dẫn\nTạo Prompt Học Tập',
    desc: 'Viết prompt tối ưu theo môn học, lớp và bài học cụ thể. Chọn ngữ cảnh học — AI tạo prompt chuẩn cho bạn.',
    tags: ['Môn học', 'Lớp 10-12', 'Lưu prompt'],
    accent: 'accent',
  },
  {
    id: 'prompt-general',
    href: '/ai-tools/prompt-da-dung',
    icon: MessageSquare,
    number: '03',
    title: 'Chatbot Hướng Dẫn\nTạo Prompt Đa Dụng',
    desc: 'Chat tự do để học cách tạo prompt cho bất kỳ mục đích nào — không giới hạn nội dung hay chủ đề.',
    tags: ['Tự do', 'Đa mục đích', 'Không giới hạn'],
    accent: 'primary',
  },
];

export default function AiTools() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Header */}
      <div
        className="border-b py-14"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-5 inline-flex">Công Cụ AI</span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1
                className="font-display font-bold text-4xl sm:text-5xl mt-1 text-balance"
                style={{ color: 'var(--color-text)', letterSpacing: '-0.04em', lineHeight: '1.05' }}
              >
                Ba chatbot.<br />
                <span style={{ color: 'var(--color-primary)' }}>Một mục tiêu.</span>
              </h1>
              <p className="text-base leading-relaxed mt-4 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                Học cách sử dụng AI và viết prompt hiệu quả — hai kỹ năng cốt lõi của thế hệ học sinh thế kỷ 21.
              </p>
            </div>
            <div
              className="flex-shrink-0 border px-5 py-4 hidden lg:block"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
            >
              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--color-text-light)', letterSpacing: '0.12em' }}>
                Thực hành trên
              </p>
              <div className="flex items-center gap-4 mt-2">
                {['ChatGPT', 'Gemini', 'Claude'].map((name, i) => (
                  <a
                    key={name}
                    href={['https://chatgpt.com', 'https://gemini.google.com', 'https://claude.ai'][i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium flex items-center gap-1 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >
                    {name} <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Large featured layout */}
        <div className="space-y-px" style={{ borderTop: '1px solid var(--color-border)' }}>
          {chatbots.map((bot, index) => {
            const Icon = bot.icon;
            const isPrimary = bot.accent === 'primary';
            return (
              <Link
                key={bot.id}
                to={bot.href}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 px-0 py-8 transition-all duration-200"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                {/* Number */}
                <div
                  className="font-display font-bold text-5xl sm:text-6xl flex-shrink-0 w-16 leading-none transition-colors duration-200"
                  style={{
                    color: 'var(--color-border-strong)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  {bot.number}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-11 flex-shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: isPrimary ? 'var(--color-primary-light)' : 'var(--color-accent-light)',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  }}
                >
                  <Icon size={20} style={{ color: isPrimary ? 'var(--color-primary)' : 'var(--color-accent)' }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-display font-bold text-xl sm:text-2xl mb-2 whitespace-pre-line"
                    style={{ color: 'var(--color-text)', letterSpacing: '-0.03em', lineHeight: '1.2' }}
                  >
                    {bot.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-3 max-w-lg" style={{ color: 'var(--color-text-muted)' }}>
                    {bot.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bot.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow CTA */}
                <div
                  className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3"
                  style={{ color: isPrimary ? 'var(--color-primary)' : 'var(--color-accent)' }}
                >
                  <span className="hidden sm:block">Mở chatbot</span>
                  <div
                    className="w-9 h-8 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
                    style={{
                      backgroundColor: isPrimary ? 'var(--color-primary-light)' : 'var(--color-accent-light)',
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                    }}
                  >
                    <ArrowRight size={16} style={{ color: isPrimary ? 'var(--color-primary)' : 'var(--color-accent)' }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-3 py-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Gợi ý:</span>{' '}
            Bắt đầu với chatbot <strong>Hướng Dẫn Sử Dụng AI</strong> nếu bạn mới tiếp cận AI, sau đó học cách tạo prompt để khai thác sâu hơn.
          </p>
        </div>
      </div>
    </div>
  );
}
