"use client";

import { useState, useRef, useEffect } from 'react';
import { COLORS } from '../lib/constants';

interface AudioPlayerProps {
  autoPlay?: boolean;
  showControls?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
}

export default function AudioPlayer({
  autoPlay = false,
  showControls = true,
  position = 'bottom-right',
  size = 'medium',
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60); // 60 segundos por defecto
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Tamaños basados en prop
  const sizes = {
    small: { player: 40, icon: 20, expandedWidth: 300 },
    medium: { player: 50, icon: 24, expandedWidth: 350 },
    large: { player: 60, icon: 28, expandedWidth: 400 },
  };

  const currentSize = sizes[size];

  // Posicionamiento
  const positionStyles = {
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'top-left': { top: 20, left: 20 },
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 60);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    
    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Audio element (hidden) */}
      <audio
        ref={audioRef}
        src="/audio/fiesta-music.mp3"
        preload="metadata"
        loop
      />

      {/* Player UI */}
      <div
        style={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 1000,
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        {/* Compact player */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              width: currentSize.player,
              height: currentSize.player,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
              border: `2px solid ${COLORS.bone}`,
              color: COLORS.bone,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = `0 6px 25px ${COLORS.orange}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            }}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <svg
                width={currentSize.icon}
                height={currentSize.icon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg
                width={currentSize.icon}
                height={currentSize.icon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
        )}

        {/* Expanded player */}
        {isExpanded && (
          <div
            style={{
              width: currentSize.expandedWidth,
              background: COLORS.darkCard,
              border: `2px solid ${COLORS.orange}`,
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={COLORS.bone}>
                    <polygon points="8,5 8,19 19,12" />
                  </svg>
                </div>
                <span style={{ color: COLORS.bone, fontWeight: 600, fontSize: 14 }}>
                  Fiesta Music
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: 20,
                  lineHeight: 1,
                }}
                aria-label="Close player"
              >
                ×
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 16 }}>
              <div
                ref={progressBarRef}
                onClick={handleProgressClick}
                style={{
                  height: 6,
                  background: '#333',
                  borderRadius: 3,
                  cursor: 'pointer',
                  position: 'relative',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: `${(currentTime / duration) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.magenta})`,
                    borderRadius: 3,
                    transition: 'width 0.1s linear',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: `${(currentTime / duration) * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 12,
                    height: 12,
                    background: COLORS.bone,
                    borderRadius: '50%',
                    boxShadow: `0 0 8px ${COLORS.orange}`,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
                  border: 'none',
                  color: COLORS.bone,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="8,5 8,19 19,12" />
                  </svg>
                )}
              </button>

              {/* Volume controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <button
                  onClick={toggleMute}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isMuted ? '#888' : COLORS.bone,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{
                    flex: 1,
                    height: 4,
                    background: `linear-gradient(90deg, ${COLORS.orange} ${volume * 100}%, #333 ${volume * 100}%)`,
                    borderRadius: 2,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label="Volume"
                />
              </div>

              {/* Loop toggle */}
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.loop = !audioRef.current.loop;
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: audioRef.current?.loop ? COLORS.orange : '#888',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-label="Toggle loop"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                </svg>
              </button>
            </div>

            {/* Now playing */}
            <div style={{
              marginTop: 12,
              padding: 8,
              background: 'rgba(255, 122, 0, 0.1)',
              borderRadius: 8,
              borderLeft: `3px solid ${COLORS.orange}`,
              fontSize: 12,
              color: '#888',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${COLORS.orange}20, ${COLORS.magenta}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={COLORS.orange}>
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <span>Now playing: <strong style={{ color: COLORS.bone }}>Fiesta Music</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}