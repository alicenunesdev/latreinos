
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const Timer = ({ duration = 60, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete && onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setIsCompleted(false);
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 283;

  return (
    <Card className={`timer-glow glass-effect ${isCompleted ? 'border-accent' : ''}`}>
      <CardContent className="p-6 text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-accent/20"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-accent"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              
              style={{
                strokeDasharray: 283,
                strokeDashoffset: 283 - progress,
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-2xl font-bold text-accent"
              animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
            >
              {formatTime(timeLeft)}
            </motion.span>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleTimer}
            variant={isRunning ? "secondary" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-accent font-semibold"
          >
            ✅ Descanso concluído!
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default Timer;