import Link from 'next/link';
import { Palette, RotateCcw } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Footer() {
  const resetPrototype = useMutation(api.reset.resetPrototype);

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset the prototype? This will clear all data.")) {
        await resetPrototype();
        window.location.reload();
    }
  };

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
        <span className="text-slate-300">|</span>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Prototype
        </button>
      </div>
    </footer>
  );
}
