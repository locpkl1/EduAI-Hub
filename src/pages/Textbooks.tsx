import { useState } from 'react';
import { Book, ChevronRight } from 'lucide-react';
import { textbooks, bookSeries, grades } from '../data/educationData';
import Modal from '../components/Modal';

type TextbookItem = (typeof textbooks)[number];

export default function Textbooks() {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedBook, setSelectedBook] = useState<TextbookItem | null>(null);
  const [selectedSeries, setSelectedSeries] = useState('');
  const selectedGradeLabel = grades.find((g) => g.value === selectedGrade)?.label || '';

  const filteredTextbooks = textbooks.filter((book) => book.grade.toString() === selectedGrade);
  const groupedBySeries = bookSeries.map((series) => ({
    ...series,
    books: filteredTextbooks.filter((book) => book.series === series.label),
  }));

  const openBookModal = (book: TextbookItem, seriesLabel: string) => {
    setSelectedBook(book);
    setSelectedSeries(seriesLabel);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setSelectedSeries('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kho Sách Giáo Khoa</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Danh mục sách giáo khoa chương trình mới với 3 bộ sách và 3 khối lớp
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <span className="text-sm font-medium text-gray-700 self-center mr-2">Chọn khối lớp:</span>
        {grades.map((grade) => (
          <button
            key={grade.value}
            onClick={() => setSelectedGrade(grade.value)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all ${
              selectedGrade === grade.value
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow'
            }`}
          >
            {grade.label}
          </button>
        ))}
      </div>

      {groupedBySeries.map((series) => (
        <section key={series.value} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-900 rounded" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{series.label}</h2>
            <span className="text-sm text-gray-500">({series.books.length} sách)</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {series.books.map((book, index) => (
              <button
                key={`${book.subject}-${series.value}-${index}`}
                type="button"
                onClick={() => openBookModal(book, series.label)}
                className="group bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                  <img
                    src={book.cover}
                    alt={`${book.subject} ${selectedGradeLabel}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-blue-900 text-white text-xs font-medium rounded shadow">
                      {selectedGradeLabel}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Đọc PDF</span>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Book className="w-3.5 h-3.5 text-blue-900" />
                    <span className="text-xs font-medium text-blue-900">{series.label}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                    {book.subject}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Sách giáo khoa {selectedGradeLabel}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Giới thiệu về chương trình sách giáo khoa mới
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {bookSeries.map((series) => (
            <div key={series.value} className="bg-white p-4 rounded-lg border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">{series.label}</h3>
              <p className="text-sm text-gray-600">
                {series.value === 'chan_troi' &&
                  'Tập trung phát triển năng lực người học với nhiều hoạt động thực tiễn và dự án học tập.'}
                {series.value === 'canh_dieu' &&
                  'Thiết kế hiện đại, gần gũi với đời sống, chú trọng phát triển tư duy sáng tạo.'}
                {series.value === 'ket_noi' &&
                  'Đa dạng hình thức học tập, kết nối kiến thức với thực tiễn Việt Nam và thế giới.'}
              </p>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-sm mt-6">
          Chương trình giáo dục phổ thông 2018 được áp dụng từ năm học 2020-2021 với 3 bộ sách giáo khoa
          chính được cấp phép bởi Bộ Giáo dục và Đào tạo. Các sách đều tuân thủ khung chương trình,
          tập trung phát triển năng lực và phẩm chất người học, tăng cường hoạt động thực hành.
        </p>
      </div>

      <Modal isOpen={!!selectedBook} onClose={closeModal} size="lg">
        {selectedBook && (
          <>
            <div className="p-6 sm:p-8 border-b border-gray-100 pr-14">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedBook.subject}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-900 text-sm font-medium rounded-full">
                  Bộ sách: {selectedSeries}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  Khối lớp: {selectedGradeLabel}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Sách giáo khoa {selectedBook.subject} — {selectedSeries} — Chương trình GDPT 2018
              </p>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              <iframe
                src={selectedBook.pdfUrl}
                title={`PDF ${selectedBook.subject}`}
                className="w-full h-[70vh] rounded-lg border-0 bg-gray-100"
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
