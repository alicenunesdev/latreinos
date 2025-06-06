
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkoutForm = ({ onSave, editWorkout = null, onCancel }) => {
  const [workoutName, setWorkoutName] = useState(editWorkout?.name || '');
  const [exercises, setExercises] = useState(editWorkout?.exercises || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    restTime: 60
  });

  const addExercise = () => {
    if (newExercise.name && newExercise.sets && newExercise.reps) {
      setExercises([...exercises, { ...newExercise, id: Date.now() }]);
      setNewExercise({ name: '', sets: '', reps: '', weight: '', restTime: 60 });
      setIsDialogOpen(false);
    }
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = () => {
    if (workoutName && exercises.length > 0) {
      const workout = {
        id: editWorkout?.id || Date.now(),
        name: workoutName,
        exercises,
        createdAt: editWorkout?.createdAt || new Date().toISOString()
      };
      onSave(workout);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="glass-effect shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">
            {editWorkout ? 'Editar Treino' : 'Novo Treino'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="workout-name" className="text-foreground/80">Nome do Treino</Label>
            <Input
              id="workout-name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Ex: Treino de Peito"
              className="mt-1 bg-background/80 placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="flex justify-between items-center">
            <Label className="text-foreground/80">Exercícios ({exercises.length})</Label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Exercício
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">Novo Exercício</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="exercise-name-modal" className="text-foreground/80">Nome do Exercício</Label>
                    <Input
                      id="exercise-name-modal"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                      placeholder="Ex: Supino Reto"
                      className="bg-background/80 placeholder:text-muted-foreground/70"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sets-modal" className="text-foreground/80">Séries</Label>
                      <Input
                        id="sets-modal"
                        type="number"
                        value={newExercise.sets}
                        onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                        placeholder="3"
                        className="bg-background/80 placeholder:text-muted-foreground/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reps-modal" className="text-foreground/80">Repetições</Label>
                      <Input
                        id="reps-modal"
                        value={newExercise.reps}
                        onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                        placeholder="12"
                        className="bg-background/80 placeholder:text-muted-foreground/70"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight-modal" className="text-foreground/80">Carga (kg)</Label>
                      <Input
                        id="weight-modal"
                        type="number"
                        value={newExercise.weight}
                        onChange={(e) => setNewExercise({...newExercise, weight: e.target.value})}
                        placeholder="80"
                        className="bg-background/80 placeholder:text-muted-foreground/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rest-time-modal" className="text-foreground/80">Descanso (seg)</Label>
                      <Input
                        id="rest-time-modal"
                        type="number"
                        value={newExercise.restTime}
                        onChange={(e) => setNewExercise({...newExercise, restTime: parseInt(e.target.value)})}
                        placeholder="60"
                        className="bg-background/80 placeholder:text-muted-foreground/70"
                      />
                    </div>
                  </div>
                  <Button onClick={addExercise} className="w-full">
                    Adicionar Exercício
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto p-1">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="exercise-item p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-accent">{exercise.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {exercise.sets} séries × {exercise.reps} reps
                    {exercise.weight && ` • ${exercise.weight}kg`}
                    • {exercise.restTime}s descanso
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExercise(exercise.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
             {exercises.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum exercício adicionado ainda.</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={saveWorkout} className="flex-1">
              {editWorkout ? 'Salvar Alterações' : 'Criar Treino'}
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutForm;