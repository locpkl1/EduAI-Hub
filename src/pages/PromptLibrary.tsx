import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SavedPrompt } from '../types/database';
import { referencePrompts } from '../data/educationData';
import {
  Copy,
  Check,
  LogIn,
  Library,
  BookOpen,
  Sparkles,
  Loader2,
} from 'lucide-react';

type Tab = 'mine' | 'reference';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Không thể sao chép vào clipboard');
    }
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Đã sao chép
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Prompt
        </>
      )}
    </button>
  );
}

function PromptCard({
  title,
  subtitle,
  content,
  badge,
}: {
  title: string;
  subtitle?: string;
  content: string;
  badge?: string;
}) {
  const preview =
    content.length > 160 ? `${content.slice(0, 160).trim()}…` : content;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="flex-shrink-0 px-2.5 py-1 bg-blue-50 text-blue-900 text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 flex-1 whitespace-pre-line leading-relaxed">
        {preview}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <CopyButton text={content} />
      </div>
    </div>
  );
}

export default function PromptLibrary() {
  const { profile, isGuest, loading: authLoading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('mine');
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || isGuest || !profile || !isSupabaseConfigured) return;
    fetchSavedPrompts();
  }, [profile, isGuest, authLoading]);

  async function fetchSavedPrompts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPrompts(data || []);
    } catch (error) {
      console.error('Error fetching saved prompts:', error);
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'mine', label: 'Kho prompt của bản thân' },
    { id: 'reference', label: 'Kho prompt tham khảo' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
            <Library className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kho Prompt</h1>
        </div>
        <p className="text-gray-600">
          Quản lý prompt cá nhân và khám phá mẫu prompt chất lượng cho việc học.
        </p>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-full sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'mine' && (
        <div>
          {authLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
            </div>
          ) : isGuest ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 sm:p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-900" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Lưu prompt cá nhân của bạn
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Vui lòng đăng nhập Google để lưu các prompt cá nhân của bạn. Prompt
                được tạo từ trang Tạo Prompt sẽ xuất hiện tại đây.
              </p>
              <button
                onClick={signInWithGoogle}
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Đăng nhập bằng Google
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
            </div>
          ) : savedPrompts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  title={prompt.topic || prompt.purpose || 'Prompt học tập'}
                  subtitle={[prompt.subject, prompt.chapter].filter(Boolean).join(' · ')}
                  content={prompt.prompt_content}
                  badge={prompt.book_series || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-10 sm:p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có prompt nào
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Hãy tạo prompt đầu tiên từ trang Tạo Prompt — prompt đã lưu sẽ hiển
                thị tại đây.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reference' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {referencePrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              title={prompt.title}
              subtitle={prompt.description}
              content={prompt.content}
              badge={prompt.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
