import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Languages, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isLoggedIn, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('Home', 'ہوم') },
    { to: '/laws', label: t('Laws', 'قوانین') },
    { to: '/lawyers', label: t('Lawyers', 'وکیل') },
    { to: '/chat', label: t('Chat', 'چیٹ') },
    { to: '/uploads', label: t('Uploads', 'اپ لوڈز') },
    { to: '/emergency-contacts', label: t('Emergency Contacts', 'ایمرجنسی رابطے') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">Saharah</span>
              <span className="text-xs text-muted-foreground">
                {t('Safety • Support • Strength', 'حفاظت • تعاون • طاقت')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full"
              title={t('Switch to Urdu', 'انگریزی میں تبدیل کریں')}
            >
              <Languages className="h-5 w-5" />
              <span className="sr-only">{t('Toggle Language', 'زبان تبدیل کریں')}</span>
            </Button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {user?.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full border-2 border-primary"
                  />
                )}
                {user?.name && (
                  <span className="hidden sm:inline text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  {t('Logout', 'لاگ آؤٹ')}
                </Button>
              </div>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link to="/login">{t('Login', 'لاگ ان')}</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
