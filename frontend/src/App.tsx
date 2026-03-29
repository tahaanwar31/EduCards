import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SubjectView from './pages/SubjectView';
import TopicView from './pages/TopicView';
import QuizMode from './pages/QuizMode';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactSupport from './pages/ContactSupport';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="subject/:subjectId" element={<SubjectView />} />
          <Route path="topic/:topicId" element={<TopicView />} />
          <Route path="quiz/:topicId" element={<QuizMode />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="contact" element={<ContactSupport />} />
        </Route>
      </Routes>

      <Analytics />
    </BrowserRouter>
  );
}