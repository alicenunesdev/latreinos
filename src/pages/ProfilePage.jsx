
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { User, Mail, Edit3, Save, LogOut, BarChartHorizontalBig } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ProfilePage = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSave = () => {
    if (!name || !email) {
      toast({
        title: "Erro",
        description: "Nome e email não podem estar vazios.",
        variant: "destructive",
      });
      return;
    }
    const updatedUser = { ...user, name, email, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf` };
    onUpdateUser(updatedUser);
    setIsEditing(false);
    toast({
      title: "Perfil Atualizado!",
      description: "Suas informações foram salvas.",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <Card className="glass-effect shadow-lg">
        <CardHeader className="items-center text-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl bg-primary/20 text-primary font-semibold">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <CardTitle className="text-2xl text-primary">{user.name}</CardTitle>
          <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="profile-name" className="text-foreground/80">Nome</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/80 placeholder:text-muted-foreground/70"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="profile-email" className="text-foreground/80">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/80 placeholder:text-muted-foreground/70"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full flex items-center gap-2">
                <Save className="w-4 h-4" /> Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="font-medium text-foreground/90">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground/90">{user.email}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="w-full flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Editar Perfil
              </Button>
            </>
          )}
          <Button variant="destructive" onClick={onLogout} className="w-full flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-effect shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <BarChartHorizontalBig className="w-5 h-5" />
            Estatísticas
          </CardTitle>
          <CardDescription className="text-muted-foreground">Acompanhe seu progresso e conquistas.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Em breve: gráficos de evolução, treinos mais frequentes e mais!</p>
          <img  class="w-full max-w-xs mx-auto mt-4 opacity-70" alt="Ilustração de gráfico de estatísticas em tons pastel" src="https://images.unsplash.com/photo-1586448354773-30706da80a04" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;