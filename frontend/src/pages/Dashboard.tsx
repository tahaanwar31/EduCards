import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Book, Trash2, ChevronRight, GraduationCap, ArrowRight } from 'lucide-react';
import { fetchSubjects, createSubject, deleteSubject } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../components/ConfirmDialog';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 16) return 'Good Afternoon';
  if (hour >= 16 && hour < 19) return 'Good Evening';
  return 'Good Night';
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    try {
      setLoading(true);
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubject.name.trim()) return;
    try {
      await createSubject(newSubject);
      setNewSubject({ name: '', description: '' });
      setIsAdding(false);
      loadSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDialog({ isOpen: true, id });
  }

  async function confirmDelete() {
    const id = confirmDialog.id;
    setConfirmDialog({ isOpen: false, id: '' });
    try {
      await deleteSubject(id);
      loadSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
      <p className="text-white/50 font-medium animate-pulse">Loading your subjects...</p>
    </div>
  );

  return (
    <>
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/10 text-sm font-semibold mb-2">
            <GraduationCap className="w-4 h-4 text-red-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">{getGreeting()}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Your Subjects
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/50 text-lg max-w-xl">
            Master your curriculum. Select a subject to dive into topics and flashcards.
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAdding(!isAdding)}
          className="group relative flex items-center gap-3 px-7 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 overflow-hidden btn-primary btn-shine-effect text-white"
        >
          <span className="relative z-10">{isAdding ? 'Cancel' : 'New Subject'}</span>
          {!isAdding && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />}
        </motion.button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            onSubmit={handleAdd}
            className="p-8 glass-card card-shine rounded-3xl space-y-6 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-white/60 tracking-wide">Subject Name</label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-red-600/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all duration-300"
                  placeholder="e.g., Advanced Physics"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-white/60 tracking-wide">Description (Optional)</label>
                <input
                  type="text"
                  value={newSubject.description}
                  onChange={e => setNewSubject({ ...newSubject, description: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-red-600/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all duration-300"
                  placeholder="e.g., Quantum mechanics and relativity"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 rounded-xl text-white/50 hover:text-white btn-glass font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 btn-primary btn-shine-effect text-white rounded-xl font-bold transition-all duration-300"
              >
                Create Subject
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {subjects.length === 0 && !isAdding && (
          <motion.div variants={itemVariants} className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-white/[0.08] rounded-3xl glass-card">
            <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-xl font-bold text-white/80 mb-2">No subjects found</h3>
            <p className="text-white/40 text-center max-w-sm">You haven't created any subjects yet. Click the button above to start your learning journey.</p>
          </motion.div>
        )}
        {subjects.map((subject) => (
          <motion.div key={subject._id} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="group h-full">
            <Link
              to={`/subject/${subject._id}`}
              className="block h-full p-8 glass-card card-shine rounded-3xl transition-all duration-500 relative overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(220,38,38,0.12)]"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-600/12 via-red-900/8 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-900/8 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
              
              <button
                onClick={(e) => handleDelete(subject._id, e)}
                className="absolute top-6 right-6 p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:border-red-600/20 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                <Book className="w-7 h-7 text-white/50 group-hover:text-red-500 transition-colors duration-300" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors duration-300">{subject.name}</h3>
              
              {subject.description && (
                <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-6">{subject.description}</p>
              )}
              
              <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center text-sm font-bold text-white/30 group-hover:text-red-500 transition-colors duration-300">
                <span>Explore Topics</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
    <ConfirmDialog
      isOpen={confirmDialog.isOpen}
      title="Delete Subject"
      message="This will permanently delete the subject and all its topics and flashcards. This action cannot be undone."
      confirmLabel="Delete"
      onConfirm={confirmDelete}
      onCancel={() => setConfirmDialog({ isOpen: false, id: '' })}
    />
    </>
  );
}
