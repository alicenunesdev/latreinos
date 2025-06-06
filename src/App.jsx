import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import WorkoutPage from '@/components/WorkoutPage';
import ProfilePage from '@/components/ProfilePage';
import { User, Dumbbell, Home, Settings } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fitliceUser');
    const savedWorkouts = localStorage.getItem('fitliceWorkouts');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('fitliceUser', JSON.stringify(userData));
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo de volta, ${userData.name}!`,
      className: 'bg-primary text-primary-foreground',
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setActiveWorkout(null);
    localStorage.removeItem('fitliceUser');
    toast({
      title: "Logout realizado",
      description: "Até a próxima!",
      className: 'bg-secondary text-secondary-foreground',
    });
  };

  const saveWorkouts = (newWorkouts) => {
    setWorkouts(newWorkouts);
    localStorage.setItem('fitliceWorkouts', JSON.stringify(newWorkouts));
  };

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    const updatedWorkouts = [...workouts, newWorkout];
    saveWorkouts(updatedWorkouts);
    toast({
      title: "Treino criado!",
      description: `${workout.name} foi adicionado aos seus treinos.`,
      className: 'bg-primary text-primary-foreground',
    });
  };

  const startWorkout = (workout) => {
    setActiveWorkout({
      ...workout,
      startTime: Date.now(),
      currentExercise: 0,
      currentSet: 0,
      completedSets: [],
    });
    setCurrentPage('workout');
  };

  const getUserWorkouts = () => {
    return workouts.filter(workout => workout.userId === currentUser?.id);
  };

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentPage === 'workout' && activeWorkout ? (
          <WorkoutPage
            key="workout"
            workout={activeWorkout}
            onComplete={() => {
              setActiveWorkout(null);
              setCurrentPage('dashboard');
              toast({
                title: "Treino concluído!",
                description: "Parabéns pelo treino completo!",
                className: 'bg-primary text-primary-foreground',
              });
            }}
            onExit={() => {
              setActiveWorkout(null);
              setCurrentPage('dashboard');
            }}
          />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="glass-effect border-b sticky top-0 z-50">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="gradient-bg p-2 rounded-lg">
                      <Dumbbell className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">Fitlice</h1>
                  </div>
                  
                  <nav className="flex items-center space-x-2 sm:space-x-4">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setCurrentPage(item.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                            currentPage === item.id
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{item.label}</span>
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/80 px-3 py-2 rounded-lg transition-all"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
              <AnimatePresence mode="wait">
                {currentPage === 'dashboard' && (
                  <Dashboard
                    key="dashboard"
                    user={currentUser}
                    workouts={getUserWorkouts()}
                    onAddWorkout={addWorkout}
                    onStartWorkout={startWorkout}
                  />
                )}
                {currentPage === 'profile' && (
                  <ProfilePage
                    key="profile"
                    user={currentUser}
                    workouts={getUserWorkouts()}
                    onUpdateUser={(updatedUser) => {
                      setCurrentUser(updatedUser);
                      localStorage.setItem('fitliceUser', JSON.stringify(updatedUser));
                    }}
                  />
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;