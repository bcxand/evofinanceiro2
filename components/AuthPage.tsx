import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { AnimatedGridPattern } from "./ui/AnimatedGridPattern";
import { cn } from "../lib/utils";

// Custom Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  children?: React.ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button";
}

const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  type = "button",
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantStyles = {
    default: "bg-primary bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700",
    outline: "border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground"
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  id?: string;
}

const Input = ({ className = "", id, ...props }: InputProps) => {
  return (
    <input
      id={id}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

export const AuthPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'SIGNUP') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;
        
        if (data.session) {
            navigate('/dashboard');
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!signInError) {
                navigate('/dashboard');
            } else {
                throw new Error("Erro na confirmação automática. Verifique seu email.");
            }
        }

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
         <AnimatedGridPattern 
            className="text-emerald-100/50 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]" 
            width={40} 
            height={40} 
            numSquares={30}
         />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors z-20 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-sm">Voltar</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl overflow-hidden rounded-3xl flex bg-white shadow-2xl h-[650px] z-10 border border-slate-100"
      >
        {/* Left side - Visuals */}
        <div className="hidden md:flex w-1/2 h-full relative overflow-hidden bg-slate-900 flex-col items-center justify-center text-white p-12">
           {/* Abstract Background */}
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 to-slate-950 z-0" />
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

           <div className="relative z-10 text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30"
              >
                 <span className="text-4xl font-bold text-white">F</span>
              </motion.div>
              
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-4 tracking-tight"
              >
                FinancePro
              </motion.h2>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-300 text-lg leading-relaxed max-w-sm mx-auto mb-8"
              >
                Assuma o controle total das suas finanças familiares com inteligência e simplicidade.
              </motion.p>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-4 text-sm font-medium text-slate-400"
              >
                  <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Seguro</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>Criptografado</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>Privado</span>
              </motion.div>
           </div>
        </div>
        
        {/* Right side - Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm mx-auto"
          >
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">
                    {mode === 'LOGIN' ? 'Bem-vindo de volta' : 'Criar Conta'}
                </h1>
                <p className="text-slate-500">
                    {mode === 'LOGIN' ? 'Acesse seu painel financeiro.' : 'Comece a organizar sua vida hoje.'}
                </p>
            </div>
            
            <form className="space-y-5" onSubmit={handleAuth}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-slate-50 focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium text-center flex items-center justify-center gap-2"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                </motion.div>
              )}
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/20",
                    isHovered ? "shadow-xl shadow-emerald-600/30" : ""
                  )}
                >
                  <span className="flex items-center justify-center font-bold">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            {mode === 'LOGIN' ? 'Entrar' : 'Criar Conta'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                  </span>
                </Button>
              </motion.div>
              
              <div className="text-center mt-8 pt-4 border-t border-slate-100">
                <p className="text-slate-500 text-sm">
                    {mode === 'LOGIN' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button 
                        type="button"
                        onClick={() => {
                            setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                            setError(null);
                        }} 
                        className="ml-2 text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
                    >
                        {mode === 'LOGIN' ? 'Começar agora' : 'Fazer Login'}
                    </button>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};