import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const EmergencyButton = () => {
  const { t } = useLanguage();

  const handleEmergency = () => {
    // In a real app, this would trigger emergency protocols
    toast.error(t('Emergency Alert Sent!', 'ایمرجنسی الرٹ بھیجا گیا!'), {
      description: t(
        'Your emergency contacts have been notified.',
        'آپ کے ایمرجنسی رابطے کو مطلع کر دیا گیا ہے۔'
      ),
    });
  };

  return (
    <Button
      onClick={handleEmergency}
      className="fixed bottom-20 right-6 z-50 h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lifted"
      size="icon"
      title={t('Emergency Help', 'ایمرجنسی مدد')}
    >
      <Phone className="h-6 w-6 text-destructive-foreground" />
      <span className="sr-only">{t('Emergency Help', 'ایمرجنسی مدد')}</span>
    </Button>
  );
};
