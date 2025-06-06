
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import MainAppLayout from '@/components/layouts/MainAppLayout';
import DashboardPage from '@/pages/DashboardPage';
import WorkoutFormPage from '@/pages/WorkoutFormPage';
import WorkoutSessionPage from '@/pages/WorkoutSessionPage';

function App() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('la-treinos-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const savedWorkouts = localStorage.getItem(`la-treinos-workouts-${user.id}`);
      const savedHistory = localStorage.getItem(`la-treinos-history-${user.id}`);
      
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      else setWorkouts([]);

      if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
      else setWorkoutHistory([]);
      
      if (currentView !== 'session' && currentView !== 'create') {
        setCurrentView('dashboard'); 
      }
    } else {
      setWorkouts([]);
      setWorkoutHistory([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`la-treinos-workouts-${user.id}`, JSON.stringify(workouts));
    }
  }, [workouts, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`la-treinos-history-${user.id}`, JSON.stringify(workoutHistory));
    }
  }, [workoutHistory, user]);

  const handleLogin = (loggedInUser) => {
    localStorage.setItem('la-treinos-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setCurrentView('dashboard'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('la-treinos-user');
    setUser(null);
    setCurrentView('dashboard');
    toast({
      title: "Logout Realizado",
      description: "Você saiu da sua conta.",
    });
  };
  
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('la-treinos-user', JSON.stringify(updatedUser));
  };

  const saveWorkout = (workout) => {
    if (editingWorkout) {
      setWorkouts(workouts.map(w => w.id === workout.id ? workout : w));
      toast({ title: "Treino Atualizado!", description: "Suas alterações foram salvas." });
    } else {
      setWorkouts([...workouts, workout]);
      toast({ title: "Treino Criado!", description: "Novo treino adicionado." });
    }
    setCurrentView('dashboard');
    setEditingWorkout(null);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    toast({ title: "Treino Removido", description: "O treino foi excluído." });
  };

  const startWorkout = (workout) => {
    setSelectedWorkout(workout);
    setCurrentView('session');
  };

  const completeWorkout = (sessionData) => {
    const historyEntry = {
      id: Date.now(),
      workoutId: selectedWorkout.id,
      workoutName: selectedWorkout.name,
      date: new Date().toISOString(),
      sessionData,
      duration: '45 min' 
    };
    setWorkoutHistory([historyEntry, ...workoutHistory]);
    setCurrentView('dashboard');
    setSelectedWorkout(null);
  };

  const editWorkout = (workout) => {
    setEditingWorkout(workout);
    setCurrentView('create');
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const AppContentRoutes = () => {
    if (currentView === 'create') {
      return <WorkoutFormPage 
                onSave={saveWorkout}
                editWorkout={editingWorkout}
                onCancel={() => {
                  setCurrentView('dashboard');
                  setEditingWorkout(null);
                }}
              />;
    }
    if (currentView === 'session' && selectedWorkout) {
      return <WorkoutSessionPage 
                workout={selectedWorkout}
                onBack={() => {
                  setCurrentView('dashboard');
                  setSelectedWorkout(null);
                }}
                onComplete={completeWorkout}
              />;
    }
    return <DashboardPage 
            user={user} 
            workouts={workouts} 
            workoutHistory={workoutHistory}
            setCurrentView={setCurrentView}
            startWorkout={startWorkout}
            editWorkout={editWorkout}
            deleteWorkout={deleteWorkout}
           />;
  };

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} appName="LA Treinos" />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainAppLayout user={user} onLogout={handleLogout} appName="LA Treinos">
                <AppContentRoutes />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <MainAppLayout user={user} onLogout={handleLogout} appName="LA Treinos">
                <ProfilePage user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;