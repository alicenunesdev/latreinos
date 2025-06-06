import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  Award,
  Edit3,
  Save,
  X
} from 'lucide-react';

const ProfilePage = ({ user, workouts, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
  });

  const stats = {
    totalWorkouts: workouts.length,
    totalExercises: workouts.reduce((acc, w) => acc + w.exercises.length, 0),
    avgDuration: workouts.length > 0 ? Math.round(workouts.reduce((acc, w) => acc + (w.estimatedDuration || 45), 0) / workouts.length) : 0,
    joinDate: new Date(user.createdAt).toLocaleDateString('pt-BR'),
    thisMonth: workouts.filter(w => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(w.createdAt) > monthAgo;
    }).length,
  };

  const handleSave = () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios!",
        variant: "destructive",
        className: 'bg-destructive text-destructive-foreground',
      });
      return;
    }

    onUpdateUser({
      ...user,
      name: editData.name,
      email: editData.email,
    });

    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
      className: 'bg-primary text-primary-foreground',
    });
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
      {/* Profile Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="glass-effect p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <Avatar className="w-32 h-32 gradient-bg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">
                  {getInitials(user.name)}
                </span>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 gradient-bg p-2 rounded-full shadow-md">
                <Award className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Nome</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleSave}
                      className="gradient-bg hover:opacity-90 text-primary-foreground"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-border text-foreground hover:bg-muted"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                  <div className="space-y-2 text-muted-foreground mb-6">
                    <div className="flex items-center justify-center md:justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Membro desde {stats.joinDate}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-effect p-6 text-center">
          <div className="gradient-bg w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.totalWorkouts}</h3>
          <p className="text-muted-foreground">Treinos Criados</p>
        </Card>

        <Card className="glass-effect p-6 text-center">
          <div className="gradient-bg w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.totalExercises}</h3>
          <p className="text-muted-foreground">Total de Exercícios</p>
        </Card>

        <Card className="glass-effect p-6 text-center">
          <div className="gradient-bg w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.avgDuration}min</h3>
          <p className="text-muted-foreground">Duração Média</p>
        </Card>

        <Card className="glass-effect p-6 text-center">
          <div className="gradient-bg w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.thisMonth}</h3>
          <p className="text-muted-foreground">Este Mês</p>
        </Card>
      </motion.div>

      {/* Recent Workouts */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-6">Treinos Recentes</h2>
        
        {workouts.length === 0 ? (
          <Card className="glass-effect p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum treino criado ainda
            </h3>
            <p className="text-muted-foreground">
              Crie seu primeiro treino para começar a acompanhar seu progresso!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {workouts.slice(0, 5).map((workout) => (
              <motion.div
                key={workout.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="glass-effect p-6 hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {workout.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                        <span>{workout.exercises.length} exercícios</span>
                        <span>~{workout.estimatedDuration || 45} min</span>
                        <span>{new Date(workout.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="gradient-bg p-3 rounded-lg">
                      <Target className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;