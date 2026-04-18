import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const queryParam = useQuery().get('q') || '';
  const { token } = useAuth();
  
  const [filter, setFilter] = useState('both'); // 'movies', 'music', 'both'
  const [movies, setMovies] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryParam) return;
    
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [mRes, sRes] = await Promise.allSettled([
          api.searchMovies(queryParam, token),
          api.searchSongs(queryParam, token)
        ]);
        setMovies(mRes.status === 'fulfilled' ? (mRes.value || []) : []);
        setSongs(sRes.status === 'fulfilled' ? (sRes.value || []) : []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [queryParam, token]);

  const handleFilter = (f) => {
    setFilter(f);
  };

  return (
    <div className="container" style={{paddingTop: '40px', paddingBottom: '80px'}}>
      
      <div style={styles.searchHeader}>
        <SearchBar initialQuery={queryParam} />
      </div>

      {!queryParam ? (
        <div style={styles.empty}>
          <h2>What do you want to find?</h2>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div style={styles.tabs}>
            <button 
              className={`btn ${filter === 'both' ? 'btn-primary' : ''}`} 
              onClick={() => handleFilter('both')}
            >
              All Results
            </button>
            <button 
              className={`btn ${filter === 'movies' ? 'btn-primary' : ''}`} 
              onClick={() => handleFilter('movies')}
            >
              Movies
            </button>
            <button 
              className={`btn ${filter === 'music' ? 'btn-primary' : ''}`} 
              onClick={() => handleFilter('music')}
            >
              Music
            </button>
          </div>

          <p style={styles.metrics}>
            Found {movies.length} movies and {songs.length} songs for "{queryParam}"
          </p>

          {(filter === 'both' || filter === 'movies') && movies.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Movies</h2>
              <div style={styles.moviesGrid}>
                {movies.map(m => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </div>
          )}

          {(filter === 'both' || filter === 'music') && songs.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Music</h2>
              <div style={styles.songsList}>
                {songs.map(s => (
                  <SongCard key={s.id} song={s} />
                ))}
              </div>
            </div>
          )}

          {movies.length === 0 && songs.length === 0 && (
            <div style={styles.empty}>
              <h2>No results found for "{queryParam}"</h2>
              <p>Make sure all words are spelled correctly or try different keywords.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  searchHeader: {
    marginBottom: '40px'
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    justifyContent: 'center'
  },
  metrics: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    marginBottom: '40px'
  },
  section: {
    marginBottom: '60px'
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px'
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
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    color: 'var(--text-secondary)'
  }
};

export default SearchResults;
