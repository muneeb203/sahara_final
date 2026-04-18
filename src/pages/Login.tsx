import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Email / Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [emailLoading, setEmailLoading] = useState(false);

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const redirectAfterLogin = () => navigate('/');

  // ── Email / Password ──────────────────────────────────────────────────────
  const handleEmailSubmit = async () => {
    if (!email || !password) {
      toast.error(t('Please fill all fields', 'براہ کرم تمام فیلڈز بھریں'));
      return;
    }

    setEmailLoading(true);

    if (emailMode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('Login successful!', 'لاگ ان کامیاب!'));
        redirectAfterLogin();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(
          t(
            'Account created! Check your email to confirm.',
            'اکاؤنٹ بن گیا! تصدیق کے لیے اپنی ای میل چیک کریں۔'
          )
        );
      }
    }

    setEmailLoading(false);
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) {
      toast.error(t('Google login failed', 'گوگل لاگ ان ناکام'));
      return;
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('Login successful!', 'لاگ ان کامیاب!'));
      redirectAfterLogin();
    }
  };

  const handleGoogleError = () => {
    toast.error(t('Google login failed', 'گوگل لاگ ان ناکام'));
  };

  // ── Phone OTP ─────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone) {
      toast.error(t('Please enter phone number', 'براہ کرم فون نمبر درج کریں'));
      return;
    }

    setPhoneLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim() });
    if (error) {
      toast.error(error.message);
    } else {
      setOtpSent(true);
      toast.success(t('OTP sent to your number', 'آپ کے نمبر پر OTP بھیج دیا گیا'));
    }
    setPhoneLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error(t('Please enter OTP', 'براہ کرم OTP درج کریں'));
      return;
    }

    setPhoneLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: otp.trim(),
      type: 'sms',
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('Login successful!', 'لاگ ان کامیاب!'));
      redirectAfterLogin();
    }
    setPhoneLoading(false);
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
              {t('Choose your preferred login method', 'اپنا پسندیدہ لاگ ان طریقہ منتخب کریں')}
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

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">{t('Email', 'ای میل')}</TabsTrigger>
                <TabsTrigger value="phone">{t('Phone', 'فون')}</TabsTrigger>
              </TabsList>

              {/* ── Email Tab ── */}
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('Email', 'ای میل')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
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
                    autoComplete={emailMode === 'signin' ? 'current-password' : 'new-password'}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                  />
                </div>

                <Button onClick={handleEmailSubmit} className="w-full" disabled={emailLoading}>
                  {emailLoading
                    ? t('Please wait...', 'براہ کرم انتظار کریں...')
                    : emailMode === 'signin'
                    ? t('Login', 'لاگ ان')
                    : t('Create Account', 'اکاؤنٹ بنائیں')}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {emailMode === 'signin' ? (
                    <>
                      {t("Don't have an account?", 'اکاؤنٹ نہیں ہے؟')}{' '}
                      <button
                        type="button"
                        className="text-primary underline-offset-2 hover:underline"
                        onClick={() => setEmailMode('signup')}
                      >
                        {t('Sign Up', 'سائن اپ')}
                      </button>
                    </>
                  ) : (
                    <>
                      {t('Already have an account?', 'پہلے سے اکاؤنٹ ہے؟')}{' '}
                      <button
                        type="button"
                        className="text-primary underline-offset-2 hover:underline"
                        onClick={() => setEmailMode('signin')}
                      >
                        {t('Login', 'لاگ ان')}
                      </button>
                    </>
                  )}
                </p>
              </TabsContent>

              {/* ── Phone Tab ── */}
              <TabsContent value="phone" className="space-y-4">
                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('Phone Number', 'فون نمبر')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+92XXXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('Use international format e.g. +92XXXXXXXXXX', 'بین الاقوامی فارمیٹ استعمال کریں')}
                      </p>
                    </div>
                    <Button onClick={handleSendOtp} className="w-full" disabled={phoneLoading}>
                      {phoneLoading
                        ? t('Sending...', 'بھیجا جا رہا ہے...')
                        : t('Send OTP', 'OTP بھیجیں')}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {t('Enter the 6-digit code sent to', 'یہ کوڈ بھیجا گیا')} <strong>{phone}</strong>
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="otp">{t('OTP Code', 'OTP کوڈ')}</Label>
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                      />
                    </div>
                    <Button onClick={handleVerifyOtp} className="w-full" disabled={phoneLoading}>
                      {phoneLoading
                        ? t('Verifying...', 'تصدیق ہو رہی ہے...')
                        : t('Verify & Login', 'تصدیق کریں اور لاگ ان کریں')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => { setOtpSent(false); setOtp(''); }}
                    >
                      {t('Change number', 'نمبر تبدیل کریں')}
                    </Button>
                  </>
                )}
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
