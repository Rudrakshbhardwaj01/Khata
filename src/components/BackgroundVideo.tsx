import { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  fallbackImage?: string;
}

export function BackgroundVideo({ fallbackImage }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .catch(() => {
          video.muted = true;
          video.play().catch(() => setHasError(true));
        });
    }

    return () => {
      video.pause();
    };
  }, [prefersReducedMotion]);

  const handleError = () => {
    setHasError(true);
  };

  const handleCanPlay = () => {
    setHasError(false);
  };

  if (prefersReducedMotion || hasError) {
    return (
      <div
        className="bg-video-fallback"
        style={{
          backgroundImage: fallbackImage ? `url(${fallbackImage})` : 'none',
          backgroundColor: '#0d1b2a',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="bg-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={handleError}
      onCanPlay={handleCanPlay}
      aria-hidden="true"
      poster={fallbackImage}
    >
      <source src="/background.mp4" type="video/mp4" />
    </video>
  );
}