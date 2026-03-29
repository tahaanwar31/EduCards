import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
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
            <Shield className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Privacy Policy
          </h1>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/40 text-sm">
          Last updated: March 29, 2026
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Introduction</h2>
          <p className="text-white/60 leading-relaxed">
            Welcome to EduCards (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our flashcard learning platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
          <p className="text-white/60 leading-relaxed">We may collect the following types of information:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 pl-2">
            <li><span className="text-white/80 font-medium">Account Information:</span> Name, email address, and profile details when you create an account.</li>
            <li><span className="text-white/80 font-medium">Usage Data:</span> Information about how you interact with our platform, including subjects created, flashcards studied, and quiz performance.</li>
            <li><span className="text-white/80 font-medium">Device Information:</span> Browser type, operating system, and device identifiers for analytics purposes.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
          <p className="text-white/60 leading-relaxed">We use the collected information to:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 pl-2">
            <li>Provide, maintain, and improve our learning platform</li>
            <li>Personalize your study experience and track your progress</li>
            <li>Communicate updates, new features, and support responses</li>
            <li>Ensure the security and integrity of our services</li>
            <li>Analyze usage patterns to enhance platform performance</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Data Protection &amp; Security</h2>
          <p className="text-white/60 leading-relaxed">
            We implement industry-standard security measures to protect your personal information. Your data is encrypted both in transit and at rest. We regularly review and update our security practices to ensure your information remains safe and protected against unauthorized access, alteration, or disclosure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Third-Party Services</h2>
          <p className="text-white/60 leading-relaxed">
            We may use third-party services for analytics, AI-powered features, and general functionality improvements. These services have their own privacy policies, and we encourage you to review them. We do not sell, trade, or otherwise transfer your personal information to third parties for marketing purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Cookies &amp; Tracking</h2>
          <p className="text-white/60 leading-relaxed">
            We may use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our users come from. You can control cookie preferences through your browser settings at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Your Rights</h2>
          <p className="text-white/60 leading-relaxed">You have the right to:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 pl-2">
            <li>Access and receive a copy of your personal data</li>
            <li>Request correction of inaccurate or incomplete information</li>
            <li>Request deletion of your account and all associated data</li>
            <li>Opt out of non-essential communications at any time</li>
            <li>Withdraw consent for data processing where applicable</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">8. Data Retention</h2>
          <p className="text-white/60 leading-relaxed">
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy. When your data is no longer needed, we will securely delete or anonymize it in accordance with applicable regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">9. Contact Us</h2>
          <p className="text-white/60 leading-relaxed">
            If you have questions or concerns about this Privacy Policy or our data practices, please reach out to us at{' '}
            <a href="mailto:tahaanwar303@gmail.com" className="text-red-500 hover:underline font-medium">tahaanwar303@gmail.com</a>.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
