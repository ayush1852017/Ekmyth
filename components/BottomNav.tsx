import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Compass, PlusCircle, Bookmark, User } from 'lucide-react';

interface BottomNavProps {
  active: string;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'submit', icon: PlusCircle, label: 'Submit' },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 h-16 rounded-none ${
              active === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
