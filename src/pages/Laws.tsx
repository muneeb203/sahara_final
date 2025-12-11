import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Scale, Loader2, BookOpen, Gavel } from 'lucide-react';
import { loadLawBooks, getCategoriesByType, type LawBook } from '@/lib/lawsData';

export default function Laws() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<'Legal Laws' | 'Islamic Laws' | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [lawBooks, setLawBooks] = useState<LawBook[]>([]);
  const [loading, setLoading] = useState(true);

  // Load law books on mount
  useEffect(() => {
    const fetchLawBooks = async () => {
      setLoading(true);
      try {
        const books = await loadLawBooks();
        setLawBooks(books);
      } catch (error) {
        console.error('Error loading law books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawBooks();
  }, []);

  // Get subcategories based on selected main category
  const subCategories = selectedMainCategory 
    ? getCategoriesByType(lawBooks, selectedMainCategory)
    : [];

  const filteredLaws = lawBooks.filter((law) => {
    const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMainCategory = selectedMainCategory 
      ? law.mainCategory === selectedMainCategory 
      : true;
    
    const matchesSubCategory = selectedSubCategory === 'All' 
      ? true 
      : law.category === selectedSubCategory;
    
    return matchesSearch && matchesMainCategory && matchesSubCategory;
  });

  // Reset subcategory when main category changes
  useEffect(() => {
    setSelectedSubCategory('All');
  }, [selectedMainCategory]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('Women\'s Rights Laws', 'خواتین کے حقوق کے قوانین')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Browse comprehensive legal information to understand your rights under Pakistani law',
              'پاکستانی قانون کے تحت اپنے حقوق کو سمجھنے کے لیے جامع قانونی معلومات دیکھیں'
            )}
          </p>
        </div>

        {/* Main Category Selection */}
        {!selectedMainCategory && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8">
              {t('Choose a Category', 'ایک کیٹگری منتخب کریں')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Islamic Laws Card */}
              <Card 
                className="cursor-pointer hover:shadow-lifted transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedMainCategory('Islamic Laws')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {t('Islamic Laws', 'اسلامی قوانین')}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {t(
                      'Guidance from Quran and Hadith on women\'s rights and Islamic jurisprudence',
                      'خواتین کے حقوق اور اسلامی فقہ پر قرآن اور حدیث سے رہنمائی'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {t('Explore Islamic Laws', 'اسلامی قوانین دیکھیں')}
                  </Button>
                </CardContent>
              </Card>

              {/* Legal Laws Card */}
              <Card 
                className="cursor-pointer hover:shadow-lifted transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedMainCategory('Legal Laws')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <Gavel className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {t('Legal Laws', 'قانونی قوانین')}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {t(
                      'Pakistani constitutional and statutory laws protecting women\'s rights',
                      'خواتین کے حقوق کی حفاظت کرنے والے پاکستانی آئینی اور قانونی قوانین'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {t('Explore Legal Laws', 'قانونی قوانین دیکھیں')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search and Sub-Category Filters */}
        {selectedMainCategory && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {selectedMainCategory === 'Islamic Laws' ? (
                  <BookOpen className="h-6 w-6 text-primary" />
                ) : (
                  <Gavel className="h-6 w-6 text-primary" />
                )}
                <h2 className="text-2xl font-semibold">
                  {t(selectedMainCategory, selectedMainCategory === 'Islamic Laws' ? 'اسلامی قوانین' : 'قانونی قوانین')}
                </h2>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedMainCategory(null)}
              >
                {t('Back to Categories', 'کیٹگریز پر واپس')}
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('Search laws...', 'قوانین تلاش کریں...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {subCategories.length > 0 && (
                <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                  <SelectTrigger className="w-full md:w-[240px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">
                      {t('All Subcategories', 'تمام ذیلی کیٹگریز')}
                    </SelectItem>
                    {subCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Laws Grid */}
        {!loading && selectedMainCategory && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLaws.map((law) => (
                <Card key={law.id} className="hover:shadow-lifted transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Scale className="h-8 w-8 text-primary" />
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {law.sections.length} {t('Sections', 'سیکشن')}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{law.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{law.description}</CardDescription>
                    <div className="pt-2 flex gap-2 flex-wrap">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {law.mainCategory}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        {law.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/laws/${law.id}`}>{t('Read More', 'مزید پڑھیں')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLaws.length === 0 && selectedMainCategory && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t('No laws found matching your search.', 'آپ کی تلاش سے مماثل کوئی قانون نہیں ملا۔')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
