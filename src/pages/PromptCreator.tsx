import { useState, useRef, useEffect } from 'react';
import { Send, Settings, RefreshCw, Copy, Check, ChevronLeft, BookOpen, History } from 'lucide-react';
import { grades, bookSeries, subjects, lessons, type Message } from '../data/educationData';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { SavedPrompt } from '../types/database';

type SidebarTab = 'context' | 'history';

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

type CozeApiResponse = {
  content?: string;
  conversation_id?: string;
  error?: string;
};

async function fetchCozeResponse(
  userMessage: string,
  existingConversationId?: string | null
): Promise<{ content: string; conversation_id: string }> {
  const response = await fetch('/api/coze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
      conversation_id: existingConversationId,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as CozeApiResponse;

  if (!response.ok) {
    throw new Error(data.error ?? `Coze API error: ${response.status} ${response.statusText}`);
  }

  if (!data.content || !data.conversation_id) {
    throw new Error(`Coze API response missing content/conversation_id: ${JSON.stringify(data)}`);
  }

  return { content: data.content, conversation_id: data.conversation_id };
}

export default function PromptCreator() {
  const { user, isGuest } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('context');
  const [chatHistory, setChatHistory] = useState<Pick<SavedPrompt, 'id' | 'purpose' | 'created_at'>[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchChatHistory = async () => {
    if (!user) {
      setChatHistory([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .select('id, purpose, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setChatHistory(data ?? []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const availableLessons = selectedGrade && selectedSubject
    ? lessons[selectedGrade]?.[selectedSubject] || []
    : [];

  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    setSelectedLesson('');
  }, [selectedGrade, selectedSubject]);

  useEffect(() => {
    if (!isGuest && user) {
      fetchChatHistory();
    } else {
      setChatHistory([]);
    }
  }, [user, isGuest]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const rawUserText = inputValue;
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: rawUserText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setIsTyping(true);

    try {
      const cozeQuery = [
        `Grade: ${selectedGrade}`,
        `Textbook_Series: ${selectedBook}`,
        `Subject: ${selectedSubject}`,
        `Lesson: ${selectedLesson}`,
        `User_Problem: ${rawUserText}`,
      ].join('\n');

      const { content: aiContent, conversation_id } = await fetchCozeResponse(cozeQuery, currentConversationId);
      setCurrentConversationId(conversation_id);

      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (!isGuest && user) {
        try {
          const title = rawUserText.substring(0, 50) + '...';
          const tags = [selectedSubject, selectedGrade].filter(Boolean);

          const { error } = await supabase.from('saved_prompts').insert({
            user_id: user.id,
            purpose: title,
            prompt_content: aiContent,
            subject: tags[0] ?? '',
            book_series: selectedBook || '',
            chapter: tags[1] ?? '',
          });

          if (error) throw error;
          await fetchChatHistory();
        } catch (saveError) {
          console.error('Error saving prompt to Supabase:', saveError);
        }
      }
    } catch (error: any) {
      // Báº¯t buá»™c log lá»—i chi tiáº¿t Ä‘á»ƒ debug theo yÃªu cáº§u.
      console.log('Coze v3 error detail:', error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content:
          error?.message ??
          'Xin lá»—i, Ä‘Ã£ xáº£y ra lá»—i khi káº¿t ná»‘i tá»›i Coze. Vui lÃ²ng thá»­ láº¡i sau hoáº·c kiá»ƒm tra cáº¥u hÃ¬nh API.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    const codeMatch = text.match(/```[\s\S]*?```/);
    const textToCopy = codeMatch ? codeMatch[0].replace(/```\n?/g, '') : text;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (content: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);
    const formatted: React.ReactNode[] = [];

    parts.forEach((part, idx) => {
      if (idx % 2 === 0) {
        if (part.includes('**')) {
          const lines = part.split('\n');
          lines.forEach((line, i) => {
            const boldRegex = /\*\*(.*?)\*\*/g;
            const formattedLine = line.replace(boldRegex, '<strong>$1</strong>');
            formatted.push(
              <p key={`${idx}-${i}`} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedLine }} />
            );
          });
        } else {
          formatted.push(<p key={idx} className="whitespace-pre-wrap">{part}</p>);
        }
      } else {
        formatted.push(
          <div key={idx} className="relative bg-gray-900 text-gray-100 rounded-lg p-4 my-2 overflow-x-auto">
            <button
              onClick={() => handleCopy(content, `code-${idx}`)}
              className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white bg-gray-700 rounded"
            >
              {copiedId === `code-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="text-sm">{part}</pre>
          </div>
        );
      }
    });

    return formatted;
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] -mx-4 sm:-mx-6 lg:-mx-8 bg-white">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-72 lg:w-80' : 'w-0'} bg-gray-50 border-r border-gray-200 flex-shrink-0 transition-all duration-300 overflow-hidden`}
      >
        <div className={`${sidebarOpen ? 'opacity-100' : 'opacity-0'} p-4 h-full overflow-y-auto`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {sidebarTab === 'context' ? (
                <BookOpen className="w-5 h-5 text-blue-900" />
              ) : (
                <History className="w-5 h-5 text-blue-900" />
              )}
              {sidebarTab === 'context' ? 'Ngá»¯ cáº£nh' : 'Lá»‹ch sá»­'}
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded lg:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1 p-1 bg-gray-200/60 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => setSidebarTab('context')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                sidebarTab === 'context'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Ngá»¯ cáº£nh
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('history')}
              disabled={isGuest}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                sidebarTab === 'history'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <History className="w-3.5 h-3.5" />
              Lá»‹ch sá»­
            </button>
          </div>

          {sidebarTab === 'history' ? (
            <div className="space-y-2">
              {chatHistory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  ChÆ°a cÃ³ lá»‹ch sá»­ chat. Gá»­i tin nháº¯n Ä‘á»ƒ báº¯t Ä‘áº§u!
                </p>
              ) : (
                chatHistory.map((item) => (
                  <div
                    key={item.id}
                    className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.purpose}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
          <div className="space-y-4">
            {/* Grade Selection - REQUIRED */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Lá»›p há»c <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {grades.map((grade) => (
                  <button
                    key={grade.value}
                    onClick={() => setSelectedGrade(grade.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      selectedGrade === grade.value
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {grade.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Series - OPTIONAL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bá»™ sÃ¡ch (TÃ¹y chá»n)
              </label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              >
                <option value="">Chá»n bá»™ sÃ¡ch</option>
                {bookSeries.map((book) => (
                  <option key={book.value} value={book.value}>
                    {book.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MÃ´n há»c
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              >
                <option value="">Chá»n mÃ´n há»c</option>
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Lesson */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                BÃ i há»c (TÃ¹y chá»n)
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                disabled={!selectedSubject || availableLessons.length === 0}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Chá»n bÃ i há»c</option>
                {availableLessons.map((lesson) => (
                  <option key={lesson} value={lesson}>
                    {lesson}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleStartNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Báº¯t Ä‘áº§u cuá»™c chat má»›i
              </button>
            </div>

            {/* Context Summary */}
            {selectedSubject && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Ngá»¯ cáº£nh hiá»‡n táº¡i:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><span className="font-medium">Lá»›p:</span> {grades.find(g => g.value === selectedGrade)?.label}</li>
                  {selectedBook && <li><span className="font-medium">SÃ¡ch:</span> {bookSeries.find(b => b.value === selectedBook)?.label}</li>}
                  <li><span className="font-medium">MÃ´n:</span> {subjects.find(s => s.value === selectedSubject)?.label}</li>
                  {selectedLesson && <li><span className="font-medium">BÃ i:</span> {selectedLesson}</li>}
                </ul>
              </div>
            )}
          </div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header (Mobile) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200 text-gray-700"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Chá»n ngá»¯ cáº£nh</span>
          </button>
        )}

        {/* Toggle Sidebar Button (Desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center gap-2 p-3 m-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-start"
          style={{ position: 'absolute', zIndex: 10 }}
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className={`text-sm sm:text-base ${message.role === 'assistant' ? 'space-y-2' : ''}`}>
                  {message.role === 'assistant' ? formatMessage(message.content) : message.content}
                </div>
                {message.role === 'assistant' && message.content.includes('```') && (
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-blue-900 hover:text-blue-700"
                  >
                    {copiedId === message.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === message.id ? 'ÄÃ£ copy' : 'Copy Prompt'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 bg-gray-100 text-gray-500 text-sm">
                Trá»£ lÃ½ AI Ä‘ang soáº¡n tráº£ lá»i...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <div className="flex gap-2 sm:gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nháº­p tin nháº¯n..."
              rows={1}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI sáº½ sá»­ dá»¥ng ngá»¯ cáº£nh tá»« sidebar Ä‘á»ƒ táº¡o Prompt phÃ¹ há»£p
          </p>
        </div>
      </div>
    </div>
  );
}
