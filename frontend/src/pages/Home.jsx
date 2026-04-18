import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [errorMovies, setErrorMovies] = useState('');
  const [errorSongs, setErrorSongs] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const m = await api.getTrendingMovies();
        setMovies(m);
      } catch (err) {
        setErrorMovies(err.response?.data?.error || 'Failed to load trending movies.');
      } finally {
        setLoadingMovies(false);
      }

      try {
        const s = await api.getTrendingSongs();
        setSongs(s);
      } catch (err) {
        setErrorSongs(err.response?.data?.error || 'Failed to load trending songs.');
      } finally {
        setLoadingSongs(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Discover Your Next Favorite</h1>
          <p style={styles.heroSubtitle}>Explore trending movies and chart-topping music all in one place.</p>
          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ paddingBottom: '60px' }}>
        
        {/* Trending Movies */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Trending Movies <span style={{color: 'var(--accent-red)'}}>🔥</span>
          </h2>
          {loadingMovies ? (
            <LoadingSpinner />
          ) : errorMovies ? (
             <div style={styles.error}>{errorMovies}</div>
          ) : (
            <div style={styles.moviesGrid}>
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Songs */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Trending Music <span style={{color: 'var(--accent-teal)'}}>🎵</span>
          </h2>
          {loadingSongs ? (
            <LoadingSpinner />
          ) : errorSongs ? (
            <div style={styles.error}>{errorSongs}</div>
          ) : (
            <div style={styles.songsList}>
              {songs.map(song => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: 'var(--card-bg)',
    padding: '80px 0',
    marginBottom: '40px',
    borderBottom: '1px solid var(--border-color)',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '48px',
    margin: '0 0 16px 0',
    background: 'linear-gradient(45deg, var(--accent-red), var(--accent-teal))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: 'var(--text-secondary)',
    margin: '0 0 40px 0'
  },
  section: {
    marginBottom: '60px'
  },
  sectionTitle: {
    fontSize: '28px',
    margin: '0 0 24px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  moviesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '24px'
  },
  songsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  },
  error: {
    padding: '24px',
    background: 'rgba(255, 107, 107, 0.1)',
    color: 'var(--accent-red)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center'
  }
};

export default Home;
