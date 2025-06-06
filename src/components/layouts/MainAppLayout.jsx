import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dumbbell, LogOut } from 'lucide-react';

const MainAppLayout = ({ children, user, onLogout, appName }) => {
  return (
    <div className="min-h-screen gradient-bg text-foreground">
      <header className="py-3 px-4 md:px-6 glass-effect sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            <Dumbbell className="w-6 h-6" />
            <span>{appName}</span>
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Avatar className="w-9 h-9 md:w-10 md:h-10 cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                     {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 px-2 md:px-3">
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default MainAppLayout;