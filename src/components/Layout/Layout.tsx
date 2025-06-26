import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4">{children}</main>
      <footer className="text-center text-gray-500 mt-10 text-xs">
        <p>&copy; {new Date().getFullYear()} Keep Typing</p>
      </footer>
    </div>
  );
}
