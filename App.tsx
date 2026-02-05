import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { Navigation } from './components/Navigation';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Goals } from './components/Goals';
import { Debts } from './components/Debts';
import { Members } from './components/Members';
import { Accounts } from './components/Accounts';
import { Reports } from './components/Reports';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { supabase } from './lib/supabase';

// The Main App Logic (Authenticated)
const AuthenticatedApp = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans flex flex-col md:flex-row animate-fade-in">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-7xl mx-auto pb-24 md:pb-20">
            <Routes>
                <Route path="/dashboard" element={<Dashboard onAddTransaction={() => setShowAddModal(true)} />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/members" element={<Members />} />
                <Route path="/reports" element={<Reports />} />
                {/* Fallback for authenticated users inside the app */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <div className="md:hidden">
        <Navigation 
            onOpenAdd={() => setShowAddModal(true)} 
        />
      </div>

      {/* Floating Action Button for Modal (Desktop Only) */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="hidden md:flex fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-300 hover:scale-110 transition-transform z-40 group items-center gap-2"
        title="Novo Lançamento"
      >
        <span className="hidden group-hover:block font-bold pr-2 animate-fade-in">Novo Lançamento</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>

      {showAddModal && (
        <AddTransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

// Root Component with Routing Logic
export default function App() {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  // Removed blocking loading state to allow instant access

  useEffect(() => {
    let mounted = true;

    // Check active supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
      }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      {/* 
        PREVIEW MODE: Always show Landing Page at root '/' 
        If logged in, we pass isLoggedIn prop so Landing Page can show "Go to Dashboard" button 
      */}
      <Route path="/" element={<LandingPage isLoggedIn={!!session} />} />

      {session ? (
        // Authenticated Routes (Dashboard and internal pages)
        // Note: Using /* to match /dashboard, /accounts etc.
        <Route path="/*" element={
          <FinanceProvider>
            <AuthenticatedApp />
          </FinanceProvider>
        } />
      ) : (
        // Public Routes (Login/Signup specific pages)
        <>
           <Route path="/login" element={<AuthPage />} />
           {/* Catch all redirects to root Landing Page */}
           <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}