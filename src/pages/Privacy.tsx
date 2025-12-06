import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          {t('Privacy Policy', 'رازداری کی پالیسی')}
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('1. Information We Collect', '1۔ ہم جو معلومات جمع کرتے ہیں')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'We collect information that you provide directly to us, including your name, contact information, and any details you share while using our services. We also collect information about how you use Saharah, including your interactions with the AI assistant and legal resources.',
                  'ہم وہ معلومات جمع کرتے ہیں جو آپ براہ راست ہمیں فراہم کرتے ہیں، بشمول آپ کا نام، رابطے کی معلومات، اور کوئی بھی تفصیلات جو آپ ہماری خدمات استعمال کرتے ہوئے شیئر کرتے ہیں۔ ہم اس بارے میں بھی معلومات جمع کرتے ہیں کہ آپ صحارہ کو کیسے استعمال کرتے ہیں، بشمول AI معاون اور قانونی وسائل کے ساتھ آپ کے تعاملات۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('2. How We Use Your Information', '2۔ ہم آپ کی معلومات کیسے استعمال کرتے ہیں')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'Your information is used to provide and improve our services, connect you with legal professionals, respond to your inquiries, send important notifications, and ensure the security of our platform. We never sell your personal information to third parties.',
                  'آپ کی معلومات ہماری خدمات فراہم کرنے اور بہتر بنانے، آپ کو قانونی پیشہ ور افراد سے جوڑنے، آپ کی پوچھ گچھ کا جواب دینے، اہم اطلاعات بھیجنے، اور ہمارے پلیٹ فارم کی حفاظت کو یقینی بنانے کے لیے استعمال کی جاتی ہیں۔ ہم کبھی بھی آپ کی ذاتی معلومات تیسرے فریق کو نہیں بیچتے ہیں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('3. Data Security', '3۔ ڈیٹا کی حفاظت')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'We implement industry-standard security measures to protect your data. All sensitive information is encrypted both in transit and at rest. We regularly update our security protocols to protect against unauthorized access, alteration, or destruction of your information.',
                  'ہم آپ کے ڈیٹا کی حفاظت کے لیے انڈسٹری معیاری حفاظتی اقدامات نافذ کرتے ہیں۔ تمام حساس معلومات ٹرانزٹ اور آرام دونوں میں خفیہ کردہ ہیں۔ ہم آپ کی معلومات کی غیر مجاز رسائی، تبدیلی، یا تباہی کے خلاف حفاظت کے لیے اپنے حفاظتی پروٹوکول کو باقاعدگی سے اپ ڈیٹ کرتے ہیں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('4. Emergency Contact Information', '4۔ ایمرجنسی رابطے کی معلومات')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'Emergency contacts you save on Saharah are stored securely and are only accessed when you activate the emergency alert feature. These contacts will be notified via SMS when you trigger an emergency alert.',
                  'صحارہ پر آپ جو ایمرجنسی رابطے محفوظ کرتے ہیں وہ محفوظ طریقے سے محفوظ ہیں اور صرف اس وقت رسائی ہوتی ہے جب آپ ایمرجنسی الرٹ فیچر کو فعال کرتے ہیں۔ جب آپ ایمرجنسی الرٹ ٹرگر کرتے ہیں تو ان رابطوں کو SMS کے ذریعے مطلع کیا جائے گا۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('5. Third-Party Services', '5۔ تیسرے فریق کی خدمات')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'Saharah may integrate with third-party services (such as payment processors or communication platforms) to provide our services. These third parties have their own privacy policies, and we encourage you to review them.',
                  'صحارہ ہماری خدمات فراہم کرنے کے لیے تیسرے فریق کی خدمات (جیسے کہ ادائیگی پروسیسرز یا مواصلاتی پلیٹ فارم) کے ساتھ مربوط ہو سکتا ہے۔ ان تیسرے فریقوں کی اپنی رازداری کی پالیسیاں ہیں، اور ہم آپ کو ان کا جائزہ لینے کی ترغیب دیتے ہیں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('6. Your Rights', '6۔ آپ کے حقوق')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'You have the right to access, correct, or delete your personal information at any time. You can also request a copy of your data or restrict its processing. To exercise these rights, please contact us at support@saharah.com.',
                  'آپ کو کسی بھی وقت اپنی ذاتی معلومات تک رسائی، درست کرنے، یا حذف کرنے کا حق ہے۔ آپ اپنے ڈیٹا کی ایک کاپی کی درخواست بھی کر سکتے ہیں یا اس کی پروسیسنگ کو محدود کر سکتے ہیں۔ ان حقوق کو استعمال کرنے کے لیے، براہ کرم support@saharah.com پر ہم سے رابطہ کریں۔'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('7. Changes to Privacy Policy', '7۔ رازداری کی پالیسی میں تبدیلیاں')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                {t(
                  'We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.',
                  'ہم وقتاً فوقتاً اس رازداری کی پالیسی کو اپ ڈیٹ کر سکتے ہیں۔ ہم اس صفحے پر نئی پالیسی پوسٹ کرکے اور "آخری اپ ڈیٹ" کی تاریخ کو اپ ڈیٹ کرکے آپ کو کسی بھی اہم تبدیلی کی اطلاع دیں گے۔'
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>{t('Last updated: January 2025', 'آخری اپ ڈیٹ: جنوری 2025')}</p>
          <p className="mt-2">
            {t('Contact us: support@saharah.com', 'ہم سے رابطہ کریں: support@saharah.com')}
          </p>
        </div>
      </div>
    </div>
  );
}
