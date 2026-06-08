import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PromptCreator from './pages/PromptCreator';
import Textbooks from './pages/Textbooks';
import PromptLibrary from './pages/PromptLibrary';
import Guides from './pages/Guides';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prompt-creator" element={<PromptCreator />} />
            <Route path="/textbooks" element={<Textbooks />} />
            <Route path="/prompts" element={<PromptLibrary />} />
            <Route path="/guides" element={<Guides />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
