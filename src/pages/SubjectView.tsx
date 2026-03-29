import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Plus, Folder, Trash2, ArrowLeft } from 'lucide-react';
import { fetchTopics, createTopic, deleteTopic, fetchSubjects } from '../lib/api';
import { motion } from 'motion/react';

export default function SubjectView() {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subjectId) {
      loadData();
    }
  }, [subjectId]);

  async function loadData() {
    try {
      setLoading(true);
      const [topicsData, subjectsData] = await Promise.all([
        fetchTopics(subjectId!),
        fetchSubjects()
      ]);
      setTopics(topicsData);
      setSubject(subjectsData.find((s: any) => s._id === subjectId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTopicName.trim() || !subjectId) return;
    try {
      await createTopic(subjectId, { name: newTopicName });
      setNewTopicName('');
      setIsAdding(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
      await deleteTopic(id);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-center py-20 text-[#c7b8cf]">Loading topics...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 hover:bg-white/10 rounded-xl transition-colors text-[#c7b8cf] hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{subject?.name || 'Subject'}</h1>
          <p className="text-[#c7b8cf]">Manage topics for this subject.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a855f7] to-[#ff8a3d] rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Topic
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
            <label className="block text-sm font-medium text-[#c7b8cf] mb-1">Topic Name</label>
            <input
              type="text"
              value={newTopicName}
              onChange={e => setNewTopicName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#a855f7] transition-colors"
              placeholder="e.g., Organic Chemistry"
              autoFocus
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
              Save Topic
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl text-[#c7b8cf]">
            No topics yet. Click "Add Topic" to get started.
          </div>
        )}
        {topics.map((topic) => (
          <Link
            key={topic._id}
            to={`/topic/${topic._id}`}
            className="group relative p-6 bg-[#14101c]/80 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#ff8a3d]/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ff8a3d]/20"
          >
            <button
              onClick={(e) => handleDelete(topic._id, e)}
              className="absolute top-4 right-4 p-2 text-[#c7b8cf] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-white/5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-[#a855f7]/20 to-[#ff8a3d]/20 rounded-xl flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform">
              <Folder className="w-6 h-6 text-[#a855f7]" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-[#a855f7] transition-colors">{topic.name}</h3>
            <p className="text-[#9a879f] text-sm">View flashcards</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
