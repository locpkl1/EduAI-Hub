import { useState } from 'react';
import { guides, guideArticles, type GuideArticleSection } from '../data/educationData';
import { Clock, ArrowRight } from 'lucide-react';
import Modal from '../components/Modal';

function ArticleContent({ sections }: { sections: GuideArticleSection[] }) {
  return (
    <div className="prose prose-gray max-w-none space-y-4">
      {sections.map((section, index) => {
        if (section.type === 'h2') {
          return (
            <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-3 first:mt-0">
              {section.content as string}
            </h2>
          );
        }
        if (section.type === 'ul') {
          return (
            <ul key={index} className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
              {(section.content as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-gray-700 leading-relaxed text-base">
            {section.content as string}
          </p>
        );
      })}
    </div>
  );
}

export default function Guides() {
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);
  const selectedGuide = guides.find((g) => g.id === selectedGuideId);
  const article = selectedGuideId ? guideArticles[selectedGuideId] : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hướng Dẫn Sử Dụng AI</h1>
        <p className="text-gray-600 mt-2">Các bài viết và case study về việc sử dụng AI trong học tập</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <article
            key={guide.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedGuideId(guide.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedGuideId(guide.id);
              }
            }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          >
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full">
                  {guide.category}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {guide.readTime}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                {guide.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2">{guide.excerpt}</p>

              <div className="mt-4 flex items-center gap-2 text-blue-900 font-medium text-sm group-hover:gap-3 transition-all">
                <span>Đọc tiếp</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal
        isOpen={!!selectedGuide}
        onClose={() => setSelectedGuideId(null)}
        size="xl"
        showCloseButton={true}
      >
        {selectedGuide && article && (
          <>
            <div className="p-6 sm:p-8 border-b border-gray-100 pr-14">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-900 text-xs font-medium rounded-full mb-3">
                {selectedGuide.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {selectedGuide.title}
              </h1>
              <p className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <Clock className="w-4 h-4" />
                Thời gian đọc: {selectedGuide.readTime}
              </p>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1 max-h-[60vh]">
              <ArticleContent sections={article.sections} />
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedGuideId(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </Modal>

      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          5 Nguyên tắc vàng khi sử dụng AI trong học tập
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
              1
            </span>
            <div>
              <h4 className="font-medium text-gray-900">Hiểu trước, hỏi sau</h4>
              <p className="text-sm text-gray-600">Luôn tự suy nghĩ và tìm hiểu trước khi hỏi AI</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
              2
            </span>
            <div>
              <h4 className="font-medium text-gray-900">Xin giải thích, không xin đáp án</h4>
              <p className="text-sm text-gray-600">Hãy yêu cầu AI giải thích phương pháp thay vì chỉ đưa đáp án</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
              3
            </span>
            <div>
              <h4 className="font-medium text-gray-900">Kiểm chứng kết quả</h4>
              <p className="text-sm text-gray-600">Luôn kiểm tra lại thông tin AI đưa ra</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
              4
            </span>
            <div>
              <h4 className="font-medium text-gray-900">Viết prompt rõ ràng, cụ thể</h4>
              <p className="text-sm text-gray-600">Câu hỏi càng cụ thể, câu trả lời càng chính xác</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
              5
            </span>
            <div>
              <h4 className="font-medium text-gray-900">Học để hiểu, không học để copy</h4>
              <p className="text-sm text-gray-600">Mục đích cuối cùng là tự giải quyết được vấn đề</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
