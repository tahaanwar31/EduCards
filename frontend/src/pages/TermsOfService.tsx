import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Terms of Service
          </h1>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/40 text-sm">
          Last updated: March 29, 2026
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p className="text-white/60 leading-relaxed">
            By accessing and using EduCards (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of our services immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Description of Service</h2>
          <p className="text-white/60 leading-relaxed">
            EduCards is an educational flashcard platform designed to help students create, organize, and study flashcards across various subjects and topics. Our platform includes features such as flashcard management, AI-powered quiz generation, timed assessments, and personalized study tools to enhance the learning experience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. User Responsibilities</h2>
          <p className="text-white/60 leading-relaxed">As a user of EduCards, you agree to:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 pl-2">
            <li>Provide accurate and truthful information when creating content</li>
            <li>Use the platform solely for lawful educational purposes</li>
            <li>Not engage in any activity that disrupts or interferes with the platform&rsquo;s operation</li>
            <li>Not attempt to gain unauthorized access to any part of the service</li>
            <li>Respect the intellectual property rights of other users and content creators</li>
            <li>Maintain the confidentiality of your account credentials</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Intellectual Property</h2>
          <p className="text-white/60 leading-relaxed">
            All content, design elements, graphics, logos, and user interfaces on EduCards are owned by or licensed to us and are protected by applicable intellectual property laws. User-generated content (including flashcards, subjects, and topics) remains the intellectual property of the respective users. By posting content on EduCards, you grant us a non-exclusive, royalty-free license to display and distribute it within the platform for the purpose of providing our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Content Guidelines</h2>
          <p className="text-white/60 leading-relaxed">Users must ensure their content does not contain:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 pl-2">
            <li>Offensive, harmful, threatening, or inappropriate material</li>
            <li>Copyrighted content used without proper authorization</li>
            <li>Deliberately misleading or incorrect educational information</li>
            <li>Spam, unsolicited advertisements, or promotional material</li>
            <li>Content that violates any applicable laws or regulations</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Service Availability</h2>
          <p className="text-white/60 leading-relaxed">
            We strive to maintain uninterrupted access to our platform. However, we reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice. Scheduled maintenance windows will be communicated in advance when possible.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Limitation of Liability</h2>
          <p className="text-white/60 leading-relaxed">
            EduCards is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform, including but not limited to academic outcomes, data loss, or service interruptions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">8. Termination</h2>
          <p className="text-white/60 leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these Terms of Service. Users may also request account deletion at any time by contacting our support team. Upon termination, your right to access the platform will cease immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">9. Modifications to Terms</h2>
          <p className="text-white/60 leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Continued use of the platform after changes are published constitutes acceptance of the updated terms. We will make reasonable efforts to notify users of significant changes through the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">10. Contact</h2>
          <p className="text-white/60 leading-relaxed">
            For questions or concerns regarding these Terms of Service, please contact us at{' '}
            <a href="mailto:tahaanwar303@gmail.com" className="text-red-500 hover:underline font-medium">tahaanwar303@gmail.com</a>.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
