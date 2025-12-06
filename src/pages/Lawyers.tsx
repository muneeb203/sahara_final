import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Phone, MapPin, Briefcase } from 'lucide-react';

export default function Lawyers() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  const cities = [
    { value: 'all', label: t('All Cities', 'تمام شہر') },
    { value: 'karachi', label: t('Karachi', 'کراچی') },
    { value: 'lahore', label: t('Lahore', 'لاہور') },
    { value: 'islamabad', label: t('Islamabad', 'اسلام آباد') },
    { value: 'rawalpindi', label: t('Rawalpindi', 'راولپنڈی') },
    { value: 'faisalabad', label: t('Faisalabad', 'فیصل آباد') },
  ];

  const specializations = [
    { value: 'all', label: t('All Specializations', 'تمام مہارتیں') },
    { value: 'family', label: t('Family Law', 'فیملی لاء') },
    { value: 'violence', label: t('Domestic Violence', 'گھریلو تشدد') },
    { value: 'harassment', label: t('Harassment', 'ہراساں کرنا') },
    { value: 'custody', label: t('Child Custody', 'بچے کی تحویل') },
    { value: 'property', label: t('Property Rights', 'جائیداد کے حقوق') },
  ];

  const lawyers = [
    {
      id: '1',
      name: t('Advocate Ayesha Khan', 'ایڈووکیٹ عائشہ خان'),
      city: 'karachi',
      specialization: ['family', 'violence'],
      phone: '+92-300-1234567',
      gender: t('Female', 'خاتون'),
    },
    {
      id: '2',
      name: t('Advocate Fatima Ali', 'ایڈووکیٹ فاطمہ علی'),
      city: 'lahore',
      specialization: ['harassment', 'violence'],
      phone: '+92-301-2345678',
      gender: t('Female', 'خاتون'),
    },
    {
      id: '3',
      name: t('Advocate Sarah Ahmad', 'ایڈووکیٹ سارہ احمد'),
      city: 'islamabad',
      specialization: ['custody', 'family'],
      phone: '+92-302-3456789',
      gender: t('Female', 'خاتون'),
    },
    {
      id: '4',
      name: t('Advocate Zainab Hassan', 'ایڈووکیٹ زینب حسن'),
      city: 'karachi',
      specialization: ['property', 'family'],
      phone: '+92-303-4567890',
      gender: t('Female', 'خاتون'),
    },
    {
      id: '5',
      name: t('Advocate Mariam Sheikh', 'ایڈووکیٹ مریم شیخ'),
      city: 'rawalpindi',
      specialization: ['harassment', 'custody'],
      phone: '+92-304-5678901',
      gender: t('Female', 'خاتون'),
    },
    {
      id: '6',
      name: t('Advocate Hina Malik', 'ایڈووکیٹ حنا ملک'),
      city: 'lahore',
      specialization: ['violence', 'family'],
      phone: '+92-305-6789012',
      gender: t('Female', 'خاتون'),
    },
  ];

  const getSpecializationLabel = (spec: string) => {
    const found = specializations.find((s) => s.value === spec);
    return found ? found.label : spec;
  };

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || lawyer.city === selectedCity;
    const matchesSpecialization =
      selectedSpecialization === 'all' || lawyer.specialization.includes(selectedSpecialization);
    return matchesSearch && matchesCity && matchesSpecialization;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('Find a Lawyer', 'وکیل تلاش کریں')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Connect with verified lawyers specializing in women\'s rights and family law',
              'خواتین کے حقوق اور فیملی لاء میں مہارت رکھنے والے تصدیق شدہ وکلاء سے رابطہ کریں'
            )}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('Search lawyers...', 'وکیل تلاش کریں...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    {spec.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer) => (
            <Card key={lawyer.id} className="hover:shadow-lifted transition-shadow">
              <CardHeader>
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-center">{lawyer.name}</CardTitle>
                <CardDescription className="text-center">{lawyer.gender}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {cities.find((c) => c.value === lawyer.city)?.label || lawyer.city}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {lawyer.specialization.map((spec) => (
                      <span key={spec} className="bg-muted px-2 py-0.5 rounded-full text-xs">
                        {getSpecializationLabel(spec)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lawyer.phone}`} className="hover:text-primary">
                    {lawyer.phone}
                  </a>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="default" className="flex-1">
                    <Link to={`/lawyers/${lawyer.id}`}>{t('View Profile', 'پروفائل دیکھیں')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="icon">
                    <a href={`tel:${lawyer.phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t('No lawyers found matching your criteria.', 'آپ کی معیار سے مماثل کوئی وکیل نہیں ملا۔')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
