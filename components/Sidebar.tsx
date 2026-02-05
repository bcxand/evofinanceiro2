import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Wallet, Target, LogOut, ChevronRight, Users, Banknote } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { supabase } from '../lib/supabase';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { familyMembers } = useFinance();
  const location = useLocation();
  const [displayName, setDisplayName] = useState('Minha Conta');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        // Extract name from email (before @) and capitalize
        const namePart = data.user.email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        setDisplayName(formattedName);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    // 1. Sign out from Supabase
    await supabase.auth.signOut();
    
    // 2. Clear any local demo/member state
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('member_access_code');
    
    // 3. Force reload to return to Landing Page
    window.location.reload();
  };

  const menuItems = [
    { path: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { path: '/accounts', label: 'Contas & Cartões', icon: Wallet },
    { path: '/debts', label: 'Dívidas', icon: Banknote },
    { path: '/goals', label: 'Metas', icon: Target },
    { path: '/members', label: 'Membros', icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-emerald-200">
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <div>
            <span className="font-bold text-slate-800 text-lg tracking-tight block leading-none">FinancePro</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Premium</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} strokeWidth={2} className={`transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.label}
              </div>
              {isActive && <ChevronRight size={16} className="text-emerald-600" />}
            </Link>
          );
        })}
      </nav>

      {/* Family Summary / Footer */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membros</span>
            <span className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full shadow-sm">{familyMembers.length}</span>
        </div>
        <div className="flex -space-x-2 overflow-hidden mb-6 pl-1">
            {familyMembers.map((member) => (
                <div key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ backgroundColor: member.color }}>
                    {member.name.charAt(0)}
                </div>
            ))}
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                +
            </div>
        </div>

        <div className="flex items-center gap-3 px-1 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100 group">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                {displayName.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-xs text-emerald-600 font-medium truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Online
                </p>
            </div>
            <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                title="Sair"
            >
                <LogOut size={16} />
            </button>
        </div>
      </div>
    </aside>
  );
};