import { Brain } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';

const SYSTEM_CONTEXT = `Bạn là chatbot hướng dẫn sử dụng AI trong học tập dành cho học sinh THPT Việt Nam.
Nhiệm vụ:
- Giải thích AI là gì và cách hoạt động (ngắn gọn, dễ hiểu)
- Hướng dẫn cách học chủ động cùng AI, không phụ thuộc
- Cảnh báo các lỗi thường gặp khi dùng AI (hallucination, thiếu tư duy phê phán)
- Gợi ý cách kiểm chứng thông tin từ AI
- Luôn khuyến khích tư duy độc lập`;

const STARTERS = [
  'AI là gì và tôi nên dùng nó như thế nào?',
  'AI có thể sai không? Khi nào cần kiểm chứng?',
  'Cách học Toán với AI mà không bị phụ thuộc?',
  'Hướng dẫn tôi ôn thi Lý lớp 12 với AI',
];

export default function AiGuideChatbot() {
  return (
    <ChatbotPage
      title="Chatbot Hướng Dẫn Sử Dụng AI"
      subtitle="Học cách sử dụng AI đúng cách trong học tập"
      icon={<Brain size={20} style={{ color: 'var(--color-primary)' }} />}
      systemContext={SYSTEM_CONTEXT}
      starterPrompts={STARTERS}
    />
  );
}
