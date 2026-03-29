import { Outlet, Link, useLocation } from 'react-router';
import { GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f5f5f5] font-sans selection:bg-[#dc2626] selection:text-white overflow-hidden relative">
      {/* Dynamic Background with Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-white [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#dc2626] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.12] animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#7f1d1d] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.10]"></div>
      </div>

      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mt-6 mx-6 md:mx-auto max-w-5xl w-full rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden"
      >
        {/* Animated border glow sweep */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ padding: '1px' }}
        >
          <motion.div
            className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent blur-sm"
            animate={{ left: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          />
        </motion.div>
        <div className="px-6 h-20 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-10 h-10 bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] rounded-full flex items-center justify-center shadow-lg shadow-[#dc2626]/20"
              whileHover={{ scale: 1.15, rotate: -8 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
              <motion.div
                className="absolute -inset-[3px] rounded-full border border-red-500/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <div className="relative overflow-hidden">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:to-white transition-all"
              >
                EduCards
              </motion.span>
              <motion.div
                className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-red-500 to-transparent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </Link>
        </div>
      </motion.header>

      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0a0a] py-16 mt-auto overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none animate-grain"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-8 relative z-10">
          <div className="flex flex-col items-center gap-3">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase font-bold">&copy; 2026 EduCards &middot; All rights reserved</p>
          </div>
          <div className="flex gap-8 text-white/40 text-sm font-medium">
            <Link to="/privacy" className="hover:text-white cursor-pointer transition-colors hover:underline underline-offset-4 decoration-white/30">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white cursor-pointer transition-colors hover:underline underline-offset-4 decoration-white/30">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white cursor-pointer transition-colors hover:underline underline-offset-4 decoration-white/30">Contact Support</Link>
          </div>
          <motion.p
            className="text-[11px] tracking-widest font-medium mt-4 text-red-500"
            animate={{ opacity: [0.15, 0.6, 0.15], textShadow: ['0 0 0px rgba(220,38,38,0)', '0 0 12px rgba(220,38,38,0.6)', '0 0 0px rgba(220,38,38,0)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Crafted by <span className="font-bold">Taha Anwar</span>
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
