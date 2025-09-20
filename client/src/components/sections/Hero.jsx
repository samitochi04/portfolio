import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { Scene, AIRobot } from '../three';
import { STORAGE_KEYS } from '../../lib/constants';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const [voicePlayed, setVoicePlayed] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if voice greeting was already played
    const played = localStorage.getItem(STORAGE_KEYS.VOICE_PLAYED);
    if (played) {
      setVoicePlayed(true);
    }

    // Check if audio file is available
    const audio = new Audio('/voice-greeting.mp3');
    audio.addEventListener('canplaythrough', () => {
      setAudioAvailable(true);
    });
    
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Auto-play voice greeting on first visit
    if (audioAvailable && !voicePlayed) {
      playVoiceGreeting();
    }
  }, [audioAvailable, voicePlayed]);

  const playVoiceGreeting = () => {
    if (audioRef.current && audioAvailable) {
      setIsPlaying(true);
      audioRef.current.play()
        .then(() => {
          setVoicePlayed(true);
          localStorage.setItem(STORAGE_KEYS.VOICE_PLAYED, 'true');
        })
        .catch((error) => {
          console.log('Audio playback failed:', error);
          setIsPlaying(false);
        });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      {/* 3D Scene with AI Robot */}
      <Scene>
        <AIRobot />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
      </Scene>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Voice Control */}
        {audioAvailable && (
          <div className="absolute top-4 left-4">
            <button
              onClick={playVoiceGreeting}
              disabled={isPlaying}
              className={`p-3 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-red-600 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              title={isPlaying ? t('hero.stopVoice') : t('hero.playVoice')}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Samuel FOTSO
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-gray-300">
              {t('hero.subtitle')}
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">3+</div>
              <div className="text-sm text-gray-400">{t('hero.stats.experience')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">15+</div>
              <div className="text-sm text-gray-400">{t('hero.stats.projects')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">10+</div>
              <div className="text-sm text-gray-400">{t('hero.stats.skills')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">5/7</div>
              <div className="text-sm text-gray-400">{t('hero.stats.availability')}</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="accent"
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto"
            >
              {t('hero.cta.viewWork')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto"
            >
              {t('hero.cta.contact')}
            </Button>
          </div>
        </div>

      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </section>
  );
};

export default Hero;