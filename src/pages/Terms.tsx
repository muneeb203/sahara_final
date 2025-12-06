import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          {t('Terms of Service', 'خدمات کی شرائط')}
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('1. Acceptance of Terms', '1۔ شرائط کی قبولیت')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'By accessing and using Saharah, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.',
                  'صحارہ تک رسائی اور استعمال کرتے ہوئے، آپ اس معاہدے کی شرائط اور دفعات کو قبول کرتے ہیں اور ان کے پابند ہونے پر رضامند ہیں۔ اگر آپ ان شرائط سے اتفاق نہیں کرتے ہیں، تو براہ کرم ہماری خدمات استعمال نہ کریں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('2. Use of Services', '2۔ خدمات کا استعمال')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'Saharah provides legal information and connects users with legal professionals. The information provided is for general guidance only and should not be considered as legal advice. Users are advised to consult qualified lawyers for specific legal matters.',
                  'صحارہ قانونی معلومات فراہم کرتا ہے اور صارفین کو قانونی پیشہ ور افراد سے جوڑتا ہے۔ فراہم کردہ معلومات صرف عمومی رہنمائی کے لیے ہیں اور انہیں قانونی مشورے کے طور پر نہیں سمجھا جانا چاہیے۔ صارفین کو مشورہ دیا جاتا ہے کہ وہ مخصوص قانونی معاملات کے لیے قابل وکلاء سے مشورہ کریں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('3. Privacy and Confidentiality', '3۔ رازداری اور رازداری')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'We take your privacy seriously. All information shared on Saharah is encrypted and stored securely. We do not share your personal information with third parties without your consent. For more details, please refer to our Privacy Policy.',
                  'ہم آپ کی رازداری کو سنجیدگی سے لیتے ہیں۔ صحارہ پر شیئر کی گئی تمام معلومات خفیہ کردہ اور محفوظ طریقے سے محفوظ ہیں۔ ہم آپ کی رضامندی کے بغیر آپ کی ذاتی معلومات تیسرے فریق کے ساتھ شیئر نہیں کرتے ہیں۔ مزید تفصیلات کے لیے، براہ کرم ہماری رازداری کی پالیسی دیکھیں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('4. Emergency Services', '4۔ ایمرجنسی خدمات')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'In case of immediate danger, please contact local emergency services directly. The emergency button on Saharah is designed to notify your saved emergency contacts but should not replace calling emergency services (Police: 15, Helpline: 1092).',
                  'فوری خطرے کی صورت میں، براہ کرم براہ راست مقامی ایمرجنسی خدمات سے رابطہ کریں۔ صحارہ پر ایمرجنسی بٹن آپ کے محفوظ کردہ ایمرجنسی رابطوں کو مطلع کرنے کے لیے ڈیزائن کیا گیا ہے لیکن یہ ایمرجنسی خدمات کو کال کرنے کی جگہ نہیں لینا چاہیے (پولیس: 15، ہیلپ لائن: 1092)۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('5. Limitation of Liability', '5۔ ذمہ داری کی حد')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'Saharah and its team are not liable for any damages or losses resulting from the use or inability to use our services. We do not guarantee the accuracy or completeness of the legal information provided.',
                  'صحارہ اور اس کی ٹیم ہماری خدمات کے استعمال یا استعمال کی نااہلی کے نتیجے میں ہونے والے کسی بھی نقصان یا نقصانات کے لیے ذمہ دار نہیں ہیں۔ ہم فراہم کردہ قانونی معلومات کی درستگی یا مکمل ہونے کی ضمانت نہیں دیتے ہیں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('6. Changes to Terms', '6۔ شرائط میں تبدیلیاں')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'We reserve the right to modify these terms at any time. Users will be notified of any significant changes. Continued use of Saharah after changes constitutes acceptance of the new terms.',
                  'ہم کسی بھی وقت ان شرائط میں ترمیم کرنے کا حق محفوظ رکھتے ہیں۔ صارفین کو کسی بھی اہم تبدیلی کی اطلاع دی جائے گی۔ تبدیلیوں کے بعد صحارہ کا مسلسل استعمال نئی شرائط کی قبولیت کی تشکیل کرتا ہے۔'
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>{t('Last updated: January 2025', 'آخری اپ ڈیٹ: جنوری 2025')}</p>
        </div>
      </div>
    </div>
  );
}
