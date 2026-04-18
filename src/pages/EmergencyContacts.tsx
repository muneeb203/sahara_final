import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Phone, UserPlus, Trash2, LogIn, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Contact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
};

export default function EmergencyContacts() {
  const { t } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [sendingLocation, setSendingLocation] = useState<string | null>(null); // contact id

  const relationships = [
    { value: 'mother', label: t('Mother', 'والدہ') },
    { value: 'father', label: t('Father', 'والد') },
    { value: 'sister', label: t('Sister', 'بہن') },
    { value: 'brother', label: t('Brother', 'بھائی') },
    { value: 'friend', label: t('Friend', 'دوست') },
    { value: 'other', label: t('Other', 'دیگر') },
  ];

  // Load contacts from DB when logged in
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchContacts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('id, name, phone, relationship')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error(t('Failed to load contacts', 'رابطے لوڈ نہیں ہوئے'));
      } else {
        setContacts((data as Contact[]) || []);
      }
      setLoading(false);
    };

    fetchContacts();
  }, [isLoggedIn, user]);

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast.error(t('Please fill all fields', 'براہ کرم تمام فیلڈز بھریں'));
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({ ...newContact, user_id: user!.id })
      .select('id, name, phone, relationship')
      .single();

    if (error) {
      toast.error(t('Failed to save contact', 'رابطہ محفوظ نہیں ہوا'));
    } else {
      setContacts((prev) => [...prev, data as Contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setIsAdding(false);
      toast.success(t('Emergency contact added', 'ایمرجنسی رابطہ شامل کیا گیا'));
    }
    setSaving(false);
  };

  const handleSendLocation = async (contact: Contact) => {
    if (!navigator.geolocation) {
      toast.error(t('Geolocation is not supported by your browser', 'آپ کا براؤزر جیو لوکیشن سپورٹ نہیں کرتا'));
      return;
    }

    setSendingLocation(contact.id);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
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
                senderName: user?.name || user?.email || 'Saharah User',
              }),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result?.error || 'Failed to send location');
          }

          toast.success(
            t(`Location sent to ${contact.name}`, `مقام ${contact.name} کو بھیج دیا گیا`)
          );
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : t('Failed to send location', 'مقام بھیجنے میں ناکامی')
          );
        } finally {
          setSendingLocation(null);
        }
      },
      (err) => {
        setSendingLocation(null);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error(t('Location access denied. Please allow location in browser settings.', 'لوکیشن تک رسائی سے انکار کر دیا گیا۔'));
        } else {
          toast.error(t('Could not get your location', 'آپ کا مقام حاصل نہیں ہو سکا'));
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', user!.id);

    if (error) {
      toast.error(t('Failed to delete contact', 'رابطہ حذف نہیں ہوا'));
    } else {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success(t('Contact deleted', 'رابطہ حذف ہو گیا'));
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('Emergency Contacts', 'ایمرجنسی رابطے')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'Add trusted contacts who will be notified in case of emergency',
              'قابل اعتماد رابطے شامل کریں جنہیں ایمرجنسی کی صورت میں مطلع کیا جائے گا'
            )}
          </p>
        </div>

        {/* Login prompt */}
        {!isLoggedIn && (
          <Card className="mb-6 border-primary/20">
            <CardContent className="py-8 text-center space-y-4">
              <p className="text-muted-foreground">
                {t(
                  'Log in to save and manage your emergency contacts.',
                  'ایمرجنسی رابطے محفوظ کرنے اور ان کا انتظام کرنے کے لیے لاگ ان کریں۔'
                )}
              </p>
              <Button asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('Login to Continue', 'جاری رکھنے کے لیے لاگ ان کریں')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Contact Button — only when logged in */}
        {isLoggedIn && !isAdding && (
          <Button onClick={() => setIsAdding(true)} className="mb-6 w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            {t('Add New Contact', 'نیا رابطہ شامل کریں')}
          </Button>
        )}

        {/* Add Contact Form */}
        {isLoggedIn && isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('Add Emergency Contact', 'ایمرجنسی رابطہ شامل کریں')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('Name', 'نام')}</Label>
                <Input
                  id="name"
                  placeholder={t('Enter name', 'نام درج کریں')}
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">{t('Phone Number', 'فون نمبر')}</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="+92-XXX-XXXXXXX"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">{t('Relationship', 'رشتہ')}</Label>
                <Select
                  value={newContact.relationship}
                  onValueChange={(value) => setNewContact({ ...newContact, relationship: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select relationship', 'رشتہ منتخب کریں')} />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddContact} className="flex-1" disabled={saving}>
                  {saving ? t('Saving...', 'محفوظ ہو رہا ہے...') : t('Save Contact', 'رابطہ محفوظ کریں')}
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  {t('Cancel', 'منسوخ کریں')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts List */}
        {isLoggedIn && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              {t('Your Emergency Contacts', 'آپ کے ایمرجنسی رابطے')}
            </h2>

            {loading && (
              <p className="text-sm text-muted-foreground">{t('Loading...', 'لوڈ ہو رہا ہے...')}</p>
            )}

            {!loading && contacts.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {t('No emergency contacts added yet', 'ابھی تک کوئی ایمرجنسی رابطہ شامل نہیں کیا گیا')}
                  </p>
                  <Button onClick={() => setIsAdding(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('Add Your First Contact', 'اپنا پہلا رابطہ شامل کریں')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <span className="inline-block mt-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                        {relationships.find((r) => r.value === contact.relationship)?.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="default" size="sm">
                        <a href={`tel:${contact.phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          {t('Call', 'کال')}
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={sendingLocation === contact.id}
                        onClick={() => handleSendLocation(contact)}
                      >
                        {sendingLocation === contact.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-1" />
                        )}
                        {sendingLocation === contact.id
                          ? t('Sending...', 'بھیجا جا رہا ہے...')
                          : t('Send Loc', 'مقام بھیجیں')}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(contact.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
