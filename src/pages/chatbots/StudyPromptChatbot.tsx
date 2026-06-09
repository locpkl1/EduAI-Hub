import { useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';
import { grades, bookSeries, subjects, lessons } from '../../data/educationData';

function StudySidebar({
  selectedGrade, setSelectedGrade,
  selectedBook, setSelectedBook,
  selectedSubject, setSelectedSubject,
  selectedLesson, setSelectedLesson,
}: {
  selectedGrade: string; setSelectedGrade: (v: string) => void;
  selectedBook: string; setSelectedBook: (v: string) => void;
  selectedSubject: string; setSelectedSubject: (v: string) => void;
  selectedLesson: string; setSelectedLesson: (v: string) => void;
}) {
  const availableLessons = selectedGrade && selectedSubject
    ? lessons[selectedGrade]?.[selectedSubject] || []
    : [];

  return (
    <div className="p-5 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen size={14} style={{ color: 'var(--color-primary)' }} />
        <span className="font-display font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--color-text)', letterSpacing: '0.08em' }}>
          Ngữ cảnh học
        </span>
      </div>

      <div className="space-y-4">
        {/* Grade */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
            Lớp <span style={{ color: 'var(--color-accent)' }}>*</span>
          </label>
          <div className="flex gap-1.5">
            {grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setSelectedGrade(g.value)}
                className="flex-1 py-2 text-xs font-semibold border-2 transition-all duration-150"
                style={
                  selectedGrade === g.value
                    ? { backgroundColor: 'var(--color-primary)', color: '#ffffff', borderColor: 'var(--color-primary)' }
                    : { backgroundColor: 'transparent', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }
                }
              >
                {g.value}
              </button>
            ))}
          </div>
        </div>

        {/* Book series */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
            Bộ sách
          </label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="input-field py-2 text-xs"
          >
            <option value="">Chọn bộ sách</option>
            {bookSeries.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
            Môn học
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); setSelectedLesson(''); }}
            className="input-field py-2 text-xs"
          >
            <option value="">Chọn môn học</option>
            {subjects.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Lesson */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
            Bài học
          </label>
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            disabled={!selectedSubject || availableLessons.length === 0}
            className="input-field py-2 text-xs disabled:opacity-50"
          >
            <option value="">Chọn bài học</option>
            {availableLessons.map((lesson) => (
              <option key={lesson} value={lesson}>{lesson}</option>
            ))}
          </select>
        </div>

        {/* Summary */}
        {selectedSubject && (
          <div
            className="mt-4 p-3 border-l-2"
            style={{ backgroundColor: 'var(--color-primary-light)', borderLeftColor: 'var(--color-primary)' }}
          >
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--color-primary)' }}>Ngữ cảnh hiện tại</p>
            <ul className="text-xs space-y-0.5" style={{ color: 'var(--color-text-muted)' }}>
              <li>Lớp: <span className="font-medium" style={{ color: 'var(--color-text)' }}>{selectedGrade}</span></li>
              {selectedBook && (
                <li>Sách: <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                  {bookSeries.find((b) => b.value === selectedBook)?.label}
                </span></li>
              )}
              <li>Môn: <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                {subjects.find((s) => s.value === selectedSubject)?.label}
              </span></li>
              {selectedLesson && <li>Bài: <span className="font-medium" style={{ color: 'var(--color-text)' }}>{selectedLesson}</span></li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudyPromptChatbot() {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  const subjectLabel = subjects.find((s) => s.value === selectedSubject)?.label || selectedSubject;
  const bookLabel = bookSeries.find((b) => b.value === selectedBook)?.label || '';

  const systemContext = [
    `Bạn là chatbot hướng dẫn tạo prompt học tập cho học sinh THPT Việt Nam.`,
    `Ngữ cảnh: Lớp ${selectedGrade}${bookLabel ? `, Bộ sách ${bookLabel}` : ''}${subjectLabel ? `, Môn ${subjectLabel}` : ''}${selectedLesson ? `, Bài: ${selectedLesson}` : ''}.`,
    `Nhiệm vụ: Tạo prompt học tập tối ưu theo đúng môn, lớp, bài. Giải thích tại sao prompt đó hiệu quả. Nếu người dùng cung cấp prompt yếu, hãy sửa và cải thiện nó.`,
  ].join('\n');

  const sidebar = (
    <StudySidebar
      selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}
      selectedBook={selectedBook} setSelectedBook={setSelectedBook}
      selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
      selectedLesson={selectedLesson} setSelectedLesson={setSelectedLesson}
    />
  );

  const starters = [
    'Tạo prompt giải thích tích phân lớp 12',
    'Hãy sửa prompt này: "Giải thích quang hợp"',
    'Tạo prompt ôn thi Văn theo chủ đề nghị luận',
    'Tạo prompt học từ vựng tiếng Anh Unit 5',
  ];

  return (
    <ChatbotPage
      title="Chatbot Hướng Dẫn Tạo Prompt Học Tập"
      subtitle="Tạo và cải thiện prompt theo môn học, lớp, bài học cụ thể"
      icon={<Sparkles size={20} style={{ color: 'var(--color-primary)' }} />}
      systemContext={systemContext}
      starterPrompts={starters}
      sidebar={sidebar}
      saveSubject={subjectLabel}
      saveBookSeries={bookLabel}
      saveChapter={selectedGrade}
    />
  );
}
