
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Timer from '@/components/Timer';
import { toast } from '@/components/ui/use-toast';

const WorkoutSession = ({ workout, onBack, onComplete }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [showTimer, setShowTimer] = useState(false);
  const [sessionData, setSessionData] = useState({});

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalSets = parseInt(currentExercise?.sets || 0);
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  const isLastSet = currentSetIndex === totalSets - 1;

  const completeSet = () => {
    const setKey = `${currentExerciseIndex}-${currentSetIndex}`;
    setCompletedSets(prev => ({ ...prev, [setKey]: true }));

    const exerciseKey = `exercise-${currentExerciseIndex}`;
    const currentWeightInput = document.getElementById('current-weight');
    const currentRepsInput = document.getElementById('current-reps');

    const setData = sessionData[exerciseKey] || {};
    setData[`set-${currentSetIndex}`] = {
      weight: currentWeightInput?.value || currentExercise.weight,
      reps: currentRepsInput?.value || currentExercise.reps,
      completed: true
    };
    
    setSessionData(prev => ({
      ...prev,
      [exerciseKey]: setData
    }));

    if (isLastSet && isLastExercise) {
      toast({
        title: "🎉 Treino Concluído!",
        description: "Parabéns! Você completou todo o treino.",
      });
      onComplete && onComplete(sessionData);
    } else if (isLastSet) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
      toast({
        title: "Exercício Concluído!",
        description: `Próximo: ${workout.exercises[currentExerciseIndex + 1]?.name}`,
      });
    } else {
      setCurrentSetIndex(prev => prev + 1);
      setShowTimer(true);
    }
  };

  const isSetCompleted = (exerciseIndex, setIndex) => {
    return completedSets[`${exerciseIndex}-${setIndex}`] || false;
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
    toast({
      title: "Descanso Finalizado!",
      description: "Hora da próxima série!",
    });
  };

  if (!currentExercise) return null;

  const progressPercentage = Math.round(((currentExerciseIndex + (isSetCompleted(currentExerciseIndex, currentSetIndex) ? (currentSetIndex +1) : currentSetIndex) / totalSets) / workout.exercises.length) * 100);


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <span className="text-2xl font-bold text-primary">{workout.name}</span>
          <p className="text-muted-foreground">
            Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="workout-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-accent">{currentExercise.name}</CardTitle>
            <p className="text-muted-foreground">
              Série {currentSetIndex + 1} de {totalSets}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-weight" className="text-foreground/80">Carga (kg)</Label>
                <Input
                  id="current-weight"
                  type="number"
                  defaultValue={currentExercise.weight}
                  placeholder="Peso"
                  className="bg-background/80 placeholder:text-muted-foreground/70"
                />
              </div>
              <div>
                <Label htmlFor="current-reps" className="text-foreground/80">Repetições</Label>
                <Input
                  id="current-reps"
                  type="number"
                  defaultValue={currentExercise.reps}
                  placeholder="Reps"
                  className="bg-background/80 placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80">Progresso das Séries</Label>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: totalSets }).map((_, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      index === currentSetIndex 
                        ? 'border-accent bg-accent/10' 
                        : isSetCompleted(currentExerciseIndex, index)
                        ? 'border-primary bg-primary/10'
                        : 'border-muted'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {isSetCompleted(currentExerciseIndex, index) ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className={`w-5 h-5 ${index === currentSetIndex ? 'text-accent' : 'text-muted-foreground'}`} />
                    )}
                    <span className={`text-sm ${index === currentSetIndex ? 'text-accent' : isSetCompleted(currentExerciseIndex, index) ? 'text-primary' : 'text-muted-foreground'}`}>Série {index + 1}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button 
              onClick={completeSet}
              className="w-full"
              disabled={isSetCompleted(currentExerciseIndex, currentSetIndex)}
            >
              {isSetCompleted(currentExerciseIndex, currentSetIndex) 
                ? '✅ Série Concluída' 
                : 'Concluir Série'
              }
            </Button>
          </CardContent>
        </Card>

        {showTimer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="floating-animation"
          >
            <Timer 
              duration={currentExercise.restTime} 
              onComplete={handleTimerComplete}
            />
          </motion.div>
        )}

        {!showTimer && workout.exercises.length > 1 && (
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Próximos Exercícios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 4).map((exercise) => (
                  <div key={exercise.id} className="exercise-item p-3 rounded-lg">
                    <div className="font-medium text-accent">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} × {exercise.reps} 
                      {exercise.weight && ` • ${exercise.weight}kg`}
                    </div>
                  </div>
                ))}
                {workout.exercises.length <= currentExerciseIndex + 1 && (
                  <div className="text-center text-accent font-semibold">
                    🎯 Último exercício!
                  </div>
                )}
                 {workout.exercises.length > currentExerciseIndex + 4 && (
                   <p className="text-sm text-muted-foreground text-center">...</p>
                 )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="glass-effect shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-foreground/80">Progresso do Treino</span>
            <span className="text-primary font-semibold">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 mt-2">
            <motion.div 
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutSession;