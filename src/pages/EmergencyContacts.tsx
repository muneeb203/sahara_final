import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, UserPlus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

type Contact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
};

export default function EmergencyContacts() {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: t('Sister - Fatima', 'بہن - فاطمہ'),
      phone: '+92-300-1234567',
      relationship: 'sister',
    },
    {
      id: '2',
      name: t('Friend - Sarah', 'دوست - سارہ'),
      phone: '+92-301-2345678',
      relationship: 'friend',
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const relationships = [
    { value: 'mother', label: t('Mother', 'والدہ') },
    { value: 'father', label: t('Father', 'والد') },
    { value: 'sister', label: t('Sister', 'بہن') },
    { value: 'brother', label: t('Brother', 'بھائی') },
    { value: 'friend', label: t('Friend', 'دوست') },
    { value: 'other', label: t('Other', 'دیگر') },
  ];

  const requireLogin = (action: () => void) => {
    if (!isLoggedIn) {
      toast.error(
        t('Please log in to use this feature', 'اس فیچر کو استعمال کرنے کے لیے براہ کرم لاگ ان کریں'),
        {
          action: {
            label: t('Login', 'لاگ ان'),
            onClick: () => window.location.href = '/login',
          },
        }
      );
      return;
    }
    action();
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast.error(t('Please fill all fields', 'براہ کرم تمام فیلڈز بھریں'));
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
    };
    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setIsAdding(false);
    toast.success(t('Emergency contact added', 'ایمرجنسی رابطہ شامل کیا گیا'));
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success(t('Contact deleted', 'رابطہ حذف ہو گیا'));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
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

        {/* Add Contact Button */}
        {!isAdding && (
          <Button onClick={() => requireLogin(() => setIsAdding(true))} className="mb-6 w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            {t('Add New Contact', 'نیا رابطہ شامل کریں')}
          </Button>
        )}

        {/* Add Contact Form */}
        {isAdding && (
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
                <Label htmlFor="phone">{t('Phone Number', 'فون نمبر')}</Label>
                <Input
                  id="phone"
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
                <Button onClick={() => requireLogin(handleAddContact)} className="flex-1">
                  {t('Save Contact', 'رابطہ محفوظ کریں')}
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  {t('Cancel', 'منسوخ کریں')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {t('Your Emergency Contacts', 'آپ کے ایمرجنسی رابطے')}
          </h2>
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
                      {relationships.find(r => r.value === contact.relationship)?.label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="default" size="sm">
                      <a href={`tel:${contact.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        {t('Call', 'کال کریں')}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => requireLogin(() => handleDelete(contact.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {contacts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {t('No emergency contacts added yet', 'ابھی تک کوئی ایمرجنسی رابطہ شامل نہیں کیا گیا')}
              </p>
              <Button onClick={() => requireLogin(() => setIsAdding(true))}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('Add Your First Contact', 'اپنا پہلا رابطہ شامل کریں')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
