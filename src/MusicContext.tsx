import React, { createContext, useContext, useRef, useEffect } from 'react';

interface MusicContextProps {
  playMusic: () => void;
  stopMusic: () => void;
  setMusicSource: (src: string) => void;
}

const MusicContext = createContext<MusicContextProps | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true; // Asegura que la música haga loop
    audio.volume = 0.5; // Ajusta el volumen inicial
    return () => {
      audio.pause();
    };
  }, []);

  const playMusic = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play().catch(err => console.log('Error al reproducir audio:', err));
    }
  };

  const stopMusic = () => {
    audioRef.current.pause();
  };

  const setMusicSource = (src: string) => {
    const audio = audioRef.current;
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
      audio.play().catch(err => console.log('Error al reproducir nueva música:', err));
    }
  };

  return (
    <MusicContext.Provider value={{ playMusic, stopMusic, setMusicSource }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextProps => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic debe usarse dentro de MusicProvider');
  }
  return context;
};
