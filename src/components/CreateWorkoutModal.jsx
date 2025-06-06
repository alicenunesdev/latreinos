import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, X } from 'lucide-react';

const CreateWorkoutModal = ({ isOpen, onClose, onCreateWorkout }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: 3, reps: 12, weight: 0, restTime: 60 }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 12, weight: 0, restTime: 60 }]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index, field, value) => {
    const updated = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!workoutName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do treino é obrigatório!",
        variant: "destructive",
        className: 'bg-destructive text-destructive-foreground',
      });
      return;
    }

    const invalidExercises = exercises.filter(ex => !ex.name.trim());
    if (invalidExercises.length > 0) {
      toast({
        title: "Erro",
        description: "Todos os exercícios devem ter um nome!",
        variant: "destructive",
        className: 'bg-destructive text-destructive-foreground',
      });
      return;
    }

    const estimatedDuration = exercises.reduce((total, ex) => {
      return total + (ex.sets * (ex.restTime + 30)); 
    }, 0) / 60; 

    const workout = {
      name: workoutName,
      exercises: exercises,
      estimatedDuration: Math.round(estimatedDuration),
    };

    onCreateWorkout(workout);
    
    setWorkoutName('');
    setExercises([{ name: '', sets: 3, reps: 12, weight: 0, restTime: 60 }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        >
          <Card className="glass-effect p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Criar Novo Treino</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workoutName" className="text-foreground">Nome do Treino</Label>
                <Input
                  id="workoutName"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Ex: Treino de Peito e Tríceps"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground text-lg">Exercícios</Label>
                  <Button
                    type="button"
                    onClick={addExercise}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-effect border-border/50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-foreground font-medium">Exercício {index + 1}</span>
                        {exercises.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeExercise(index)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label className="text-muted-foreground">Nome do Exercício</Label>
                          <Input
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            placeholder="Ex: Supino Reto"
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Séries</Label>
                          <Input
                            type="number"
                            min="1"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Repetições</Label>
                          <Input
                            type="number"
                            min="1"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Peso (kg)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={exercise.weight}
                            onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Descanso (seg)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="15"
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value) || 0)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-bg hover:opacity-90 text-primary-foreground font-semibold"
                >
                  Criar Treino
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateWorkoutModal;