import { Outlet, Link } from 'react-router';
import { BookOpen } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0a10] text-[#f7edf7] font-serif selection:bg-[#a855f7] selection:text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#a855f7] rounded-full mix-blend-screen filter blur-[150px] opacity-15"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff5c6c] rounded-full mix-blend-screen filter blur-[150px] opacity-15"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#ff8a3d] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#14101c]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:text-[#ff5c6c] transition-colors">
            <BookOpen className="w-6 h-6 text-[#ff5c6c]" />
            IGCSE Flashcards
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#14101c]/80 backdrop-blur-md py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-[#9a879f]">
          <p className="text-sm tracking-wide">Created by Taha Anwar</p>
        </div>
      </footer>
    </div>
  );
}
