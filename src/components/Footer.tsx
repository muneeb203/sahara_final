import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">Saharah</h3>
            <p className="text-sm text-muted-foreground">
              {t(
                'Empowering women with legal knowledge and support',
                'قانونی معلومات اور تعاون کے ساتھ خواتین کو بااختیار بنانا'
              )}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">
              {t('Quick Links', 'فوری لنکس')}
            </h4>
            <div className="space-y-2 text-sm">
              <Link to="/terms" className="block text-muted-foreground hover:text-primary">
                {t('Terms of Service', 'خدمات کی شرائط')}
              </Link>
              <Link to="/privacy" className="block text-muted-foreground hover:text-primary">
                {t('Privacy Policy', 'رازداری کی پالیسی')}
              </Link>
              <Link to="/chat" className="block text-muted-foreground hover:text-primary">
                {t('Get Help', 'مدد حاصل کریں')}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">
              {t('Contact', 'رابطہ')}
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t('Email: support@saharah.com', 'ای میل: support@saharah.com')}</p>
              <p>{t('Emergency Helpline: 1092', 'ایمرجنسی ہیلپ لائن: 1092')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Saharah. {t('All rights reserved.', 'تمام حقوق محفوظ ہیں۔')}
          </p>
        </div>
      </div>
    </footer>
  );
};
