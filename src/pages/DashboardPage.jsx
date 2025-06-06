import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Plus, Play, Edit, Trash2, CalendarDays, TrendingUp, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, title, value, colorClass, description }) => {
  const IconComponent = icon;
  return (
    <Card className={`glass-effect hover:shadow-${colorClass}/30 shadow-md transition-all duration-300 hover:border-${colorClass}/50 border-transparent`}>
      <CardContent className="p-4 md:p-6 text-center">
        <IconComponent className={`w-7 h-7 md:w-8 md:h-8 mx-auto mb-2 text-${colorClass}`} />
        <div className={`text-xl md:text-2xl font-bold text-${colorClass}`}>{value}</div>
        <div className="text-xs md:text-sm text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
};

const WorkoutItemCard = ({ workout, index, onStart, onEdit, onDelete }) => (
  <motion.div
    key={workout.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
  >
    <Card className="workout-card hover:shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5">
        <CardTitle className="text-accent text-lg md:text-xl truncate">{workout.name}</CardTitle>
        <p className="text-xs md:text-sm text-muted-foreground">
          {workout.exercises.length} {workout.exercises.length === 1 ? 'exercício' : 'exercícios'}
        </p>
      </CardHeader>
      <CardContent className="px-4 md:px-5 pb-4">
        <div className="space-y-1 mb-3 min-h-[40px] md:min-h-[50px]">
          {workout.exercises.slice(0, 2).map((exercise) => (
            <div key={exercise.id} className="text-xs md:text-sm text-muted-foreground truncate">
              • {exercise.name} ({exercise.sets}×{exercise.reps})
            </div>
          ))}
          {workout.exercises.length > 2 && (
            <div className="text-xs md:text-sm text-muted-foreground">
              +{workout.exercises.length - 2} mais...
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onStart(workout)}
            size="sm"
            className="flex-1 flex items-center gap-1.5 text-xs md:text-sm"
          >
            <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Iniciar
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(workout)}
            className="h-8 w-8 md:h-9 md:w-9 hover:bg-accent/10 hover:border-accent text-accent"
          >
            <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDelete(workout.id)}
            className="h-8 w-8 md:h-9 md:w-9 text-destructive hover:text-destructive/80 hover:bg-destructive/10 hover:border-destructive"
          >
            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardView = ({ user, workouts, workoutHistory, setCurrentView, startWorkout, editWorkout, deleteWorkout }) => (
  <div className="space-y-6 md:space-y-8">
    <div className="text-center space-y-2 md:space-y-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="floating-animation inline-block"
      >
        <img  className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full shadow-lg border-2 border-primary bg-primary/10" alt="Ilustração de haltere em tom pastel" src="https://images.unsplash.com/photo-1670600590516-27cf7a5069ac" />
      </motion.div>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          Olá, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">Pronto para o próximo desafio?</p>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <StatCard icon={Dumbbell} value={workouts.length} colorClass="accent" description="Treinos Criados" />
      <StatCard icon={CalendarDays} value={workoutHistory.length} colorClass="primary" description="Sessões Completas" />
      <StatCard icon={TrendingUp} value={workoutHistory.length > 0 ? Math.max(1, Math.round(workoutHistory.length / (workouts.length || 1) * 10)/10) : 0} colorClass="secondary" description="Média Sessões/Treino" />
    </div>

    <div className="flex justify-between items-center">
      <span className="text-lg md:text-xl font-semibold text-foreground/90">Meus Treinos</span>
      <Button 
        onClick={() => setCurrentView('create')}
        className="flex items-center gap-1.5 md:gap-2 pulse-animation text-xs md:text-sm px-3 py-1.5 h-auto md:px-4 md:py-2"
        size="sm"
      >
        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
        Novo Treino
      </Button>
    </div>

    {workouts.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {workouts.map((workout, index) => (
          <WorkoutItemCard 
            key={workout.id}
            workout={workout} 
            index={index} 
            onStart={startWorkout} 
            onEdit={editWorkout} 
            onDelete={deleteWorkout} 
          />
        ))}
      </div>
    ) : (
      <Card className="glass-effect">
        <CardContent className="p-8 md:p-12 text-center">
          <Dumbbell className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-muted-foreground" />
          <span className="text-md md:text-xl font-semibold mb-2 block text-foreground/80">Nenhum treino criado ainda</span>
          <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
            Comece criando seu primeiro treino personalizado!
          </p>
          <Button onClick={() => setCurrentView('create')}>
            Criar Primeiro Treino
          </Button>
        </CardContent>
      </Card>
    )}
  </div>
);

const HistoryView = ({ workoutHistory }) => (
  <div className="space-y-6 md:space-y-8">
    <span className="text-xl md:text-2xl font-bold text-primary">Histórico de Treinos</span>
    
    {workoutHistory.length === 0 ? (
      <Card className="glass-effect">
        <CardContent className="p-8 md:p-12 text-center">
          <CalendarDays className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-muted-foreground" />
          <span className="text-md md:text-xl font-semibold mb-2 block text-foreground/80">Nenhum treino realizado ainda</span>
          <p className="text-muted-foreground text-sm md:text-base">
            Complete seu primeiro treino para ver o histórico aqui!
          </p>
        </CardContent>
      </Card>
    ) : (
      <div className="space-y-3 md:space-y-4">
        {workoutHistory.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Card className="glass-effect hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-primary text-sm md:text-base">{entry.workoutName}</span>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('pt-BR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs md:text-sm text-accent font-semibold">✅ Concluído</div>
                    <p className="text-xs text-muted-foreground">{entry.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);


const DashboardPage = (props) => {
  return (
    <Tabs defaultValue="workouts" className="space-y-4 md:space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-muted/50">
        <TabsTrigger value="workouts" className="flex items-center gap-1.5 md:gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md"><Home className="w-4 h-4" />Treinos</TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1.5 md:gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md"><CalendarDays className="w-4 h-4" />Histórico</TabsTrigger>
        <TabsTrigger value="profile" asChild className="data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md">
          <Link to="/profile" className="flex items-center justify-center gap-1.5 md:gap-2 w-full h-full">
            <User className="w-4 h-4" />Perfil
          </Link>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="workouts">
        <DashboardView {...props} />
      </TabsContent>
      
      <TabsContent value="history">
        <HistoryView workoutHistory={props.workoutHistory} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardPage;