const COZE_API_BASE = (process.env.COZE_API_BASE ?? 'https://api.coze.com').replace(/\/$/, '');
const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 60000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function cozeFetch(path, options) {
  const response = await fetch(`${COZE_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.COZE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Coze API error: ${response.status} ${response.statusText} ${errorText}`);
  }

  return response.json();
}

async function createChat(userMessage, existingConversationId) {
  const body = {
    bot_id: process.env.COZE_BOT_ID,
    user_id: 'eduai_user_1',
    stream: false,
    auto_save_history: true,
    additional_messages: [{ role: 'user', content: userMessage, content_type: 'text' }],
  };

  if (existingConversationId) {
    body.conversation_id = existingConversationId;
  }

  const data = await cozeFetch('/v3/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const chatId = data?.data?.id;
  const conversationId = data?.data?.conversation_id;

  if (!chatId || !conversationId) {
    throw new Error(`Coze create chat response missing id/conversation_id: ${JSON.stringify(data)}`);
  }

  return { chatId, conversationId };
}

async function waitForChatCompletion(chatId, conversationId) {
  const start = Date.now();

  while (true) {
    if (Date.now() - start > POLL_TIMEOUT_MS) {
      throw new Error('Coze chat timed out after 60 seconds.');
    }

    const params = new URLSearchParams({
      chat_id: chatId,
      conversation_id: conversationId,
    });

    const data = await cozeFetch(`/v3/chat/retrieve?${params.toString()}`, {
      method: 'GET',
    });

    const status = data?.data?.status;

    if (status === 'completed') return;
    if (status === 'in_progress' || status === 'created') {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }
    if (status === 'failed') {
      throw new Error(`Coze chat failed: ${JSON.stringify(data)}`);
    }

    throw new Error(`Unexpected Coze chat status "${String(status)}": ${JSON.stringify(data)}`);
  }
}

async function listMessages(chatId, conversationId) {
  const params = new URLSearchParams({
    chat_id: chatId,
    conversation_id: conversationId,
  });

  const data = await cozeFetch(`/v3/chat/message/list?${params.toString()}`, {
    method: 'GET',
  });

  return Array.isArray(data?.data) ? data.data : [];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.COZE_API_KEY || !process.env.COZE_BOT_ID) {
    res.status(500).json({
      error: 'Missing COZE_API_KEY or COZE_BOT_ID on the server. Add them in Vercel Project Settings → Environment Variables (without VITE_ prefix), then redeploy.',
    });
    return;
  }

  try {
    const { message, conversation_id: existingConversationId } = await readJsonBody(req);

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing message.' });
      return;
    }

    const { chatId, conversationId } = await createChat(message, existingConversationId);
    await waitForChatCompletion(chatId, conversationId);

    const messages = await listMessages(chatId, conversationId);
    const answer = messages.find((item) => item.role === 'assistant' && item.type === 'answer');

    if (!answer?.content) {
      throw new Error(`Assistant answer not found: ${JSON.stringify(messages)}`);
    }

    res.status(200).json({
      content: answer.content,
      conversation_id: conversationId,
    });
  } catch (error) {
    console.error('Coze function error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown Coze API error.',
    });
  }
}
