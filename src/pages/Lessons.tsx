import { useState } from 'react';
import {
  ChevronRight,
  X,
  Clock,
  BookOpen,
  Brain,
  Sparkles,
  MessageSquare,
  Target,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Star,
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  tag: string;
  tagColor: 'primary' | 'accent' | 'warning' | 'success';
  desc: string;
  readTime: string;
  featured?: boolean;
  icon: React.ElementType;
  content: {
    intro: string;
    sections: { heading: string; body: string; tips?: string[] }[];
  };
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Cách biến AI thành gia sư cá nhân miễn phí',
    tag: 'Chiến lược',
    tagColor: 'primary',
    desc: 'Thiết lập đúng vai trò cho AI, đặt câu hỏi liên tục và xây dựng phiên học 1:1 hiệu quả không cần trả tiền',
    readTime: '7 phút',
    featured: true,
    icon: Brain,
    content: {
      intro: 'Gia sư AI không phải là AI trả lời câu hỏi của bạn — mà là AI được bạn lập trình để DẠY bạn. Sự khác biệt này rất quan trọng.',
      sections: [
        {
          heading: 'Bước 1: Thiết lập vai trò cho AI',
          body: 'Bắt đầu mỗi phiên học bằng prompt thiết lập vai trò: "Bạn là gia sư Toán lớp 12 kiên nhẫn, giỏi giải thích bằng ví dụ đời sống. Nhiệm vụ của bạn là giúp tôi HIỂU, không phải làm thay tôi. Khi tôi sai, hãy hỏi tôi câu hỏi gợi ý thay vì đưa đáp án ngay."',
          tips: ['Thêm tính cách cho AI (kiên nhẫn, gần gũi)', 'Đặt quy tắc rõ: không đưa đáp án ngay', 'Chỉ rõ môn và lớp'],
        },
        {
          heading: 'Bước 2: Học theo phương pháp Socratic',
          body: 'Thay vì hỏi "giải bài này", hãy hỏi "Bài này tôi cần áp dụng kiến thức gì? Gợi ý cho tôi điểm bắt đầu." Sau đó tự làm, nếu sai, hỏi "Tôi sai ở bước nào? Cho tôi một câu hỏi gợi ý thay vì đáp án."',
        },
        {
          heading: 'Bước 3: Kiểm tra sau khi học',
          body: 'Cuối mỗi phiên, yêu cầu: "Hãy hỏi tôi 5 câu kiểm tra về những gì tôi vừa học. Chờ tôi trả lời từng câu trước khi cho biết đúng sai." Đây là cách hiệu quả nhất để kiểm tra bạn có thực sự hiểu không.',
          tips: ['Tự trả lời trước khi xem đáp án', 'Yêu cầu câu hỏi từ dễ đến khó', 'Nhờ AI phân tích lỗi sai'],
        },
      ],
    },
  },
  {
    id: 2,
    title: 'Học tiếng Anh với AI — từ giao tiếp đến ôn thi',
    tag: 'Tiếng Anh',
    tagColor: 'accent',
    desc: 'Luyện nói, mở rộng từ vựng, sửa lỗi ngữ pháp và viết luận với AI — hoàn toàn miễn phí và linh hoạt 24/7',
    readTime: '8 phút',
    featured: true,
    icon: MessageSquare,
    content: {
      intro: 'AI là người bạn học tiếng Anh lý tưởng: không phán xét, sẵn sàng 24/7, kiên nhẫn vô hạn và phản hồi ngay lập tức.',
      sections: [
        {
          heading: 'Luyện từ vựng theo chủ đề',
          body: 'Prompt hiệu quả: "Bạn là giáo viên tiếng Anh. Dạy tôi 10 từ vựng chủ đề [Environment/Technology/Health] — mỗi từ cần: phát âm IPA, nghĩa tiếng Việt, 2 câu ví dụ tự nhiên và 1 mẹo ghi nhớ vui."',
          tips: ['Học theo chủ đề, không học lẻ tẻ', 'Yêu cầu câu ví dụ thực tế', 'Tạo flashcard từ phản hồi'],
        },
        {
          heading: 'Sửa lỗi ngữ pháp và viết luận',
          body: 'Viết đoạn văn → paste vào AI với prompt: "Hãy sửa lỗi ngữ pháp trong đoạn văn này, giải thích tại sao sai và cách viết đúng. Sau đó đánh giá mức độ tự nhiên của tiếng Anh theo thang 1-10."',
        },
        {
          heading: 'Luyện nói với AI',
          body: 'Dùng ChatGPT voice hoặc Gemini: "Hãy giả vờ là người phỏng vấn tôi về chủ đề Climate Change. Hỏi tôi 3 câu, chờ tôi trả lời và sau đó nhận xét ngữ pháp và từ vựng của tôi."',
        },
      ],
    },
  },
  {
    id: 3,
    title: 'Những lỗi sai cực kỳ phổ biến khi dùng AI học tập',
    tag: 'Kinh nghiệm',
    tagColor: 'warning',
    desc: 'Copy paste, tin tuyệt đối, hỏi quá mơ hồ — 5 lỗi này đang khiến bạn lãng phí tiềm năng của AI và tự hại bản thân',
    readTime: '6 phút',
    featured: false,
    icon: AlertTriangle,
    content: {
      intro: 'Dùng AI sai cách không chỉ không giúp ích — đôi khi còn có hại hơn không dùng. Đây là 5 lỗi bạn cần tránh ngay.',
      sections: [
        {
          heading: 'Lỗi 1: Hỏi quá mơ hồ',
          body: 'Tệ: "Giải thích Vật lý cho tôi". Tốt: "Tôi là HS lớp 12, đang học Chương Khúc xạ ánh sáng. Giải thích định luật Snell với 2 ví dụ thực tế và 1 bài tập áp dụng mức trung bình."',
          tips: ['Luôn thêm lớp, môn, chương cụ thể', 'Chỉ rõ muốn bao nhiêu ví dụ', 'Nêu mức độ khó'],
        },
        {
          heading: 'Lỗi 2: Copy nguyên văn câu trả lời AI',
          body: 'AI viết bài cho bạn = bạn không học được gì. Đọc, hiểu, rồi TỰ VIẾT LẠI bằng lời của bạn. Nộp bài do AI viết trong kỳ thi có thể bị xử lý gian lận.',
        },
        {
          heading: 'Lỗi 3: Tin tuyệt đối vào AI',
          body: 'AI có thể sai, đặc biệt với số liệu, công thức Toán/Lý/Hóa và sự kiện lịch sử. Quy tắc vàng: bất kỳ thông tin quan trọng nào cũng cần đối chiếu với sách giáo khoa.',
          tips: ['Luôn đối chiếu SGK', 'Đặc biệt cẩn thận với số liệu', 'Hỏi "Bạn chắc chắn không?" để AI tự kiểm tra'],
        },
      ],
    },
  },
  {
    id: 4,
    title: 'Dùng AI để lập kế hoạch ôn thi cực kỳ hiệu quả',
    tag: 'Ôn thi',
    tagColor: 'success',
    desc: 'Từ lịch học Pomodoro đến bộ đề trắc nghiệm tự động — AI có thể làm được tất cả nếu bạn biết cách prompt đúng',
    readTime: '9 phút',
    featured: false,
    icon: Target,
    content: {
      intro: 'Ôn thi là thời điểm AI hữu ích nhất. Nhưng phải dùng đúng cách — nghĩa là AI hỗ trợ, không làm thay.',
      sections: [
        {
          heading: 'Tạo lịch ôn tập cá nhân hóa',
          body: 'Prompt: "Tôi còn 3 tuần trước kỳ thi THPT. Tôi học khối A (Toán, Lý, Hóa). Điểm yếu là Hóa hữu cơ và Vật lý điện. Hãy lập lịch ôn tập 3 tuần, mỗi ngày học 3 tiếng, theo phương pháp spaced repetition."',
          tips: ['Cung cấp đủ thông tin (thời gian, điểm yếu, thời lượng)', 'Yêu cầu phương pháp cụ thể (Pomodoro, spaced repetition)', 'Xem lại và điều chỉnh lịch sau 1 tuần'],
        },
        {
          heading: 'Tạo bộ câu hỏi trắc nghiệm tự động',
          body: 'Prompt: "Tôi là giáo viên Hóa học lớp 12. Tạo 15 câu trắc nghiệm về Este-Lipit, mỗi câu 4 đáp án A-D, ghi đáp án đúng và giải thích ngắn 2 dòng. Phân bổ: 5 câu nhận biết, 5 câu thông hiểu, 5 câu vận dụng."',
        },
      ],
    },
  },
  {
    id: 5,
    title: 'Tóm tắt sách giáo khoa siêu nhanh với AI',
    tag: 'Mẹo học',
    tagColor: 'primary',
    desc: 'Biến một chương sách giáo khoa dài thành mindmap, flashcard và điểm trọng tâm chỉ trong vài phút',
    readTime: '5 phút',
    featured: false,
    icon: BookOpen,
    content: {
      intro: 'AI có thể giúp bạn đọc và xử lý tài liệu nhanh hơn — nhưng nhớ rằng tóm tắt không thay thế việc đọc và hiểu.',
      sections: [
        {
          heading: 'Prompt tóm tắt chương học',
          body: 'Paste nội dung chương vào AI và dùng prompt: "Hãy tóm tắt chương này theo cấu trúc: 1) Ý chính 3 gạch đầu dòng 2) 5 khái niệm quan trọng cần nhớ 3) 2 lỗi sai học sinh hay gặp 4) Câu hỏi ôn tập khả năng cao."',
          tips: ['Không chỉ copy tóm tắt — đọc và hiểu trước', 'Tự thêm ví dụ từ kinh nghiệm của bạn', 'So sánh với ghi chú trên lớp'],
        },
        {
          heading: 'Tạo flashcard nhanh',
          body: 'Prompt: "Từ nội dung tóm tắt trên, tạo 10 cặp flashcard định nghĩa theo format: [Mặt trước: câu hỏi/thuật ngữ] | [Mặt sau: giải thích ngắn gọn dưới 20 chữ]."',
        },
      ],
    },
  },
  {
    id: 6,
    title: 'Cách kiểm chứng thông tin AI cung cấp',
    tag: 'Tư duy phản biện',
    tagColor: 'warning',
    desc: 'AI hay nói sai nhất ở đâu? Làm thế nào để phát hiện và kiểm chứng mà không mất nhiều thời gian?',
    readTime: '6 phút',
    featured: false,
    icon: TrendingUp,
    content: {
      intro: 'AI rất tự tin ngay cả khi sai. Khả năng phát hiện và kiểm chứng thông tin là kỹ năng quan trọng nhất khi dùng AI.',
      sections: [
        {
          heading: 'AI sai nhiều nhất ở đâu?',
          body: '1) Số liệu và thống kê (hay bịa năm tháng, con số). 2) Công thức Toán/Lý/Hóa phức tạp (hay nhầm dấu, đơn vị). 3) Sự kiện lịch sử (nhầm nhân vật, địa danh). 4) Tên tác giả và tác phẩm văn học.',
          tips: ['Cẩn thận với mọi con số cụ thể', 'Kiểm tra công thức trước khi dùng bài thi', 'Đặt câu hỏi "Nguồn của thông tin này là gì?"'],
        },
        {
          heading: 'Quy trình kiểm chứng 3 bước',
          body: '1) Đối chiếu với SGK ngay khi nhận thông tin quan trọng. 2) Dùng prompt "Bạn có chắc chắn về thông tin này không? Liệt kê những điểm bạn không chắc." 3) Tìm nguồn độc lập (thầy cô, tài liệu tham khảo chính thống).',
        },
      ],
    },
  },
];

