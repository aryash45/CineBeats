import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const playTrack = (track) => {
    const audio = audioRef.current;
    
    // If clicking same track, toggle play/pause
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(e => console.error("Playback failed:", e));
        setIsPlaying(true);
      }
      return;
    }

    // New track
    setCurrentTrack(track);
    if (track.preview_url) {
      audio.src = track.preview_url;
      audio.volume = 0.5; // Start at 50% volume for previews so it's not deafening
      audio.play().catch(e => console.error("Playback failed:", e));
      setIsPlaying(true);
    } else {
      console.warn("No preview URL for this track");
    }
  };

  const pauseTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const setVolume = (level) => {
    audioRef.current.volume = level;
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, pauseTrack, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
};
