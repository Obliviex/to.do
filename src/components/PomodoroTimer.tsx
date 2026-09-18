import { useState, useEffect, useRef } from 'react';
import { useTodoStore } from '../store/store';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMER_CONFIG = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 10 * 60, // 10 minutes
};

export function PomodoroTimer() {
  const { timerMode, setTimerMode } = useTodoStore();
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [useCustom, setUseCustom] = useState(false);
  const sessionCount = 1;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = useCustom ? customMinutes * 60 : TIMER_CONFIG[timerMode];
    setTimeLeft(duration);
  }, [timerMode, useCustom, customMinutes]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Timer completed - could add sound or notification here
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const duration = useCustom ? customMinutes * 60 : TIMER_CONFIG[timerMode];
    setTimeLeft(duration);
  };

  const handleModeChange = (newMode: TimerMode) => {
    setTimerMode(newMode);
    setIsRunning(false);
    setUseCustom(false);
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 120) {
      setCustomMinutes(value);
      setUseCustom(true);
      setIsRunning(false);
      setTimeLeft(value * 60);
    }
  };

  const getModeColor = () => {
    switch (timerMode) {
      case 'pomodoro':
        return 'bg-accent';
      case 'shortBreak':
        return 'bg-turquoise';
      case 'longBreak':
        return 'bg-blue';
    }
  };

  return (
    <div className={`${getModeColor()} rounded-card p-8 max-w-md mx-auto`}>
      {/* Mode Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => handleModeChange('pomodoro')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
            timerMode === 'pomodoro'
              ? 'bg-white text-accent'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
            timerMode === 'shortBreak'
              ? 'bg-white text-turquoise'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          5 min
        </button>
        <button
          onClick={() => handleModeChange('longBreak')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
            timerMode === 'longBreak'
              ? 'bg-white text-blue'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          10 min break
        </button>
      </div>

      {/* Custom Time Input */}
      <div className="mb-6">
        <label className="text-white/80 text-sm mb-2 block">Custom duration (minutes):</label>
        <input
          type="number"
          min="1"
          max="120"
          value={customMinutes}
          onChange={handleCustomTimeChange}
          className="w-full px-4 py-2 bg-white/20 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="Enter minutes"
        />
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="text-8xl font-bold mb-4 font-mono text-white">
          {formatTime(timeLeft)}
        </div>
        <div className="text-white/80 text-sm">
          #{sessionCount} {timerMode === 'pomodoro' ? 'Time to focus!' : 'Time to take a break!'}
        </div>
      </div>

      {/* Start/Pause Button */}
      <button
        onClick={handleStartPause}
        className="w-full py-4 bg-white text-text rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors mb-4"
      >
        {isRunning ? 'PAUSE' : 'START'}
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full py-2 text-white/80 hover:text-white transition-colors text-sm"
      >
        Reset
      </button>
    </div>
  );
}
