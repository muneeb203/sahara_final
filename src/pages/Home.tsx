import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Scale, Users, Shield, FileText, Phone } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: MessageSquare,
      title: t('AI Legal Assistant', 'AI قانونی معاون'),
      description: t(
        'Get instant answers to your legal questions in your language',
        'اپنی زبان میں اپنے قانونی سوالات کے فوری جوابات حاصل کریں'
      ),
      link: '/chat',
    },
    {
      icon: Scale,
      title: t('Know Your Rights', 'اپنے حقوق جانیں'),
      description: t(
        'Browse comprehensive database of women\'s rights laws',
        'خواتین کے حقوق کے قوانین کا جامع ڈیٹا بیس دیکھیں'
      ),
      link: '/laws',
    },
    {
      icon: Users,
      title: t('Find Legal Help', 'قانونی مدد تلاش کریں'),
      description: t(
        'Connect with verified lawyers specializing in women\'s rights',
        'خواتین کے حقوق میں مہارت رکھنے والے تصدیق شدہ وکلاء سے رابطہ کریں'
      ),
      link: '/lawyers',
    },
  ];

  const categories = [
    { name: t('Domestic Violence', 'گھریلو تشدد'), color: 'bg-primary' },
    { name: t('Harassment', 'ہراساں کرنا'), color: 'bg-accent' },
    { name: t('Marriage & Divorce', 'نکاح اور طلاق'), color: 'bg-secondary' },
    { name: t('Child Custody', 'بچے کی تحویل'), color: 'bg-muted' },
    { name: t('Property Rights', 'جائیداد کے حقوق'), color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-accent text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('Your Safety, Your Rights, Your Voice', 'آپ کی حفاظت، آپ کے حقوق، آپ کی آواز')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              {t(
                'Saharah empowers women with legal knowledge, professional support, and emergency assistance.',
                'صحارہ خواتین کو قانونی معلومات، پیشہ ورانہ مدد اور ایمرجنسی امداد کے ساتھ بااختیار بناتا ہے۔'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/chat">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t('Chat with AI Assistant', 'AI معاون سے بات کریں')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground text-lg">
                <Link to="/laws">
                  <Scale className="mr-2 h-5 w-5" />
                  {t('Explore Laws', 'قوانین دریافت کریں')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('How Saharah Helps You', 'صحارہ آپ کی کیسے مدد کرتا ہے')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Comprehensive support system designed with your safety and empowerment in mind',
                'آپ کی حفاظت اور بااختیاری کو مدنظر رکھتے ہوئے ڈیزائن کیا گیا جامع سپورٹ سسٹم'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lifted transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={feature.link}>{t('Learn More', 'مزید جانیں')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('Legal Topics We Cover', 'قانونی موضوعات جن کا ہم احاطہ کرتے ہیں')}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/laws"
                className="px-6 py-3 rounded-full bg-card hover:bg-accent hover:text-accent-foreground transition-colors shadow-soft font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent to-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-primary-foreground/90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('Get Help Now', 'ابھی مدد حاصل کریں')}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            {t(
              'Whether you need legal information, want to talk to a lawyer, or need emergency assistance, we\'re here for you.',
              'چاہے آپ کو قانونی معلومات کی ضرورت ہو، کسی وکیل سے بات کرنی ہو، یا ایمرجنسی امداد کی ضرورت ہو، ہم آپ کے لیے موجود ہیں۔'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                {t('Start Chatting', 'چیٹ شروع کریں')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground">
              <Link to="/lawyers">
                <Users className="mr-2 h-5 w-5" />
                {t('Find a Lawyer', 'وکیل تلاش کریں')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
