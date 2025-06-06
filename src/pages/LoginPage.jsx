
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Dumbbell } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const LoginPage = ({ onLogin, appName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!name || !email || !password) {
        toast({
          title: "Erro de Cadastro",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive",
        });
        return;
      }
      const newUser = { id: Date.now(), name, email, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf` };
      localStorage.setItem('la-treinos-user', JSON.stringify(newUser));
      onLogin(newUser);
      toast({
        title: "Cadastro Realizado!",
        description: `Bem-vindo(a), ${name}!`,
      });
    } else {
      if (!email || !password) {
        toast({
          title: "Erro de Login",
          description: "Por favor, preencha email e senha.",
          variant: "destructive",
        });
        return;
      }
      const storedUser = JSON.parse(localStorage.getItem('la-treinos-user'));
      if (storedUser && storedUser.email === email) { 
        onLogin(storedUser);
        toast({
          title: "Login Realizado!",
          description: `Bem-vindo(a) de volta, ${storedUser.name}!`,
        });
      } else {
        toast({
          title: "Falha no Login",
          description: "Email ou senha inválidos. Se não tem conta, registre-se.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md glass-effect shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4"
            >
              <Dumbbell className="w-12 h-12 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-primary">
              {isRegistering ? 'Criar Conta' : appName}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isRegistering ? 'Junte-se à nossa comunidade fitness!' : 'Acesse sua conta para continuar'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/80 placeholder:text-muted-foreground/70"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/80 placeholder:text-muted-foreground/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/80">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/80 placeholder:text-muted-foreground/70"
                />
              </div>
              <Button type="submit" className="w-full flex items-center gap-2">
                {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isRegistering ? 'Registrar' : 'Entrar'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-primary hover:text-primary/80"
              >
                {isRegistering
                  ? 'Já tem uma conta? Faça login'
                  : 'Não tem uma conta? Registre-se'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;