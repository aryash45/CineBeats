import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import ReviewSection from '../components/ReviewSection';
import MovieCard from '../components/MovieCard';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [soundtrack, setSoundtrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0); // Reset scroll on load
      try {
        const [movieData, recsData] = await Promise.all([
          api.getMovieDetails(id),
          // Fetch recommendations (using similar TMDB endpoint conceptually, simulated here with search or actually fetching it if backend supports it. Note: backend /movies/:id/recommendations)
          fetch(`http://localhost:5000/api/movies/${id}/recommendations`).then(res => res.json()).catch(() => [])
        ]);
        setMovie(movieData);
        setRecommendations(recsData);

        if (movieData?.title) {
          api.searchSongs(`${movieData.title} soundtrack`, null)
             .then(songs => setSoundtrack(songs.slice(0, 4)))
             .catch(() => setSoundtrack([]));
        }

        // Check watchlist if user is logged in
        if (token) {
          const list = await api.getWatchlist(token);
          const exists = list.find(item => item.media_id === id && item.media_type === 'movie');
          setInWatchlist(!!exists);
        }
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id, token]);

  const toggleWatchlist = async () => {
    if (!token) {
      alert("Please login to use watchlist");
      return;
    }
    
    try {
      if (inWatchlist) {
        // Need ID of item to delete... this requires searching the list
        const list = await api.getWatchlist(token);
        const item = list.find(item => item.media_id === id && item.media_type === 'movie');
        if (item) {
          await api.removeFromWatchlist(token, item.id);
          setInWatchlist(false);
        }
      } else {
        await api.addToWatchlist(token, 'movie', id, movie.title, movie.poster_path);
        setInWatchlist(true);
      }
    } catch (err) {
      alert('Failed to update watchlist');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !movie) return <div className="container" style={{padding: '40px', color: 'red'}}>{error || 'Movie not found'}</div>;

  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
  const trailer = movie.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');

  return (
    <div>
      {/* Hero Header */}
      <div style={{...styles.hero, ...(backdropUrl ? {backgroundImage: `url(${backdropUrl})`} : {})}}>
        <div style={styles.heroOverlay}>
          <div className="container" style={styles.heroContainer}>
            <img src={posterUrl} alt={movie.title} style={styles.heroPoster} />
            <div style={styles.heroInfo}>
              <h1 style={styles.title}>{movie.title} <span style={styles.year}>({new Date(movie.release_date).getFullYear()})</span></h1>
              <div style={styles.meta}>
                <span style={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
                <span>•</span>
                <span>{movie.genres?.map(g => g.name).join(', ')}</span>
              </div>
              <p style={styles.tagline}>{movie.tagline}</p>
              
              <div style={styles.actionRow}>
                <button 
                  className={`btn ${inWatchlist ? 'btn-danger' : 'btn-primary'}`} 
                  onClick={toggleWatchlist}
                >
                  {inWatchlist ? '− Remove from Watchlist' : '+ Add to Watchlist'}
                </button>
              </div>

              <h3>Overview</h3>
              <p style={styles.overview}>{movie.overview}</p>

              {trailer && (
                <div style={styles.trailerContainer}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${trailer.key}`} 
                    title="Movie Trailer" 
                    frameBorder="0" 
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    style={{ borderRadius: '12px' }}
                  ></iframe>
                </div>
              )}

              {movie.credits && movie.credits.crew && (
                <div style={styles.crew}>
                  {movie.credits.crew.filter(c => c.job === 'Director').slice(0, 1).map(dir => (
                    <div key={dir.id}><strong>Director:</strong> {dir.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={styles.content}>
        {/* Cast Section */}
        {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
          <div style={styles.section}>
            <h2>Top Cast</h2>
            <div style={styles.castList}>
              {movie.credits.cast.slice(0, 6).map(person => (
                <div key={person.id} style={styles.castCard}>
                  <img src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x278?text=N/A'} alt={person.name} style={styles.castImg} />
                  <div style={styles.castInfo}><strong>{person.name}</strong><br/><small>{person.character}</small></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReviewSection mediaType="movie" mediaId={id} />

        {/* Soundtrack Section */}
        {soundtrack && soundtrack.length > 0 && (
          <div style={{...styles.section, marginTop: '40px'}}>
            <h2>Vibe Match: Official Soundtrack <span style={{color: 'var(--accent-teal)'}}>🎵</span></h2>
            <div style={styles.songsList}>
              {soundtrack.map(s => (
                <SongCard key={s.id} song={s} />
              ))}
            </div>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div style={{...styles.section, marginTop: '40px'}}>
            <h2>Similar Movies</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px'}}>
              {recommendations.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  hero: {
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '600px',
    backgroundColor: 'var(--bg-primary)'
  },
  heroOverlay: {
    padding: '60px 0',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(to right, rgba(15, 12, 41, 1) 150px, rgba(48, 43, 99, 0.8) 100%)'
  },
  heroContainer: {
    display: 'flex',
    gap: '40px',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  heroPoster: {
    width: '300px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
  },
  heroInfo: {
    flex: 1,
    minWidth: '300px',
    color: '#fff'
  },
  title: {
    fontSize: '40px',
    margin: '0 0 8px 0'
  },
  year: {
    fontWeight: 'normal',
    opacity: 0.8
  },
  meta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '16px',
    opacity: 0.9
  },
  rating: {
    fontWeight: 'bold',
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  tagline: {
    fontStyle: 'italic',
    opacity: 0.8,
    marginBottom: '24px',
    fontSize: '18px'
  },
  actionRow: {
    marginBottom: '32px'
  },
  overview: {
    lineHeight: 1.6,
    marginBottom: '24px',
    maxWidth: '800px',
    fontSize: '16px'
  },
  crew: {
    fontSize: '16px'
  },
  content: {
    paddingTop: '40px',
    paddingBottom: '80px'
  },
  section: {
    marginBottom: '40px'
  },
  songsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '40px'
  },
  trailerContainer: {
    width: '100%',
    maxWidth: '500px',
    aspectRatio: '16 / 9',
    marginBottom: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
    borderRadius: '12px'
  },
  castList: {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    paddingBottom: '16px'
  },
  castCard: {
    width: '140px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    flexShrink: 0
  },
  castImg: {
    width: '100%',
    height: '210px',
    objectFit: 'cover'
  },
  castInfo: {
    padding: '8px',
    fontSize: '14px',
    textAlign: 'center'
  }
};

export default MovieDetails;
