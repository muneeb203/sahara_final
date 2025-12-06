import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const QuickEscapeButton = () => {
  const { t } = useLanguage();

  const handleQuickEscape = () => {
    window.location.href = 'https://www.youtube.com';
  };

  return (
    <Button
      onClick={handleQuickEscape}
      variant="outline"
      size="sm"
      className="fixed top-20 right-6 z-50 bg-card/95 backdrop-blur shadow-medium"
      title={t('Quick Escape', 'فوری فرار')}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {t('Quick Escape', 'فوری فرار')}
    </Button>
  );
};
