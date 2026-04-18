import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import MovieCard from '../components/MovieCard';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Watchlist = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWatchlist = async () => {
    try {
      const data = await api.getWatchlist(token);
      setItems(data);
    } catch (err) {
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      await api.removeFromWatchlist(token, id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your entire watchlist?')) return;
    try {
      await api.clearWatchlist(token);
      setItems([]);
    } catch (err) {
      alert('Failed to clear watchlist');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container" style={{padding: '40px', color: 'red'}}>{error}</div>;

  const movies = items.filter(i => i.media_type === 'movie');
  const songs = items.filter(i => i.media_type === 'song');

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Library</h1>
        {items.length > 0 && (
          <button className="btn btn-danger" onClick={handleClear}>Clear All</button>
        )}
      </div>

      <div style={styles.content}>
        {items.length === 0 ? (
          <div style={styles.emptyState}>
            <h2>It's quite empty here</h2>
            <p>Start exploring to add your favorite movies and songs.</p>
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Saved Movies ({movies.length})</h2>
                <div style={styles.moviesGrid}>
                  {movies.map(item => (
                    <MovieCard 
                      key={item.id} 
                      movie={{ id: item.media_id, title: item.media_title, poster_path: item.media_poster }} 
                      inWatchlist={true}
                      onAddWatchlist={() => handleRemove(item.id)} // Function acts as toggle 
                    />
                  ))}
                </div>
              </section>
            )}

            {songs.length > 0 && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Saved Music ({songs.length})</h2>
                <div style={styles.songsList}>
                  {songs.map(item => (
                    <SongCard 
                      key={item.id} 
                      song={{ id: item.media_id, name: item.media_title, image: item.media_poster, artist: 'Saved Track' }} 
                      inPlaylist={true}
                      onAddPlaylist={() => handleRemove(item.id)} // Function acts as toggle 
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '40px',
    paddingBottom: '80px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '36px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-lg)'
  },
  section: {
    marginBottom: '60px'
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '24px',
    color: 'var(--text-secondary)'
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
  }
};

export default Watchlist;
