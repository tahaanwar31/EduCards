import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Plus, ArrowLeft, Trash2, Shuffle, RotateCcw } from 'lucide-react';
import { fetchFlashcards, createFlashcard, deleteFlashcard } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';

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

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;
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
      setCurrentIndex(c => c + 1);
      setIsFlipped(false);
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setIsFlipped(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-[#c7b8cf]">Loading flashcards...</div>;

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-[#c7b8cf] hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Flashcards</h1>
          <p className="text-[#c7b8cf]">Study your topic flashcards.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff8a3d] to-[#ff5c6c] rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Card
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {isAdding && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd}
          className="p-6 bg-[#14101c]/80 backdrop-blur-md border border-white/10 rounded-2xl space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-[#c7b8cf] mb-1">Question</label>
            <textarea
              value={newCard.question}
              onChange={e => setNewCard({ ...newCard, question: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#ff8a3d] transition-colors min-h-[100px]"
              placeholder="e.g., What is an exothermic reaction?"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c7b8cf] mb-1">Answer</label>
            <textarea
              value={newCard.answer}
              onChange={e => setNewCard({ ...newCard, answer: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#ff8a3d] transition-colors min-h-[100px]"
              placeholder="e.g., A reaction that releases heat to the surroundings."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-[#c7b8cf] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors"
            >
              Save Flashcard
            </button>
          </div>
        </motion.form>
      )}

      {flashcards.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-[#c7b8cf]">
            <div className="flex gap-2">
              <button onClick={handleShuffle} className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2" title="Shuffle">
                <Shuffle className="w-4 h-4" /> <span className="text-sm">Shuffle</span>
              </button>
              <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2" title="Reset Order">
                <RotateCcw className="w-4 h-4" /> <span className="text-sm">Reset</span>
              </button>
            </div>
            <div className="text-sm font-medium">
              Card {currentIndex + 1} of {flashcards.length}
            </div>
          </div>

          <div className="relative perspective-1000 h-[400px] w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="w-full h-full relative preserve-3d transition-all duration-500"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#14101c] to-[#1a1525] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(currentCard._id); }}
                    className="p-2 text-[#c7b8cf] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-white/5"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-[#ff8a3d] mb-6 uppercase tracking-wider">
                  Question
                </span>
                <h2 className="text-2xl md:text-3xl font-medium leading-relaxed">
                  {currentCard.question}
                </h2>
                <p className="absolute bottom-6 text-[#9a879f] text-sm">Click to flip</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1a1525] to-[#14101c] border border-[#ff8a3d]/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl [transform:rotateY(180deg)]">
                <span className="px-3 py-1 bg-[#ff8a3d]/10 border border-[#ff8a3d]/20 rounded-full text-xs font-medium text-[#ff8a3d] mb-6 uppercase tracking-wider">
                  Answer
                </span>
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#f7edf7]">
                  {currentCard.answer}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-xl transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex === flashcards.length - 1}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-xl transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        !isAdding && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl text-[#c7b8cf]">
            No flashcards yet. Click "Add Card" to create one.
          </div>
        )
      )}
    </div>
  );
}
