import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import './i18n';

// Main Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import ExperienceDetail from './components/sections/ExperienceDetail';
import Projects from './components/sections/Projects';
import ProjectDetail from './components/sections/ProjectDetail';
import Contact from './components/sections/Contact';
import Chatbot from './components/sections/Chatbot';

// Admin Components
import ProtectedRoute from './components/ProtectedRoute';
import { 
  AdminLogin, 
  AdminDashboard, 
  SkillsManager, 
  ExperiencesManager, 
  ProjectsManager 
} from './components/admin';

// 3D Scene
import Scene from './components/three/Scene';

// Hooks
import { useVisitorTracking } from './hooks/useVisitorTracking';

// Main Portfolio Component
const Portfolio = () => {
  // Track visitor on portfolio load (temporarily disabled to fix admin login)
  // useVisitorTracking();

  return (
    <div className="bg-black min-h-screen w-full text-white relative">
      {/* 3D Background Scene */}
      <Scene />
      
      {/* Main Content */}
      <div className="relative z-10 w-full">
        <Header />
        
        <main className="w-full">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-white">Chargement...</div>
            </div>
          }>
            <Hero />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </Suspense>
        </main>
        
        <Footer />
        
        {/* Chatbot */}
        <Chatbot />
      </div>
    </div>
  );
};

function App() {
  const { i18n } = useTranslation();

  return (
    <div className="App w-full min-h-screen">
      <Router>
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={<Portfolio />} />
          
          {/* Detail Pages */}
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/experience/:id" element={<ExperienceDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/skills" 
            element={
              <ProtectedRoute>
                <SkillsManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/experiences" 
            element={
              <ProtectedRoute>
                <ExperiencesManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/projects" 
            element={
              <ProtectedRoute>
                <ProjectsManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to portfolio */}
          <Route path="*" element={<Portfolio />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;