import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import ReviewSection from '../components/ReviewSection';
import LoadingSpinner from '../components/LoadingSpinner';

const SongDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inPlaylist, setInPlaylist] = useState(false);

  useEffect(() => {
    const fetchSongData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const data = await api.getSongDetails(id);
        setSong(data);

        // Check watchlist
        if (token) {
          const list = await api.getWatchlist(token);
          const exists = list.find(item => item.media_id === id && item.media_type === 'song');
          setInPlaylist(!!exists);
        }
      } catch (err) {
        setError('Failed to load song details');
      } finally {
        setLoading(false);
      }
    };
    fetchSongData();
  }, [id, token]);

  const togglePlaylist = async () => {
    if (!token) {
      alert("Please login to use playlists");
      return;
    }
    
    try {
      if (inPlaylist) {
        const list = await api.getWatchlist(token);
        const item = list.find(item => item.media_id === id && item.media_type === 'song');
        if (item) {
          await api.removeFromWatchlist(token, item.id);
          setInPlaylist(false);
        }
      } else {
        await api.addToWatchlist(token, 'song', id, song.name, song.album?.images?.[0]?.url);
        setInPlaylist(true);
      }
    } catch (err) {
      alert('Failed to update playlist');
    }
  };

  const formatDuration = (ms) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) return <LoadingSpinner />;
  if (error || !song) return <div className="container" style={{padding: '40px', color: 'red'}}>{error || 'Song not found'}</div>;

  const imageUrl = song.album?.images?.[0]?.url || 'https://via.placeholder.com/640x640?text=No+Cover';

  return (
    <div>
      <div style={styles.hero}>
        <div className="container" style={styles.heroContainer}>
          <img src={imageUrl} alt={song.name} style={styles.albumArt} />
          <div style={styles.heroInfo}>
            <div style={styles.badge}>TRACK</div>
            <h1 style={styles.title}>{song.name}</h1>
            <p style={styles.artist}><span style={{color: 'var(--text-secondary)'}}>By </span> {song.artist}</p>
            
            <div style={styles.meta}>
              <span>{song.album?.name}</span>
              <span>•</span>
              <span>{new Date(song.album?.release_date).getFullYear() || 'Unknown Year'}</span>
              <span>•</span>
              <span>{formatDuration(song.duration_ms)}</span>
            </div>

            {song.preview_url && (
              <div style={styles.playerContainer}>
                <audio controls style={{width: '100%', outline: 'none'}}>
                  <source src={song.preview_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div style={styles.actionRow}>
              <button 
                className={`btn ${inPlaylist ? 'btn-danger' : 'btn-primary'}`} 
                onClick={togglePlaylist}
              >
                {inPlaylist ? '− Remove from Library' : '+ Add to Library'}
              </button>

              {song.external_urls?.spotify && (
                <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="btn" style={{marginLeft: '12px', background: '#1DB954', color: '#fff', border: 'none'}}>
                  Listen on Spotify
                </a>
              )}
            </div>
            
            <div style={styles.popularity}>
              <strong>Popularity Score:</strong> {song.popularity} / 100
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={styles.content}>
        <ReviewSection mediaType="song" mediaId={id} />
      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
    padding: '80px 0 40px 0',
    borderBottom: '1px solid var(--border-color)'
  },
  heroContainer: {
    display: 'flex',
    gap: '40px',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  albumArt: {
    width: '300px',
    height: '300px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    objectFit: 'cover'
  },
  heroInfo: {
    flex: 1,
    minWidth: '300px'
  },
  badge: {
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '8px',
    color: 'var(--text-secondary)'
  },
  title: {
    fontSize: '64px',
    margin: '0 0 12px 0',
    lineHeight: 1.1,
    background: 'linear-gradient(45deg, #1DB954, var(--accent-teal))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  artist: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 24px 0'
  },
  meta: {
    display: 'flex',
    gap: '12px',
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '24px'
  },
  playerContainer: {
    marginBottom: '24px',
    maxWidth: '400px'
  },
  actionRow: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center'
  },
  popularity: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  content: {
    paddingTop: '20px',
    paddingBottom: '80px'
  }
};

export default SongDetails;
