import React from 'react';
import { useAudio } from '../context/AudioContext';

const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, playTrack, setVolume } = useAudio();

  if (!currentTrack) return null;

  return (
    <div style={styles.playerContainer}>
      <div style={styles.trackInfo}>
        <img src={currentTrack.image || 'https://via.placeholder.com/60'} alt={currentTrack.name} style={styles.trackImage} />
        <div style={styles.textInfo}>
          <div style={styles.title}>{currentTrack.name}</div>
          <div style={styles.artist}>{currentTrack.artist}</div>
        </div>
      </div>

      <div style={styles.controls}>
        <button style={styles.playButton} onClick={() => playTrack(currentTrack)}>
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div style={styles.volumeControl}>
        <span style={{fontSize: '12px', opacity: 0.7}}>Volume</span>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          defaultValue="0.5"
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={styles.slider}
        />
      </div>
    </div>
  );
};

const styles = {
  playerContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: 'rgba(15, 12, 41, 0.85)',
    backdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 9999,
    fontFamily: 'Inter, sans-serif'
  },
  trackInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    width: '30%',
    minWidth: '200px'
  },
  trackImage: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  textInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  title: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  artist: {
    color: 'var(--text-secondary, #aaa)',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  playButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '30%',
    justifyContent: 'flex-end',
    color: '#fff'
  },
  slider: {
    width: '100px',
    cursor: 'pointer'
  }
};

export default GlobalAudioPlayer;
