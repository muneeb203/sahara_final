import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { EmergencyButton } from './EmergencyButton';
import { QuickEscapeButton } from './QuickEscapeButton';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <EmergencyButton />
      <QuickEscapeButton />
    </div>
  );
};
