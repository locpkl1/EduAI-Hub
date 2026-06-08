import { useEffect, useState, type FormEvent } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Grade } from '../types/database';

const GRADE_OPTIONS: Grade[] = [10, 11, 12];

export default function ProfileCompletionModal() {
  const { user, profile, displayName, loading, isProfileIncomplete, updateProfile } = useAuth();

  const show = Boolean(user) && !loading && isProfileIncomplete;

  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [school, setSchool] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setFullName(profile?.full_name?.trim() || displayName || '');
      setGrade(profile?.grade ?? '');
      setSchool(profile?.school?.trim() || '');
      setError('');
    }
  }, [show, profile, displayName]);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  const canSubmit = Boolean(fullName.trim() && grade && school.trim());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || !grade) return;

    setSaving(true);
    setError('');
    try {
      await updateProfile({
        full_name: fullName.trim(),
        grade,
        school: school.trim(),
      });
    } catch {
      setError('Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-blue-900 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-lg font-semibold">
                Hoàn thiện hồ sơ
              </h2>
              <p className="text-sm text-blue-100 mt-0.5">
                Giúp EduAI-Hub cá nhân hóa trải nghiệm học tập cho bạn
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="profile-full-name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên của bạn
            </label>
            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập tên hiển thị"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-grade" className="block text-sm font-medium text-gray-700 mb-1.5">
              Khối đang học
            </label>
            <select
              id="profile-grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value ? (Number(e.target.value) as Grade) : '')}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              required
            >
              <option value="">Chọn khối</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  Khối {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="profile-school" className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên trường THPT
            </label>
            <input
              id="profile-school"
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="VD: THPT Nguyễn Huệ"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-lg font-medium text-sm hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thông tin'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
