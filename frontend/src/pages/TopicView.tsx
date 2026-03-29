import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Plus, ArrowLeft, Trash2, Shuffle, RotateCcw, Layers, Zap } from 'lucide-react';
import { fetchFlashcards, createFlashcard, deleteFlashcard } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../components/ConfirmDialog';

export default function TopicView() {
  const { topicId } = useParams();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [originalCards, setOriginalCards] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });

  useEffect(() => {
    if (topicId) loadData();
  }, [topicId]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await fetchFlashcards(topicId!);
      setFlashcards(data);
      setOriginalCards(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newCard.question.trim() || !newCard.answer.trim() || !topicId) return;
    try {
      await createFlashcard(topicId, newCard);
      setNewCard({ question: '', answer: '' });
      setIsAdding(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setConfirmDialog({ isOpen: true, id });
  }

  async function confirmDelete() {
    const id = confirmDialog.id;
    setConfirmDialog({ isOpen: false, id: '' });
    try {
      await deleteFlashcard(id);
      loadData();
      if (currentIndex >= flashcards.length - 1) {
        setCurrentIndex(Math.max(0, flashcards.length - 2));
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleShuffle() {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  function handleReset() {
    setFlashcards([...originalCards]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  function nextCard() {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c + 1), 150);
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c - 1), 150);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
      <p className="text-white/50 font-medium animate-pulse">Loading flashcards...</p>
    </div>
  );

  const currentCard = flashcards[currentIndex];

  return (
    <>
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-4 py-2 btn-glass rounded-xl transition-all duration-300 text-white/50 hover:text-white text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Topic
            </button>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Study Mode
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/50 text-lg max-w-xl">
            Master your flashcards. Flip to reveal answers.
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/quiz/${topicId}`}
            className="flex items-center justify-center gap-2 px-6 py-3.5 btn-primary btn-shine-effect text-white rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            <Zap className="w-4 h-4" />
            Take Quiz
          </Link>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 btn-glass rounded-2xl font-semibold text-sm text-white/80 hover:text-white tracking-wide transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? 'Cancel' : 'New Card'}
          </motion.button>
        </div>
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
                <label className="block text-[13px] font-semibold text-white/60 tracking-wide">Question</label>
                <textarea
                  value={newCard.question}
                  onChange={e => setNewCard({ ...newCard, question: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-red-600/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all duration-300 min-h-[120px] resize-none"
                  placeholder="e.g., What is an exothermic reaction?"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-white/60 tracking-wide">Answer</label>
                <textarea
                  value={newCard.answer}
                  onChange={e => setNewCard({ ...newCard, answer: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-red-600/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all duration-300 min-h-[120px] resize-none"
                  placeholder="e.g., A reaction that releases heat to the surroundings."
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
                Save Flashcard
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {flashcards.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 glass-card p-4 rounded-2xl">
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={handleShuffle} className="flex-1 sm:flex-none px-4 py-2 hover:bg-white/[0.06] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium" title="Shuffle">
                <Shuffle className="w-4 h-4" /> <span>Shuffle</span>
              </button>
              <button onClick={handleReset} className="flex-1 sm:flex-none px-4 py-2 hover:bg-white/[0.06] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium" title="Reset Order">
                <RotateCcw className="w-4 h-4" /> <span>Reset</span>
              </button>
            </div>
            <div className="text-sm font-bold bg-white/[0.06] px-4 py-2 rounded-xl border border-white/[0.06]">
              Card {currentIndex + 1} of {flashcards.length}
            </div>
          </div>

          <div className="relative w-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <AnimatePresence mode="wait">
              {!isFlipped ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card card-shine rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[400px] relative group"
                >
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={(e) => handleDelete(currentCard._id, e)}
                      className="p-3 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-xl hover:bg-red-400/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="px-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs font-bold text-white/40 mb-8 uppercase tracking-widest">
                    Question
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                    {currentCard.question}
                  </h2>
                  <div className="absolute bottom-8 flex items-center gap-2 text-white/30 text-sm font-medium">
                    Click to reveal answer
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[2rem] relative min-h-[400px] flex flex-col items-center justify-center text-center overflow-hidden group"
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-red-600/10 via-transparent to-red-900/5 border border-red-600/15"></div>
                  {/* Top red glow line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                  <div className="relative z-10 p-10 flex flex-col items-center">
                    <div className="absolute top-6 right-6">
                      <button
                        onClick={(e) => handleDelete(currentCard._id, e)}
                        className="p-3 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-xl hover:bg-red-400/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="px-4 py-1.5 bg-red-600/15 border border-red-600/25 rounded-full text-xs font-bold text-red-500 mb-8 uppercase tracking-widest"
                    >
                      Answer
                    </motion.span>
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-2xl md:text-3xl font-medium leading-relaxed text-white/90"
                    >
                      {currentCard.answer}
                    </motion.p>
                  </div>
                  <div className="absolute bottom-8 flex items-center gap-2 text-red-500/40 text-sm font-medium z-10">
                    Click to go back
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="px-8 py-4 btn-glass disabled:opacity-30 rounded-2xl transition-all duration-300 font-bold text-white/70 hover:text-white active:scale-95"
            >
              Previous
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex === flashcards.length - 1}
              className="px-8 py-4 btn-primary btn-shine-effect disabled:opacity-30 rounded-2xl transition-all duration-300 font-bold text-white active:scale-95"
            >
              Next Card
            </button>
          </div>
        </motion.div>
      ) : (
        !isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 border border-dashed border-white/[0.08] rounded-3xl glass-card"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white/80 mb-2">No flashcards found</h3>
            <p className="text-white/40 text-center max-w-sm">This topic is empty. Add your first flashcard to start studying.</p>
          </motion.div>
        )
      )}
    </div>
    <ConfirmDialog
      isOpen={confirmDialog.isOpen}
      title="Delete Flashcard"
      message="This flashcard will be permanently removed. This action cannot be undone."
      confirmLabel="Delete"
      onConfirm={confirmDelete}
      onCancel={() => setConfirmDialog({ isOpen: false, id: '' })}
    />
    </>
  );
}
