import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SavedPrompt, Task, LearningProgress } from '../types/database';
import { Calendar, Sparkles, Clock, CheckSquare, TrendingUp, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile, loading: authLoading, isGuest, displayName } = useAuth();
  const [recentPrompts, setRecentPrompts] = useState<SavedPrompt[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (profile && isSupabaseConfigured) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [profile, authLoading]);

  async function fetchDashboardData() {
    try {
      const [promptsRes, tasksRes, progressRes] = await Promise.all([
        supabase
          .from('saved_prompts')
          .select('*')
          .eq('user_id', profile!.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('tasks')
          .select('*')
          .eq('user_id', profile!.id)
          .eq('completed', false)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', profile!.id)
          .order('created_at', { ascending: false })
          .limit(7),
      ]);

      setRecentPrompts(promptsRes.data || []);
      setRecentTasks(tasksRes.data || []);
      setWeeklyProgress(progressRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalMinutes = weeklyProgress.reduce((sum, p) => sum + p.duration_minutes, 0);
  const completedTasks = recentTasks.filter((t) => t.completed).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const welcomeName = isGuest ? 'Bạn (chế độ Khách)' : displayName || profile?.full_name || 'Học sinh';

  return (
    <div className="space-y-8">
      {isGuest && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <UserCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Chế độ Khách</p>
            <p className="text-sm text-amber-800 mt-1">
              Bạn đang trải nghiệm mà chưa đăng nhập. Dữ liệu prompt và tiến độ sẽ không được lưu.
              <Link to="/" className="ml-1 text-blue-900 font-medium hover:underline">
                Đăng nhập Google
              </Link>{' '}
              để đồng bộ học tập.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">{getGreeting()}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{welcomeName}</h1>
            <p className="text-gray-600 mt-2">Chúc bạn một ngày học tập hiệu quả!</p>
          </div>
          <div className="flex items-center gap-4">
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-900" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalMinutes}</p>
          <p className="text-sm text-gray-500">Phút học tuần này</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-900" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{weeklyProgress.length}</p>
          <p className="text-sm text-gray-500">Phiên học tập</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-900" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{recentPrompts.length}</p>
          <p className="text-sm text-gray-500">Prompt đã tạo</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-900" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {completedTasks}/{recentTasks.length}
          </p>
          <p className="text-sm text-gray-500">Công việc</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Prompt gần đây</h2>
            <div className="flex items-center gap-3">
              <Link
                to="/prompts"
                className="text-sm text-blue-900 hover:text-blue-700 font-medium"
              >
                Xem tất cả
              </Link>
              <Link
                to="/prompt-creator"
                className="text-sm text-blue-900 hover:text-blue-700 font-medium"
              >
                Tạo mới
              </Link>
            </div>
          </div>

          {recentPrompts.length > 0 ? (
            <div className="space-y-3">
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{prompt.subject}</p>
                      <p className="text-sm text-gray-500 truncate">{prompt.purpose}</p>
                    </div>
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{prompt.prompt_content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{isGuest ? 'Đăng nhập để lưu prompt' : 'Chưa có prompt nào'}</p>
              <Link
                to="/prompt-creator"
                className="inline-block mt-2 text-sm text-blue-900 hover:text-blue-700 font-medium"
              >
                Tạo prompt {isGuest ? 'ngay' : 'đầu tiên'}
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Việc cần làm</h2>

          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                      task.completed ? 'bg-blue-900 border-blue-900' : 'border-gray-300'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                        <path
                          fill="currentColor"
                          d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`flex-1 ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{isGuest ? 'Đăng nhập để đồng bộ công việc' : 'Không có công việc nào'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/prompt-creator"
          className="bg-blue-900 text-white rounded-xl p-6 flex items-center gap-4 hover:bg-blue-800 transition-colors"
        >
          <Sparkles className="w-8 h-8" />
          <div>
            <p className="font-semibold">Tạo Prompt mới</p>
            <p className="text-sm text-blue-200">Hỗ trợ AI học tập</p>
          </div>
        </Link>

        <Link
          to="/textbooks"
          className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:border-gray-300 transition-colors"
        >
          <BookOpenIcon className="w-8 h-8 text-blue-900" />
          <div>
            <p className="font-semibold text-gray-900">Sách giáo khoa</p>
            <p className="text-sm text-gray-500">Xem tài liệu các khối</p>
          </div>
        </Link>

        <Link
          to="/prompts"
          className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:border-gray-300 transition-colors"
        >
          <LibraryIcon className="w-8 h-8 text-blue-900" />
          <div>
            <p className="font-semibold text-gray-900">Kho Prompt</p>
            <p className="text-sm text-gray-500">Prompt cá nhân & tham khảo</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
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
