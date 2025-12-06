import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Scale, Loader2 } from 'lucide-react';
import { loadLawBooks, getCategories, type LawBook } from '@/lib/lawsData';

export default function Laws() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
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

  const categories = getCategories(lawBooks);

  const filteredLaws = lawBooks.filter((law) => {
    const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Laws Grid */}
        {!loading && (
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
                    <div className="pt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
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

            {filteredLaws.length === 0 && (
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
