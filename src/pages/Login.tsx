import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePhoneLogin = () => {
    if (!phoneNumber) {
      toast.error(t('Please enter phone number', 'براہ کرم فون نمبر درج کریں'));
      return;
    }
    login();
    toast.success(t('Login successful!', 'لاگ ان کامیاب!'));
    navigate('/');
  };

  const handleEmailLogin = () => {
    if (!email || !password) {
      toast.error(t('Please fill all fields', 'براہ کرم تمام فیلڈز بھریں'));
      return;
    }
    login();
    toast.success(t('Login successful!', 'لاگ ان کامیاب!'));
    navigate('/');
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      // Decode JWT token to get user info
      const token = credentialResponse.credential;
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const userData = JSON.parse(jsonPayload);
        
        login({
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
        });
        
        toast.success(t('Login successful!', 'لاگ ان کامیاب!'));
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(t('Login failed. Please try again.', 'لاگ ان ناکام۔ براہ کرم دوبارہ کوشش کریں۔'));
    }
  };

  const handleGoogleError = () => {
    toast.error(t('Google login failed', 'گوگل لاگ ان ناکام'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-muted/50">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('Welcome to Saharah', 'صحارہ میں خوش آمدید')}
          </h1>
          <p className="text-muted-foreground">
            {t('Login to access your account', 'اپنے اکاؤنٹ تک رسائی کے لیے لاگ ان کریں')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('Login / Sign Up', 'لاگ ان / سائن اپ')}</CardTitle>
            <CardDescription>
              {t(
                'Choose your preferred login method',
                'اپنا پسندیدہ لاگ ان طریقہ منتخب کریں'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign-In */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  text="signin_with"
                  shape="rectangular"
                  size="large"
                  width="100%"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('Or continue with', 'یا جاری رکھیں')}
                  </span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone">{t('Phone', 'فون')}</TabsTrigger>
                <TabsTrigger value="email">{t('Email', 'ای میل')}</TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('Phone Number', 'فون نمبر')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92-XXX-XXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handlePhoneLogin} className="w-full">
                  {t('Send OTP', 'OTP بھیجیں')}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {t(
                    'You will receive an OTP code to verify your number',
                    'آپ کو اپنے نمبر کی تصدیق کے لیے ایک OTP کوڈ ملے گا'
                  )}
                </p>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('Email', 'ای میل')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('your@email.com', 'your@email.com')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('Password', 'پاس ورڈ')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleEmailLogin} className="w-full">
                  {t('Login', 'لاگ ان')}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t(
            'By continuing, you agree to our Terms of Service and Privacy Policy',
            'جاری رکھ کر، آپ ہماری خدمات کی شرائط اور رازداری کی پالیسی سے اتفاق کرتے ہیں'
          )}
        </p>
      </div>
    </div>
  );
}
