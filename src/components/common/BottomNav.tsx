import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Calendar, Clock, BookOpen, UserCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentView, navigateTo } = useApp();

  const navItems = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: Calendar,
    },
    {
      id: 'rundown',
      label: 'Rundown',
      icon: Clock,
    },
    {
      id: 'doa',
      label: 'Doa',
      icon: BookOpen,
    },
    {
      id: 'informasi-peserta',
      label: 'Info Peserta',
      icon: UserCheck,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Seluler"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] no-print pb-[env(safe-area-inset-bottom)] w-full max-w-full"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'agenda' && currentView === 'agenda-detail') ||
            (item.id === 'informasi-peserta' && currentView === 'panitia');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center h-full py-1 transition-colors relative cursor-pointer select-none ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-emerald-800 rounded-b-full shadow-xs" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-800' : 'text-stone-400'}`} />
              <span className="text-[10px] tracking-tight mt-1 leading-none truncate max-w-full px-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
