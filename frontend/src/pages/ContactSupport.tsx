import { ArrowLeft, MessageCircle, Mail, Phone, ExternalLink, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function ContactSupport() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Contact Support
            </h1>
          </div>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/50 text-lg max-w-xl">
          We&rsquo;re here to help. Reach out through any of the channels below and we&rsquo;ll get back to you as soon as possible.
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp */}
        <a
          href="https://wa.me/923132896244"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-3xl hover:border-green-500/30 transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_-15px_rgba(37,211,102,0.3)]"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">WhatsApp</h3>
          <p className="text-white/50 mb-6 leading-relaxed">Chat with us directly on WhatsApp for quick support and real-time assistance.</p>
          <div className="flex items-center gap-3 text-green-400 font-mono font-bold text-lg">
            <Phone className="w-5 h-5" />
            0313-2896244
            <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:tahaanwar303@gmail.com"
          className="group p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-3xl hover:border-red-600/30 transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_-15px_rgba(220,38,38,0.3)]"
        >
          <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Mail className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">Email</h3>
          <p className="text-white/50 mb-6 leading-relaxed">Send us a detailed message and our team will respond within 24 hours.</p>
          <div className="flex items-center gap-3 text-red-500 font-medium text-lg">
            <Mail className="w-5 h-5" />
            tahaanwar303@gmail.com
            <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-8 bg-white/5 border border-white/10 rounded-3xl">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How do I create flashcards?', a: 'Navigate to any topic and click "New Card" to add questions and answers. Your flashcards are saved automatically.' },
            { q: 'Can I take quizzes on my flashcards?', a: 'Yes! Each topic has a "Take Quiz" option that generates multiple-choice questions from your flashcards with a 60-second timer.' },
            { q: 'How many flashcards do I need for a quiz?', a: 'You need at least 2 flashcards in a topic to generate a quiz. For the best experience, we recommend at least 4 flashcards.' },
            { q: 'Is my data safe?', a: 'Absolutely. We use industry-standard encryption and security practices to protect all your information and study data.' },
            { q: 'How do I delete a subject or topic?', a: 'Hover over any subject or topic card and click the trash icon that appears in the top-right corner.' },
            { q: 'Can I shuffle my flashcards?', a: 'Yes! In study mode, use the Shuffle button to randomize the order of your flashcards for more effective studying.' },
          ].map((faq, i) => (
            <div key={i} className="p-5 bg-white/5 rounded-2xl hover:bg-white/[0.07] transition-colors">
              <h3 className="text-white font-semibold mb-1.5">{faq.q}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
