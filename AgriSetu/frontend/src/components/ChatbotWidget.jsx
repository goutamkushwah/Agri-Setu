import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const GUEST_KEY = 'agri_setu_guest_id';
const SESSION_KEY = 'agri_setu_chat_session_id';

const getGuestId = () => {
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
};

const ChatbotWidget = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am Agri-Setu help bot. Ask about products, orders, delivery, or how to sign up.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY));
  const bottomRef = useRef(null);

  // Drop stale guest session when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem(SESSION_KEY);
      setSessionId(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const postChat = async (text, retryWithoutSession = false) => {
    const payload = {
      message: text,
      sessionId:
        !retryWithoutSession && sessionId ? parseInt(sessionId, 10) : undefined,
      guestId: isAuthenticated ? undefined : getGuestId()
    };
    return axios.post('/api/v1/chat/message', payload);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      let response;
      try {
        response = await postChat(text);
      } catch (firstError) {
        const status = firstError?.response?.status;
        if (status === 404 || status === 403) {
          localStorage.removeItem(SESSION_KEY);
          setSessionId(null);
          response = await postChat(text, true);
        } else {
          throw firstError;
        }
      }
      const { sessionId: newSessionId, reply } = response.data.data;
      if (newSessionId) {
        setSessionId(String(newSessionId));
        localStorage.setItem(SESSION_KEY, String(newSessionId));
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      const apiMsg = error?.response?.data?.message;
      const errMsg = apiMsg
        ? apiMsg
        : error?.code === 'ERR_NETWORK'
          ? 'Cannot reach the server. Start the backend (npm run dev in the backend folder) on port 5000, then try again.'
          : 'Could not reach the assistant. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {open && (
        <Card className="fixed bottom-6 right-6 w-[min(100vw-2rem,380px)] h-[min(70vh,520px)] flex flex-col shadow-xl z-50">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="font-semibold">Agri-Setu Assistant</p>
              <p className="text-xs text-muted-foreground">Quick help</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground w-fit">
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t p-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
};

export default ChatbotWidget;
