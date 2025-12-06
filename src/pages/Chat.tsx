import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, Mic, Upload, Trash2, Download, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t(
          'I understand your question. In Pakistan, women have specific legal rights under various laws. Could you tell me more about your specific situation so I can provide more accurate guidance?',
          'میں آپ کا سوال سمجھ گئی ہوں۔ پاکستان میں، خواتین کے مختلف قوانین کے تحت مخصوص قانونی حقوق ہیں۔ کیا آپ مجھے اپنی مخصوص صورتحال کے بارے میں مزید بتا سکتے ہیں تاکہ میں زیادہ درست رہنمائی فراہم کر سکوں؟'
        ),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-4xl">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                {t('AI Legal Assistant', 'AI قانونی معاون')}
              </CardTitle>
              <div className="flex gap-2">
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
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
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
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <CardContent className="border-t pt-4">
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
              <Button onClick={handleSend} disabled={!input.trim()}>
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
