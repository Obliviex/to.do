import { useState, useEffect, useRef } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMER_CONFIG = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(TIMER_CONFIG[mode]);
  }, [mode]);

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
    setTimeLeft(TIMER_CONFIG[mode]);
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Pomodoro';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <div className="bg-card rounded-card p-8 max-w-md mx-auto">
      {/* Mode Tabs */}
      <div className="flex gap-2 mb-8">
        {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              mode === m
                ? 'bg-background-dark text-white'
                : 'bg-background text-text-muted hover:bg-background-dark'
            }`}
          >
            {getModeLabel()}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="text-8xl font-bold text-white mb-4 font-mono">
          {formatTime(timeLeft)}
        </div>
        <div className="text-text-muted text-sm">
          #{sessionCount} {mode === 'pomodoro' ? 'Time to focus!' : 'Time to take a break!'}
        </div>
      </div>

      {/* Start/Pause Button */}
      <button
        onClick={handleStartPause}
        className="w-full py-4 bg-white text-background-dark rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors mb-4"
      >
        {isRunning ? 'PAUSE' : 'START'}
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full py-2 text-text-muted hover:text-white transition-colors text-sm"
      >
        Reset
      </button>
    </div>
  );
}
