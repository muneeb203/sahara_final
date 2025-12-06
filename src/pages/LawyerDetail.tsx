import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Phone, Mail, MapPin, Briefcase, Award } from 'lucide-react';

export default function LawyerDetail() {
  const { id } = useParams();
  const { t } = useLanguage();

  // Mock data
  const lawyer = {
    id: id || '1',
    name: t('Advocate Ayesha Khan', 'ایڈووکیٹ عائشہ خان'),
    city: t('Karachi', 'کراچی'),
    gender: t('Female', 'خاتون'),
    phone: '+92-300-1234567',
    email: 'ayesha.khan@lawfirm.com',
    experience: t('12 years', '12 سال'),
    specializations: [
      t('Family Law', 'فیملی لاء'),
      t('Domestic Violence', 'گھریلو تشدد'),
      t('Child Custody', 'بچے کی تحویل'),
    ],
    education: t('LLB from University of Karachi, LLM from Punjab University', 'کراچی یونیورسٹی سے LLB، پنجاب یونیورسٹی سے LLM'),
    languages: t('Urdu, English, Sindhi', 'اردو، انگریزی، سندھی'),
    barCouncil: t('Sindh Bar Council', 'سندھ بار کونسل'),
    about: t(
      'Advocate Ayesha Khan is a dedicated legal professional with over 12 years of experience in women\'s rights and family law. She has successfully represented numerous clients in cases related to domestic violence, divorce, and child custody. Her compassionate approach and strong legal expertise make her a trusted advocate for women seeking justice.',
      'ایڈووکیٹ عائشہ خان خواتین کے حقوق اور فیملی لاء میں 12 سال سے زیادہ تجربے کے ساتھ ایک سرشار قانونی پیشہ ور ہیں۔ انہوں نے گھریلو تشدد، طلاق، اور بچے کی تحویل سے متعلق معاملات میں متعدد مؤکلین کی کامیابی سے نمائندگی کی ہے۔ ان کا ہمدردانہ انداز اور مضبوط قانونی مہارت انہیں انصاف کی تلاش میں خواتین کے لیے ایک قابل اعتماد وکیل بناتی ہے۔'
    ),
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/lawyers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Back to Lawyers', 'وکلاء پر واپس')}
          </Link>
        </Button>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-16 w-16 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{lawyer.name}</CardTitle>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{lawyer.city}</span>
                    <span className="text-sm">• {lawyer.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>{lawyer.experience} {t('experience', 'تجربہ')}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {lawyer.specializations.map((spec, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button asChild size="lg" className="w-full">
                <a href={`tel:${lawyer.phone}`}>
                  <Phone className="h-5 w-5 mr-2" />
                  {t('Call Now', 'ابھی کال کریں')}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <a href={`mailto:${lawyer.email}`}>
                  <Mail className="h-5 w-5 mr-2" />
                  {t('Send Email', 'ای میل بھیجیں')}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('About', 'کے بارے میں')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{lawyer.about}</p>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('Contact Information', 'رابطہ کی معلومات')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${lawyer.phone}`} className="hover:text-primary">
                  {lawyer.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lawyer.email}`} className="hover:text-primary">
                  {lawyer.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{lawyer.city}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('Professional Details', 'پیشہ ورانہ تفصیلات')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">{t('Education', 'تعلیم')}</p>
                <p className="font-medium">{lawyer.education}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">{t('Bar Council', 'بار کونسل')}</p>
                <p className="font-medium">{lawyer.barCouncil}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">{t('Languages', 'زبانیں')}</p>
                <p className="font-medium">{lawyer.languages}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
