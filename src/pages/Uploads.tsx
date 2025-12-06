import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, Trash2, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function Uploads() {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Marriage Certificate.pdf',
      size: '245 KB',
      uploadedAt: new Date('2024-01-15'),
      tags: [t('Marriage', 'نکاح')],
    },
    {
      id: '2',
      name: 'Police Report.pdf',
      size: '1.2 MB',
      uploadedAt: new Date('2024-02-20'),
      tags: [t('Legal Document', 'قانونی دستاویز')],
    },
  ]);

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

  const handleFileUpload = () => {
    toast.success(t('File uploaded successfully', 'فائل کامیابی سے اپ لوڈ ہو گئی'));
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success(t('Document deleted', 'دستاویز حذف ہو گئی'));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('My Documents', 'میری دستاویزات')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'Securely store and manage your legal documents',
              'اپنی قانونی دستاویزات کو محفوظ طریقے سے محفوظ اور منظم کریں'
            )}
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('Upload New Document', 'نئی دستاویز اپ لوڈ کریں')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => requireLogin(() => document.getElementById('file-upload')?.click())}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Click to upload or drag and drop files here',
                  'اپ لوڈ کرنے کے لیے کلک کریں یا فائلوں کو یہاں گھسیٹیں اور چھوڑیں'
                )}
              </p>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => requireLogin(handleFileUpload)}
              />
              <Button 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  requireLogin(() => document.getElementById('file-upload')?.click());
                }}
              >
                {t('Choose File', 'فائل منتخب کریں')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {t('Your Documents', 'آپ کی دستاویزات')}
          </h2>
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>
                        {t('Uploaded', 'اپ لوڈ کیا گیا')}{' '}
                        {doc.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {doc.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => requireLogin(() => {})}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => requireLogin(() => {})}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => requireLogin(() => handleDelete(doc.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {documents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('No documents uploaded yet', 'ابھی تک کوئی دستاویز اپ لوڈ نہیں ہوئی')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
