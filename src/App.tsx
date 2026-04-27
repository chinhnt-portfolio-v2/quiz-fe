import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/protected-route';
import { setToken } from './api/token-cache';
import LoginPage from './pages/login-page';
import QuizTopicSelectionPage from './pages/quiz-topic-selection-page';
import QuizCardPage from './pages/quiz-card-page';
import QuizMissedPage from './pages/quiz-missed-questions-page';
import QuizProgressPage from './pages/quiz-progress-dashboard-page';
import QuizHistoryPage from './pages/quiz-history-page';

export default function App() {
  // Rehydrate token from localStorage on mount so API calls work after hot-reload.
  useEffect(() => {
    const token = localStorage.getItem('quiz_token');
    if (token) setToken(token);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" replace />} />
      <Route path="/login" element={<LoginPage />} />
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
      <Route
        path="/quiz/history"
        element={<ProtectedRoute><QuizHistoryPage /></ProtectedRoute>}
      />
    </Routes>
  );
}