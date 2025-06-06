import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Play, Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import CreateWorkoutModal from '@/components/CreateWorkoutModal';

const Dashboard = ({ user, workouts, onAddWorkout, onStartWorkout }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = {
    totalWorkouts: workouts.length,
    thisWeek: workouts.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(w.createdAt) > weekAgo;
    }).length,
    totalExercises: workouts.reduce((acc, w) => acc + w.exercises.length, 0),
    avgDuration: workouts.length > 0 ? Math.round(workouts.reduce((acc, w) => acc + (w.estimatedDuration || 45), 0) / workouts.length) : 0,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Olá, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Pronto para mais um treino incrível?
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-effect p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total de Treinos</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalWorkouts}</p>
            </div>
            <div className="gradient-bg p-3 rounded-lg">
              <Target className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Esta Semana</p>
              <p className="text-3xl font-bold text-foreground">{stats.thisWeek}</p>
            </div>
            <div className="gradient-bg p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Exercícios</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalExercises}</p>
            </div>
            <div className="gradient-bg p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </Card>

        <Card className="glass-effect p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Duração Média</p>
              <p className="text-3xl font-bold text-foreground">{stats.avgDuration}min</p>
            </div>
            <div className="gradient-bg p-3 rounded-lg">
              <Clock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gradient-bg hover:opacity-90 text-primary-foreground font-semibold py-3 px-6 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Criar Novo Treino</span>
          </Button>
        </div>
      </motion.div>

      {/* Workouts List */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-6">Seus Treinos</h2>
        
        {workouts.length === 0 ? (
          <Card className="glass-effect p-12 text-center">
            <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum treino criado ainda
            </h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro treino para começar sua jornada fitness!
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="gradient-bg hover:opacity-90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Treino
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <motion.div
                key={workout.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="glass-effect p-6 hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {workout.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {workout.exercises.length} exercícios
                      </p>
                    </div>
                    <div className="gradient-bg p-2 rounded-lg">
                      <Target className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>~{workout.estimatedDuration || 45} minutos</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {workout.exercises.slice(0, 3).map((exercise, idx) => (
                      <div key={idx} className="text-foreground/80 text-sm">
                        • {exercise.name} - {exercise.sets} séries
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-muted-foreground text-sm">
                        +{workout.exercises.length - 3} exercícios
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => onStartWorkout(workout)}
                    className="w-full gradient-bg hover:opacity-90 text-primary-foreground font-semibold"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Treino
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Workout Modal */}
      <CreateWorkoutModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateWorkout={onAddWorkout}
      />
    </motion.div>
  );
};

export default Dashboard;