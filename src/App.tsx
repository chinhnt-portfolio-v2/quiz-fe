import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/protected-route';
import QuizTopicSelectionPage from './pages/quiz-topic-selection-page';
import QuizCardPage from './pages/quiz-card-page';
import QuizMissedPage from './pages/quiz-missed-questions-page';
import QuizProgressPage from './pages/quiz-progress-dashboard-page';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" replace />} />
      <Route path="/quiz" element={<QuizTopicSelectionPage />} />
      <Route
        path="/quiz/practice"
        element={<ProtectedRoute><QuizCardPage /></ProtectedRoute>}
      />
      <Route
        path="/quiz/missed"
        element={<ProtectedRoute><QuizMissedPage /></ProtectedRoute>}
      />
      <Route
        path="/quiz/progress"
        element={<ProtectedRoute><QuizProgressPage /></ProtectedRoute>}
      />
      <Route path="/login" element={<div style={{ padding: '2rem', textAlign: 'center' }}><a href="/">Back to portfolio</a></div>} />
    </Routes>
  );
}