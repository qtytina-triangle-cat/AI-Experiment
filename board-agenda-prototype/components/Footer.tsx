import Link from 'next/link';
import { Palette } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="h-20 bg-white border-t border-slate-200 flex items-center justify-center px-4">
      <div className="flex items-center gap-6 text-sm text-slate-600">
        <p>© 2026 Board Agenda</p>
        <span className="text-slate-300">|</span>
        <Link 
          href="/style-guide" 
          className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
        >
          <Palette className="w-4 h-4" />
          Style Guide
        </Link>
      </div>
    </footer>
  );
}
