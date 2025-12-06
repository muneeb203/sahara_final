import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, MessageSquare, Scale, FileText, Download, Loader2 } from 'lucide-react';
import { getLawBookById, type LawBook } from '@/lib/lawsData';

export default function LawDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [law, setLaw] = useState<LawBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaw = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const lawBook = await getLawBookById(id);
        setLaw(lawBook);
      } catch (error) {
        console.error('Error loading law:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaw();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!law) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('Law Not Found', 'قانون نہیں ملا')}</h2>
          <Button asChild>
            <Link to="/laws">{t('Back to Laws', 'قوانین پر واپس')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/laws" className="hover:text-primary">
            {t('Laws', 'قوانین')}
          </Link>
          <span>/</span>
          <span className="text-foreground">{t('Law Details', 'قانون کی تفصیلات')}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to="/laws">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back to Laws', 'قوانین پر واپس')}
            </Link>
          </Button>

          <div className="flex items-start gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {law.title}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="bg-muted px-3 py-1 rounded-full">{law.category}</span>
                <span className="bg-muted px-3 py-1 rounded-full">
                  {law.sections.length} {t('Sections', 'سیکشن')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="flex-1 sm:flex-initial">
              <Link to="/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('Discuss this law in Chat', 'چیٹ میں اس قانون پر بات کریں')}
              </Link>
            </Button>
            {law.pdfPath && (
              <Button asChild variant="outline" className="flex-1 sm:flex-initial">
                <a href={law.pdfPath} download>
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download PDF', 'PDF ڈاؤن لوڈ کریں')}
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Sections/Chapters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('Sections & Content', 'سیکشن اور مواد')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {law.description}
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {law.sections.map((section, index) => (
                <AccordionItem key={index} value={`section-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-semibold">
                        {section.reference}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {section.category}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {section.text}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {section.theme_tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">
              {t('Need Help Understanding This Law?', 'اس قانون کو سمجھنے میں مدد کی ضرورت ہے؟')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'Our AI assistant can explain this law in simple terms and answer your questions.',
                'ہماری AI معاون اس قانون کو آسان الفاظ میں بیان کر سکتی ہے اور آپ کے سوالات کے جوابات دے سکتی ہے۔'
              )}
            </p>
            <Button asChild variant="outline">
              <Link to="/chat">
                {t('Ask AI Assistant', 'AI معاون سے پوچھیں')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
