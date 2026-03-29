/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SubjectView from './pages/SubjectView';
import TopicView from './pages/TopicView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="subject/:subjectId" element={<SubjectView />} />
          <Route path="topic/:topicId" element={<TopicView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

