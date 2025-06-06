import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Check, 
  X, 
  Timer, 
  Target,
  Weight,
  RotateCcw
} from 'lucide-react';

const WorkoutPage = ({ workout, onComplete, onExit }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState([]);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalSetsInWorkout = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSetsCount = completedSets.length;
  const progress = (completedSetsCount / totalSetsInWorkout) * 100;

  useEffect(() => {
    if (currentExercise) {
      setCurrentWeight(currentExercise.weight);
      setCurrentReps(currentExercise.reps);
    }
  }, [currentExercise]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimeLeft]);

  const startRest = () => {
    setRestTimeLeft(currentExercise.restTime);
    setIsResting(true);
    setIsTimerRunning(true);
  };

  const skipRest = () => {
    setIsTimerRunning(false);
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const completeSet = () => {
    const setData = {
      exerciseIndex: currentExerciseIndex,
      exerciseName: currentExercise.name,
      set: currentSet,
      reps: currentReps,
      weight: currentWeight,
      timestamp: Date.now(),
    };

    setCompletedSets([...completedSets, setData]);

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      startRest();
    } else {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
      } else {
        onComplete();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CircularTimer = ({ timeLeft, totalTime }) => {
    const percentage = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsla(var(--muted), 0.3)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{formatTime(timeLeft)}</span>
        </div>
      </div>
    );
  };

  if (isResting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="glass-effect p-8 max-w-md mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tempo de Descanso</h2>
              <p className="text-muted-foreground">
                {currentExercise.name} - Série {currentSet -1} concluída!
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <CircularTimer timeLeft={restTimeLeft} totalTime={currentExercise.restTime} />
            </div>

            <div className="space-y-4">
              <Button
                onClick={skipRest}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Pular Descanso
              </Button>

              <Button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-full gradient-bg hover:opacity-90 text-primary-foreground"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Continuar
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="glass-effect border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{workout.name}</h1>
            <p className="text-muted-foreground text-sm">
              Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
            </p>
          </div>
          <Button
            onClick={onExit}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progresso do Treino</span>
            <span>{completedSetsCount} de {totalSetsInWorkout} séries</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted" indicatorClassName="bg-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <motion.div
          key={currentExerciseIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="glass-effect p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {currentExercise.name}
              </h2>
              <div className="flex items-center justify-center space-x-6 text-muted-foreground">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  <span>Série {currentSet} de {currentExercise.sets}</span>
                </div>
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  <span>{currentExercise.restTime}s descanso</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-foreground font-medium flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2 text-primary" />
                  Repetições
                </label>
                <Input
                  type="number"
                  min="1"
                  value={currentReps}
                  onChange={(e) => setCurrentReps(parseInt(e.target.value) || 0)}
                  className="bg-input border-border text-foreground text-center text-xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-foreground font-medium flex items-center">
                  <Weight className="h-4 w-4 mr-2 text-primary" />
                  Peso (kg)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                  className="bg-input border-border text-foreground text-center text-xl font-bold"
                />
              </div>
            </div>

            <Button
              onClick={completeSet}
              className="w-full gradient-bg hover:opacity-90 text-primary-foreground font-semibold py-4 text-lg pulse-glow"
              disabled={currentReps === 0}
            >
              <Check className="h-5 w-5 mr-2" />
              Concluir Série
            </Button>

            {completedSets.filter(set => set.exerciseIndex === currentExerciseIndex).length > 0 && (
              <div className="mt-8">
                <h3 className="text-foreground font-medium mb-4">Séries Anteriores</h3>
                <div className="space-y-2">
                  {completedSets
                    .filter(set => set.exerciseIndex === currentExerciseIndex)
                    .map((set, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-muted/30 rounded-lg p-3"
                      >
                        <span className="text-muted-foreground">Série {set.set}</span>
                        <span className="text-foreground font-medium">
                          {set.reps} reps × {set.weight}kg
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutPage;