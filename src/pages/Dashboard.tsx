import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Book, Trash2 } from 'lucide-react';
import { fetchSubjects, createSubject, deleteSubject } from '../lib/api';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      await deleteSubject(id);
      loadSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-center py-20 text-[#c7b8cf]">Loading subjects...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Your Subjects</h1>
          <p className="text-[#c7b8cf]">Select a subject to view its topics and flashcards.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff5c6c] via-[#a855f7] to-[#ff8a3d] rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Subject
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
            <label className="block text-sm font-medium text-[#c7b8cf] mb-1">Subject Name</label>
            <input
              type="text"
              value={newSubject.name}
              onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#a855f7] transition-colors"
              placeholder="e.g., IGCSE Chemistry"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c7b8cf] mb-1">Description (Optional)</label>
            <input
              type="text"
              value={newSubject.description}
              onChange={e => setNewSubject({ ...newSubject, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#a855f7] transition-colors"
              placeholder="e.g., Core and Extended topics"
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
              Save Subject
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl text-[#c7b8cf]">
            No subjects yet. Click "Add Subject" to get started.
          </div>
        )}
        {subjects.map((subject) => (
          <Link
            key={subject._id}
            to={`/subject/${subject._id}`}
            className="group relative p-6 bg-[#14101c]/80 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#a855f7]/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#a855f7]/20"
          >
            <button
              onClick={(e) => handleDelete(subject._id, e)}
              className="absolute top-4 right-4 p-2 text-[#c7b8cf] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-white/5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff5c6c]/20 to-[#a855f7]/20 rounded-xl flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform">
              <Book className="w-6 h-6 text-[#ff5c6c]" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-[#ff5c6c] transition-colors">{subject.name}</h3>
            {subject.description && (
              <p className="text-[#9a879f] text-sm line-clamp-2">{subject.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
