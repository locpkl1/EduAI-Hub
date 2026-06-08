import { useAuth } from '../contexts/AuthContext';
import { Sparkles, GraduationCap, Target, Heart, ArrowRight } from 'lucide-react';
import { motivationalQuotes } from '../data/educationData';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const { signInWithGoogle, loading, user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      setShowContent(true);
      return;
    }
    const fallback = setTimeout(() => setShowContent(true), 3500);
    return () => clearTimeout(fallback);
  }, [loading]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (!showContent) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
              <GraduationCap className="w-4 h-4" />
              Hỗ trợ học sinh Việt Nam
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Học tập{' '}
              <span className="text-blue-900">thông minh</span>{' '}
              cùng AI
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              EduAI-Hub là nền tảng giáo dục giúp học sinh Việt Nam sử dụng trí tuệ nhân tạo
              một cách hiệu quả, có trách nhiệm để nâng cao kết quả học tập.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Vào trang chủ
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Đăng nhập bằng Google
                </button>
              )}

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Trải nghiệm chế độ Khách
              </Link>
              <Link
                to="/prompt-creator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Tạo Prompt ngay
              </Link>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 sm:pt-8">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Tạo Prompt chuẩn</h3>
                  <p className="text-sm text-gray-600">Hỗ trợ tạo câu lệnh AI hiệu quả</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Heart className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Học có trách nhiệm</h3>
                  <p className="text-sm text-gray-600">Sử dụng AI đúng cách, học thật</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Image/Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl relative overflow-hidden">
              <img
                src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Học sinh đang học tập với laptop"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            {/* Floating Quote Card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 max-w-xs hidden sm:block">
              <p className="text-sm text-gray-700 italic">
                {motivationalQuotes[currentQuote]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Quote */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:hidden">
        <p className="text-sm text-gray-700 italic text-center">
          {motivationalQuotes[currentQuote]}
        </p>
      </div>

      {/* Quick Access Features */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/prompt-creator"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
            <Sparkles className="w-6 h-6 text-blue-900 group-hover:text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Tạo Prompt</h3>
          <p className="text-sm text-gray-600">Tạo prompt chuẩn cho môn học lớp 10</p>
        </Link>

        <Link
          to="/textbooks"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
            <BookIcon className="w-6 h-6 text-blue-900 group-hover:text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Kho Sách Giáo Khoa</h3>
          <p className="text-sm text-gray-600">Danh mục sách lớp 10 chương trình mới</p>
        </Link>

        <Link
          to="/prompts"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
            <LibraryIcon className="w-6 h-6 text-blue-900 group-hover:text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Kho Prompt</h3>
          <p className="text-sm text-gray-600">Lưu trữ và tham khảo prompt học tập chất lượng</p>
        </Link>

        <Link
          to="/guides"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
            <GuideIcon className="w-6 h-6 text-blue-900 group-hover:text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Hướng dẫn AI</h3>
          <p className="text-sm text-gray-600">Cách sử dụng AI hiệu quả trong học tập</p>
        </Link>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            EduAI-Hub được tạo ra với mong muốn giúp học sinh Việt Nam tiếp cận công nghệ AI
            một cách có trách nhiệm, biến AI thành công cụ hỗ trợ hữu hiệu thay vì thay thế
            quá trình học tập.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Học có mục tiêu</h3>
            <p className="text-sm text-gray-600">
              Sử dụng AI để xác định mục tiêu học tập và theo dõi tiến độ cá nhân
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiểu sâu hơn</h3>
            <p className="text-sm text-gray-600">
              AI giúp giải thích và mở rộng kiến thức, không chỉ đưa ra câu trả lời
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trách nhiệm học tập</h3>
            <p className="text-sm text-gray-600">
              Học sinh hiểu giá trị của việc tự giải quyết vấn đề trước khi nhờ AI
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}

function GuideIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}