const allTags = ['Tất cả', 'Chiến lược', 'Tiếng Anh', 'Kinh nghiệm', 'Ôn thi', 'Mẹo học', 'Tư duy phản biện'];

const tagColorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'var(--color-primary-light)', text: 'var(--color-primary)' },
  accent: { bg: 'var(--color-accent-light)', text: 'var(--color-accent)' },
  warning: { bg: 'color-mix(in srgb, var(--color-warning) 12%, transparent)', text: 'var(--color-warning)' },
  success: { bg: 'color-mix(in srgb, var(--color-success) 12%, transparent)', text: 'var(--color-success)' },
};

export default function Lessons() {
  const [activeTag, setActiveTag] = useState('Tất cả');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const filtered = activeTag === 'Tất cả'
    ? lessons
    : lessons.filter((l) => l.tag === activeTag);

  const featured = lessons.filter((l) => l.featured);
  const regular = filtered.filter((l) => !l.featured || activeTag !== 'Tất cả');

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Page header */}
      <div
        className="border-b py-12"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-4 inline-flex">Bài Học</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4 text-balance">
            Kho kinh nghiệm
            <br />
            <span style={{ color: 'var(--color-primary)' }}>học cùng AI</span>
          </h1>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
            Không phải lý thuyết khô khan. Đây là những bài học thực tế, chiến lược cụ thể
            và kinh nghiệm xương máu từ việc dùng AI học tập mỗi ngày.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Featured — only show when "Tất cả" */}
        {activeTag === 'Tất cả' && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Star size={16} style={{ color: 'var(--color-accent)' }} />
              <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Bài học nổi bật</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {featured.map((lesson) => (
                <FeaturedCard
                  key={lesson.id}
                  lesson={lesson}
                  onClick={() => setSelectedLesson(lesson)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={
                activeTag === tag
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }
                  : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }
              }
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(activeTag === 'Tất cả' ? filtered : regular).map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => setSelectedLesson(lesson)}
            />
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selectedLesson && (
        <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
      )}
    </div>
  );
}

