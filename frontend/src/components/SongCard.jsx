import React from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';

const SongCard = ({ song, onAddPlaylist, inPlaylist }) => {
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const imageUrl = song.image || 'https://via.placeholder.com/280x200?text=No+Cover';
  
  const formatDuration = (ms) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const isCurrentTrack = currentTrack?.id === song.id;

  return (
    <div className="card" style={styles.card}>
      <Link to={`/song/${song.id}`}>
        <div style={styles.imgContainer}>
          <img src={imageUrl} alt={song.name} style={styles.img} />
        </div>
      </Link>
      {song.preview_url && (
        <div 
          style={{...styles.playOverlay, opacity: isCurrentTrack ? 1 : styles.playOverlay.opacity}}
          onClick={() => playTrack(song)}
          className={!isCurrentTrack ? "hoverPlayOverlay" : ""}
        >
          <span style={styles.playIcon}>{isCurrentTrack && isPlaying ? '⏸' : '▶'}</span>
        </div>
      )}
      <div style={styles.content}>
        <div style={styles.info}>
          <Link to={`/song/${song.id}`}>
            <h3 style={styles.title} title={song.name}>{song.name}</h3>
          </Link>
          <p style={styles.artist} title={song.artist}>{song.artist}</p>
          <p style={styles.duration}>{formatDuration(song.duration_ms)}</p>
        </div>
        
        {onAddPlaylist && (
          <button 
            className={`btn ${inPlaylist ? 'btn-danger' : 'btn-primary'}`} 
            style={styles.actionBtn}
            onClick={() => onAddPlaylist(song)}
            title={inPlaylist ? "Remove from Playlist" : "Add to Playlist"}
          >
            {inPlaylist ? '−' : '+'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'row',
    height: '100px',
    width: '100%'
  },
  imgContainer: {
    position: 'relative',
    width: '100px',
    height: '100%',
    flexShrink: 0
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  playOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.4)',
    opacity: 0,
    transition: 'opacity var(--transition-fast)',
    zIndex: 2,
    borderTopLeftRadius: 'var(--radius-md)',
    borderBottomLeftRadius: 'var(--radius-md)'
  },
  playIcon: {
    fontSize: '24px',
    color: '#fff'
  },
  content: {
    padding: '12px 16px',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 0 // allow text truncation
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
    flex: 1,
    paddingRight: '12px'
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  artist: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  duration: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    opacity: 0.7
  },
  actionBtn: {
    width: '40px',
    height: '40px',
    padding: 0,
    borderRadius: '50%',
    fontSize: '20px',
    flexShrink: 0
  }
};

// CSS hack for hover effect
const css = `
  .hoverPlayOverlay:hover { opacity: 1 !important; background: rgba(0,0,0,0.6) !important; cursor: pointer; }
  .card { position: relative; }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

export default SongCard;
