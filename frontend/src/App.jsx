import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Watchlist from './pages/Watchlist';
import MovieDetails from './pages/MovieDetails';
import SongDetails from './pages/SongDetails';
import SearchResults from './pages/SearchResults';
import AdvancedSearch from './pages/AdvancedSearch';
import NotFound from './pages/NotFound';

import './styles/global.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  
  return children;
};

// Layout Wrapper
const Layout = ({ children }) => (
  <div className="app-container">
    <Navbar />
    <main className="main-content">
      {children}
    </main>
    <Footer />
    <GlobalAudioPlayer />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <AudioProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/advanced-search" element={<AdvancedSearch />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/song/:id" element={<SongDetails />} />
              
              <Route path="/watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AudioProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