function FeaturedCard({ lesson, onClick }: { lesson: Lesson; onClick: () => void }) {
  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left card-hover p-6 flex flex-col gap-4 w-full group"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bg }}
        >
          <Icon size={20} style={{ color: text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="tag" style={{ backgroundColor: bg, color: text, border: 'none' }}>{lesson.tag}</span>
          <span className="tag tag-accent">Nổi bật</span>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-base mb-2 leading-snug text-balance" style={{ color: 'var(--color-text)' }}>
          {lesson.title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {lesson.desc}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-light)' }}>{lesson.readTime}</span>
        <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
          Đọc tiếp <ChevronRight size={14} />
        </div>
      </div>
    </button>
  );
}

function LessonCard({ lesson, onClick }: { lesson: Lesson; onClick: () => void }) {
  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left card-hover p-5 flex flex-col gap-3 w-full group"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="tag" style={{ backgroundColor: bg, color: text, border: 'none' }}>{lesson.tag}</span>
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-light)' }}>{lesson.readTime}</span>
      </div>
      <h3 className="font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
        {lesson.title}
      </h3>
      <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: 'var(--color-text-muted)' }}>
        {lesson.desc}
      </p>
      <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
        Đọc tiếp <ChevronRight size={13} />
      </div>
    </button>
  );
}

function LessonModal({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const { bg, text } = tagColorMap[lesson.tagColor];
  const Icon = lesson.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        {/* Header */}
        <div
          className="flex items-start gap-4 p-6 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
            <Icon size={20} style={{ color: text }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="tag" style={{ backgroundColor: bg, color: text, border: 'none' }}>{lesson.tag}</span>
              <span className="text-xs font-mono flex items-center gap-1" style={{ color: 'var(--color-text-light)' }}>
                <Clock size={10} />
                {lesson.readTime}
              </span>
            </div>
            <h2 className="text-xl font-bold leading-snug text-balance" style={{ color: 'var(--color-text)' }}>
              {lesson.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-xl hover:bg-bg-muted transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <p className="text-base leading-relaxed italic" style={{ color: 'var(--color-text-muted)', borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>
            {lesson.content.intro}
          </p>

          {lesson.content.sections.map((section, i) => (
            <div key={i} className="space-y-3">
              <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>{section.heading}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {section.body}
              </p>
              {section.tips && (
                <div className="flex flex-wrap gap-2">
                  {section.tips.map((tip) => (
                    <span
                      key={tip}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                    >
                      {tip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex justify-end"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-outline text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
