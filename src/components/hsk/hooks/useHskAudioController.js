import { useEffect, useRef, useState } from 'react';
import {
  speakChinese,
  setActiveAudioPlaybackRate,
  getTtsFunctionalSettings,
  setTtsFunctionalSettings,
} from '../../../utils/audio';
import { unlockMobileAudio, prefetchTtsItems } from '../../../services/ttsAudioService.js';
import { getAudioPlayLimit } from '../../../services/hskService';

export function useHskAudioController({ exam, currentIdx, examMode }) {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPlayCounts, setAudioPlayCounts] = useState({});
  const [audioNotice, setAudioNotice] = useState(null);
  const [listeningRate, setListeningRate] = useState(() => getTtsFunctionalSettings().rate || 1.0);
  const [listeningVoice, setListeningVoice] = useState(() => {
    const v = getTtsFunctionalSettings().voice;
    return v === 'male' || v === 'male_standard' || v === 'zh-CN-YunxiNeural' ? 'male' : 'female';
  });
  const [audioFallbackActive, setAudioFallbackActive] = useState(false);

  const sharedExamAudioRef = useRef(null);

  const stopAllExamAudio = () => {
    try {
      if (sharedExamAudioRef.current) {
        sharedExamAudioRef.current.pause();
        sharedExamAudioRef.current.currentTime = 0;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    setAudioPlaying(false);
  };

  useEffect(() => {
    const qs = exam?.questions;
    if (!Array.isArray(qs) || qs.length === 0) return;
    const upcomingTexts = [qs[currentIdx], qs[currentIdx + 1], qs[currentIdx + 2]]
      .filter((item) => item && item.part_type === 'listening' && !(item.audio_url && item.audio_url.trim().length > 5))
      .map((item) => item.audio_script || item.prompt)
      .filter(Boolean);
    if (upcomingTexts.length > 0) {
      void prefetchTtsItems(upcomingTexts, { concurrency: 2, voice: listeningVoice });
    }
  }, [exam, currentIdx, listeningVoice]);

  useEffect(() => {
    return () => {
      stopAllExamAudio();
    };
  }, []);

  const handleChangeListeningRate = (spd) => {
    setListeningRate(spd);
    setTtsFunctionalSettings({ rate: spd });
    setActiveAudioPlaybackRate(spd);
    if (sharedExamAudioRef.current) {
      sharedExamAudioRef.current.preservesPitch = true;
      sharedExamAudioRef.current.webkitPreservesPitch = true;
      sharedExamAudioRef.current.playbackRate = spd;
    }
  };

  const handleChangeListeningVoice = (voiceProfile) => {
    setListeningVoice(voiceProfile);
    setTtsFunctionalSettings({ voice: voiceProfile });
  };

  const handlePlayAudio = (q) => {
    unlockMobileAudio();

    const maxPlays = getAudioPlayLimit(exam?.level, examMode);
    const currentPlays = audioPlayCounts[q.id] || 0;

    if (examMode === 'simulation' && currentPlays >= maxPlays) {
      setAudioNotice(`Đã đạt giới hạn số lần nghe theo quy chế (${maxPlays} lần). Trong phòng thi không thể phát lại.`);
      setTimeout(() => setAudioNotice(null), 4000);
      return;
    }

    setAudioPlaying(true);
    setAudioFallbackActive(false);
    setAudioPlayCounts((prev) => ({
      ...prev,
      [q.id]: (prev[q.id] || 0) + 1,
    }));

    const fallbackText = q.audio_script || q.prompt;
    const playFallbackSpeech = () => {
      speakChinese(fallbackText, {
        rate: listeningRate,
        voice: listeningVoice,
        onPlaybackMode: (mode) => setAudioFallbackActive(mode === 'device'),
        onEnd: () => setAudioPlaying(false),
        onError: () => setAudioPlaying(false),
      });
    };

    if (q.audio_url && q.audio_url.trim().length > 5) {
      try {
        if (!sharedExamAudioRef.current) {
          sharedExamAudioRef.current = new Audio();
        }
        const audio = sharedExamAudioRef.current;
        audio.pause();
        audio.src = q.audio_url;
        audio.currentTime = 0;
        audio.preservesPitch = true;
        audio.webkitPreservesPitch = true;
        audio.playbackRate = listeningRate;
        audio.onended = () => setAudioPlaying(false);
        audio.onerror = playFallbackSpeech;
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(playFallbackSpeech);
        }
      } catch {
        playFallbackSpeech();
      }
    } else {
      playFallbackSpeech();
    }
  };

  return {
    audioPlaying,
    audioPlayCounts,
    audioNotice,
    listeningRate,
    listeningVoice,
    audioFallbackActive,
    sharedExamAudioRef,
    stopAllExamAudio,
    handleChangeListeningRate,
    handleChangeListeningVoice,
    handlePlayAudio,
  };
}
