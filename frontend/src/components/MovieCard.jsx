import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, onAddWatchlist, inWatchlist }) => {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  return (
    <div className="card" style={styles.card}>
      <Link to={`/movie/${movie.id}`}>
        <div style={styles.imgContainer}>
          <img src={posterUrl} alt={movie.title || movie.name} style={styles.img} />
          <div style={styles.overlay}>
            <span style={styles.rating}>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </Link>
      <div style={styles.content}>
        <Link to={`/movie/${movie.id}`}>
          <h3 style={styles.title}>{movie.title || movie.name}</h3>
        </Link>
        <div style={styles.actions}>
          {onAddWatchlist && (
            <button 
              className={`btn  ${inWatchlist ? 'btn-danger' : 'btn-primary'}`} 
              style={styles.actionBtn}
              onClick={() => onAddWatchlist(movie)}
            >
              {inWatchlist ? 'Remove' : '+ Watchlist'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  imgContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '150%', // 2:3 aspect ratio typical for posters
    overflow: 'hidden'
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  overlay: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 600,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center'
  },
  actionBtn: {
    width: '100%',
    height: '36px',
    fontSize: '14px'
  }
};

export default MovieCard;
