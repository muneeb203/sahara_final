import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, Mic, Upload, Trash2, Download, Bot, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { sendChatMessage, checkApiHealth, type ChatMessage as ApiChatMessage } from '@/lib/api';
import '@/lib/debug'; // Import debug utilities

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t(
        'Hello! I\'m your AI legal assistant. I can help you understand women\'s rights laws, answer your questions, and guide you through legal processes. How can I help you today?',
        'ہیلو! میں آپ کی AI قانونی معاون ہوں۔ میں آپ کو خواتین کے حقوق کے قوانین سمجھنے، آپ کے سوالات کے جوابات دینے، اور قانونی عمل میں آپ کی رہنمائی کر سکتی ہوں۔ آج میں آپ کی کیسے مدد کر سکتی ہوں؟'
      ),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Only scroll if user is near the bottom or if it's a new message
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      console.log('🔍 Checking API health...');
      const healthy = await checkApiHealth();
      console.log('🏥 API Health result:', healthy);
      setIsApiHealthy(healthy);
      if (!healthy) {
        console.error('❌ API health check failed');
        toast.error(t(
          'Unable to connect to AI assistant. Please check your connection.',
          'AI معاون سے رابطہ نہیں ہو سکا۔ براہ کرم اپنا کنکشن چیک کریں۔'
        ));
      } else {
        console.log('✅ API is healthy');
      }
    };
    checkHealth();
  }, [t]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Convert messages to API format for conversation history
      const conversationHistory: ApiChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Send message to AI via ngrok tunnel
      const aiResponse = await sendChatMessage(currentInput, conversationHistory);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback message in case of API failure
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t(
          'I apologize, but I\'m having trouble connecting to the server right now. Please try again in a moment. If the problem persists, please check your internet connection.',
          'معذرت، لیکن مجھے فی الوقت سرور سے رابطہ کرنے میں مسئلہ ہو رہا ہے۔ براہ کرم ایک لمحے میں دوبارہ کوشش کریں۔ اگر مسئلہ برقرار رہے تو براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں۔'
        ),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      
      toast.error(t(
        'Failed to get response from AI assistant',
        'AI معاون سے جواب حاصل کرنے میں ناکام'
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: t(
          'Hello! I\'m your AI legal assistant. I can help you understand women\'s rights laws, answer your questions, and guide you through legal processes. How can I help you today?',
          'ہیلو! میں آپ کی AI قانونی معاون ہوں۔ میں آپ کو خواتین کے حقوق کے قوانین سمجھنے، آپ کے سوالات کے جوابات دینے، اور قانونی عمل میں آپ کی رہنمائی کر سکتی ہوں۔ آج میں آپ کی کیسے مدد کر سکتی ہوں؟'
        ),
        timestamp: new Date(),
      },
    ]);
    toast.success(t('Chat cleared', 'چیٹ صاف ہو گئی'));
  };

  const handleDownload = () => {
    toast.success(t('Transcript downloaded', 'ٹرانسکرپٹ ڈاؤن لوڈ ہو گیا'));
  };

  const handleVoiceInput = () => {
    toast.info(t('Voice input feature coming soon', 'آواز ان پٹ فیچر جلد آ رہا ہے'));
  };

  const handleFileUpload = () => {
    toast.info(t('File upload feature coming soon', 'فائل اپ لوڈ فیچر جلد آ رہا ہے'));
  };

  const handleRetryConnection = async () => {
    setIsApiHealthy(null); // Set to loading state
    const healthy = await checkApiHealth();
    setIsApiHealthy(healthy);
    
    if (healthy) {
      toast.success(t('Connected to AI assistant', 'AI معاون سے رابطہ ہو گیا'));
    } else {
      toast.error(t('Still unable to connect', 'اب بھی رابطہ نہیں ہو سکا'));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-6 flex flex-col max-w-4xl chat-container">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                {t('AI Legal Assistant', 'AI قانونی معاون')}
                {/* Connection Status Indicator */}
                <div className="flex items-center gap-1 ml-2">
                  {isApiHealthy === null ? (
                    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                  ) : isApiHealthy ? (
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {isApiHealthy === null 
                      ? t('Connecting...', 'رابطہ کر رہے ہیں...')
                      : isApiHealthy 
                        ? t('Online', 'آن لائن')
                        : t('Offline', 'آف لائن')
                    }
                  </span>
                </div>
              </CardTitle>
              <div className="flex gap-2">
                {isApiHealthy === false && (
                  <Button variant="outline" size="sm" onClick={handleRetryConnection}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {t('Retry', 'دوبارہ کوشش')}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download', 'ڈاؤن لوڈ')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearChat}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('Clear', 'صاف کریں')}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-accent' : 'bg-primary'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-accent-foreground" />
                  ) : (
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-8" />
          </CardContent>

          {/* Input */}
          <CardContent className="border-t pt-4 pb-4 flex-shrink-0 bg-background/95 backdrop-blur-sm">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleVoiceInput}>
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleFileUpload}>
                <Upload className="h-5 w-5" />
              </Button>
              <Input
                placeholder={t('Type your question...', 'اپنا سوال ٹائپ کریں...')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping || isApiHealthy === false}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t(
                'This AI assistant provides general legal information. For specific legal advice, please consult a qualified lawyer.',
                'یہ AI معاون عام قانونی معلومات فراہم کرتی ہے۔ مخصوص قانونی مشورے کے لیے، براہ کرم ایک قابل وکیل سے مشورہ کریں۔'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
