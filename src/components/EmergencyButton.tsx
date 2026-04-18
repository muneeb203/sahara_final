import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const EmergencyButton = () => {
  const { t } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const [sending, setSending] = useState(false);

  const handleEmergency = async () => {
    if (!isLoggedIn || !user) {
      toast.error(
        t('Please log in to use emergency alert', 'ایمرجنسی الرٹ کے لیے براہ کرم لاگ ان کریں'),
        { action: { label: t('Login', 'لاگ ان'), onClick: () => window.location.href = '/login' } }
      );
      return;
    }

    if (sending) return;

    // Ask confirmation to avoid accidental triggers
    const confirmed = window.confirm(
      t(
        '🚨 Send your live location to ALL emergency contacts?',
        '🚨 کیا آپ اپنا مقام تمام ایمرجنسی رابطوں کو بھیجنا چاہتے ہیں؟'
      )
    );
    if (!confirmed) return;

    setSending(true);

    // 1. Get GPS location
    const getPosition = (): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

    let position: GeolocationPosition;
    try {
      position = await getPosition();
    } catch {
      toast.error(
        t('Could not get your location. Please allow location access.', 'مقام حاصل نہیں ہو سکا۔ براہ کرم لوکیشن کی اجازت دیں۔')
      );
      setSending(false);
      return;
    }

    const { latitude, longitude } = position.coords;

    // 2. Fetch all saved emergency contacts
    const { data: contacts, error } = await supabase
      .from('emergency_contacts')
      .select('id, name, phone')
      .eq('user_id', user.id);

    if (error || !contacts || contacts.length === 0) {
      toast.error(
        t('No emergency contacts found. Please add contacts first.', 'کوئی ایمرجنسی رابطہ نہیں ملا۔ پہلے رابطے شامل کریں۔')
      );
      setSending(false);
      return;
    }

    // 3. Send location to each contact one by one
    let successCount = 0;
    let failCount = 0;

    for (const contact of contacts) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-location`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              to: contact.phone,
              lat: latitude,
              lng: longitude,
              contactName: contact.name,
              senderName: user.name || user.email || 'Saharah User',
            }),
          }
        );

        const result = await response.json();
        if (!response.ok) throw new Error(result?.error || 'Failed');
        successCount++;
      } catch {
        failCount++;
      }
    }

    // 4. Show result summary
    if (successCount > 0 && failCount === 0) {
      toast.success(
        t(
          `✅ Location sent to ${successCount} contact${successCount > 1 ? 's' : ''}!`,
          `✅ مقام ${successCount} رابطوں کو بھیج دیا گیا!`
        )
      );
    } else if (successCount > 0 && failCount > 0) {
      toast.warning(
        t(
          `⚠️ Sent to ${successCount}, failed for ${failCount} contact${failCount > 1 ? 's' : ''}.`,
          `⚠️ ${successCount} کو بھیجا گیا، ${failCount} ناکام رہے۔`
        )
      );
    } else {
      toast.error(
        t('Failed to send location to any contact.', 'کسی رابطے کو مقام بھیجنے میں ناکامی۔')
      );
    }

    setSending(false);
  };

  return (
    <Button
      onClick={handleEmergency}
      disabled={sending}
      className="fixed bottom-20 right-6 z-50 h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lifted disabled:opacity-80"
      size="icon"
      title={t('Emergency Help — Send location to all contacts', 'ایمرجنسی مدد — تمام رابطوں کو مقام بھیجیں')}
    >
      {sending ? (
        <Loader2 className="h-6 w-6 text-destructive-foreground animate-spin" />
      ) : (
        <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
      )}
      <span className="sr-only">{t('Emergency Help', 'ایمرجنسی مدد')}</span>
    </Button>
  );
};
