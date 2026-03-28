"use client";

import { useState, useRef, useEffect } from 'react';
import { COLORS } from '../lib/constants';

export default function SimpleAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Set volume antes de reproducir
      audio.volume = 0.5;
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  // Auto-pause cuando se cambia de página o se cierra
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/fiesta-music.mp3"
        preload="metadata"
        loop
      />

      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        {/* Botón circular */}
        <button
          onClick={togglePlay}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: isPlaying
              ? `linear-gradient(135deg, ${COLORS.magenta}, ${COLORS.orange})`
              : `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
            border: `2px solid ${COLORS.bone}`,
            color: COLORS.bone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isHovered
              ? `0 6px 25px ${COLORS.orange}80`
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        >
          {/* Efecto de pulso cuando está reproduciendo */}
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                border: `2px solid ${COLORS.orange}`,
                animation: 'pulse 2s infinite',
              }}
            />
          )}

          {/* Icono */}
          {isPlaying ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <polygon points="8,5 8,19 19,12" />
            </svg>
          )}

          {/* Indicador de sonido */}
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: COLORS.bone,
                boxShadow: `0 0 4px ${COLORS.orange}`,
              }}
            />
          )}
        </button>

        {/* Tooltip */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: 8,
              padding: '6px 12px',
              background: COLORS.darkCard,
              border: `1px solid ${COLORS.orange}`,
              borderRadius: 8,
              color: COLORS.bone,
              fontSize: 12,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {isPlaying ? 'Pause music' : 'Play music'}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}