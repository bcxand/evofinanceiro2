import React from 'react';
import { Home, Plus, Wallet, PieChart, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  onOpenAdd: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenAdd }) => {
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: Home, label: 'Início' },
    { path: '/accounts', icon: Wallet, label: 'Contas' },
    { path: 'action', icon: Plus, label: '', isAction: true },
    { path: '/reports', icon: PieChart, label: 'Relatórios' },
    { path: '/goals', icon: Target, label: 'Metas' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0E0F11]/90 backdrop-blur-lg border-t border-white/5 pb-safe pt-2 px-6 z-40">
      <div className="flex justify-between items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || (tab.path === '/dashboard' && location.pathname === '/');

          if (tab.isAction) {
            return (
              <button
                key="add-action"
                onClick={onOpenAdd}
                className="relative -top-6 bg-[#1DB954] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(29,185,84,0.4)] hover:scale-105 transition-transform"
              >
                <Plus size={28} strokeWidth={3} />
              </button>
            );
          }

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                isActive ? 'text-[#EDEDED]' : 'text-[#9A9A9A]'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};