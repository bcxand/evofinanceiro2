import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ShieldCheck, Zap, Users, Target, 
  CheckCircle2, CreditCard, Sparkles, TrendingUp, 
  LayoutDashboard, Banknote, ChevronDown, Lock, Menu, X, Star,
  PieChart, Clock, EyeOff, Fingerprint, Activity, AlertCircle,
  Wallet, Home, ShoppingCart, Filter, ArrowUpRight, Check, X as XIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedGridPattern } from './ui/AnimatedGridPattern';
import { cn } from '../lib/utils';

// --- UTILS & UI COMPONENTS FOR HERO ---

const HeroCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-2xl", className)} {...props} />
));
HeroCard.displayName = "HeroCard";

const HeroCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
HeroCardHeader.displayName = "HeroCardHeader";

const HeroCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
HeroCardContent.displayName = "HeroCardContent";

// --- MOCKUP INTERNALS (OPTIMIZED FOR MOBILE) ---

const DashboardMockupContent = () => (
  <div className="flex flex-col h-full bg-[#F9FAFB] font-sans">
    {/* APP HEADER SIMULATION */}
    <div className="flex justify-between items-center p-4 md:p-8 pb-2 md:pb-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-emerald-900 tracking-tight">Visão Geral</h1>
          <p className="text-emerald-600/70 font-medium text-xs md:text-sm">Bem-vindo ao seu painel financeiro.</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex bg-white border border-slate-200 rounded-lg items-center px-4 py-2 gap-2 shadow-sm">
                <Users size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-600">Família Silva (4)</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs border border-emerald-200 shadow-sm">
                R
            </div>
        </div>
    </div>

    {/* DASHBOARD CONTENT */}
    <div className="p-3 md:p-8 space-y-4 md:space-y-6 overflow-hidden">
        
        {/* KPI ROW - Optimized Grid for Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-sm">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1 truncate">Saldo Atual</p>
                        <h3 className="text-lg md:text-xl font-bold text-emerald-900 truncate">R$ 14.250,00</h3>
                    </div>
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 ml-2"><Wallet size={16} /></div>
                </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1 truncate">Entradas</p>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 truncate">R$ 8.500,00</h3>
                    </div>
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 ml-2"><TrendingUp size={16} /></div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 mt-1"><div className="bg-blue-500 h-full rounded-full w-full"></div></div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1 truncate">Saídas Fixas</p>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 truncate">R$ 3.240,00</h3>
                    </div>
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0 ml-2"><Home size={16} /></div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 mt-1"><div className="bg-purple-500 h-full rounded-full w-[40%]"></div></div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1 truncate">Variável</p>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 truncate">R$ 1.200,00</h3>
                    </div>
                    <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg shrink-0 ml-2"><ShoppingCart size={16} /></div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 mt-1"><div className="bg-orange-400 h-full rounded-full w-[20%]"></div></div>
            </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-5 flex flex-col h-[200px] md:h-[280px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500" /> Evolução Mensal
                    </h3>
                </div>
                {/* Fake Chart CSS */}
                <div className="flex-1 flex items-end gap-2 md:gap-3 px-1 md:px-2 border-b border-l border-slate-50 pb-2">
                    {[30, 45, 35, 60, 50, 75, 65, 80, 55, 70, 85, 60].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group cursor-pointer">
                            <div className="w-full bg-emerald-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all" style={{height: `${h}%`}}></div>
                            <div className="w-full bg-red-400 rounded-t-sm opacity-40 group-hover:opacity-60 transition-all" style={{height: `${h * 0.6}%`}}></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-[8px] md:text-[10px] text-slate-400">
                    <span>Jan</span><span>Mar</span><span>Mai</span><span>Jul</span><span>Set</span><span>Nov</span>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-5 flex flex-col h-[220px] md:h-[280px]">
                <h3 className="text-xs md:text-sm font-bold text-slate-800 mb-2 md:mb-4 flex items-center gap-2">
                    <PieChart size={14} className="text-emerald-500" /> Distribuição
                </h3>
                <div className="flex-1 flex items-center justify-center relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[10px] md:border-[12px] border-emerald-500 border-r-blue-500 border-b-orange-400 border-l-purple-500 rotate-45"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-base md:text-lg font-bold text-slate-900">100%</span>
                    </div>
                </div>
                <div className="mt-2 md:mt-4 grid grid-cols-2 gap-2 text-[9px] md:text-[10px] text-slate-500">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Moradia</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Alimentação</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Lazer</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Fixas</div>
                </div>
            </div>
        </div>

        {/* LIST ROW */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3 md:p-4 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xs md:text-sm font-bold text-slate-800">Últimos Lançamentos</h3>
                <Filter size={12} className="text-slate-400" />
            </div>
            <div className="flex flex-col">
                {[
                    { desc: "Supermercado Semanal", cat: "Alimentação", date: "Hoje", val: "- R$ 450,00", type: "exp", icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
                    { desc: "Pagamento Freela", cat: "Receita", date: "Ontem", val: "+ R$ 1.200,00", type: "inc", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
                    { desc: "Uber Corporativo", cat: "Transporte", date: "Ontem", val: "- R$ 32,90", type: "exp", icon: AlertCircle, color: "bg-orange-50 text-orange-600" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 md:p-4 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{item.desc}</p>
                                <p className="text-[10px] text-slate-400 truncate">{item.cat} • {item.date}</p>
                            </div>
                        </div>
                        <span className={`text-xs md:text-sm font-bold ml-2 ${item.type === 'inc' ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {item.val}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  </div>
);

const SmartInputMockup = () => (
    <div className="relative w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 transform rotate-1 hover:rotate-0 transition-all duration-500">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">IA Ativa</span>
            </div>
        </div>
        <div className="text-3xl font-bold text-slate-800 mb-8 font-mono border-r-4 border-blue-50 inline-block pr-2 animate-pulse leading-tight">
            120 mercado crédito
        </div>
        <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 flex items-center gap-2 shadow-sm"><CheckCircle2 size={14}/> R$ 120,00</span>
            <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100 flex items-center gap-2 shadow-sm"><CheckCircle2 size={14}/> Alimentação</span>
            <span className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-sm font-bold border border-purple-100 flex items-center gap-2 shadow-sm"><CheckCircle2 size={14}/> Cartão</span>
        </div>
    </div>
);

const DebtCardMockup = () => (
    <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative group hover:-translate-y-2 transition-all duration-300">
        <div className="flex items-start gap-5 mb-8">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:scale-110 transition-transform">
                <Banknote size={28} />
            </div>
            <div>
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Empréstimo Carro</h3>
                <p className="text-sm text-slate-500 font-medium">Santander</p>
            </div>
        </div>
        <div className="flex justify-between items-end mb-3">
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Restante</p>
                <p className="text-2xl font-bold text-slate-900">R$ 22.000</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Original</p>
                <p className="text-sm font-medium text-slate-500 line-through">R$ 45.000</p>
            </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full w-[48%] relative">
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/30"></div>
            </div>
        </div>
    </div>
);

const XRayMockup = () => (
    <div className="bg-[#0F172A] rounded-3xl p-8 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 border border-slate-800 w-full max-w-md mx-auto transform hover:scale-[1.02]">
        <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
            <div>
                <h4 className="text-white font-bold text-xl tracking-tight">Relatório Mensal</h4>
                <p className="text-slate-400 text-sm font-medium">Análise de Gastos</p>
            </div>
            <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10 uppercase tracking-widest">
                Premium
            </div>
        </div>
        
        <div className="flex items-center gap-8 mb-10">
            {/* Donut Chart Simulation */}
            <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                    <path className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" strokeDasharray="40, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
                    <path className="text-blue-500" strokeDasharray="30, 100" strokeDashoffset="-40" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round"/>
                    <path className="text-orange-400" strokeDasharray="20, 100" strokeDashoffset="-70" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-bold text-xl tracking-tight">R$ 5.2k</span>
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Total</span>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3 text-slate-300 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>Moradia</div>
                    <span className="text-white font-bold">40%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3 text-slate-300 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>Alimentação</div>
                    <span className="text-white font-bold">30%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3 text-slate-300 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>Lazer</div>
                    <span className="text-white font-bold">20%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3 text-slate-300 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>Outros</div>
                    <span className="text-white font-bold">10%</span>
                </div>
            </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 flex items-start gap-4">
             <div className="p-2 bg-amber-500/10 rounded-lg">
                 <AlertCircle size={20} className="text-amber-400" />
             </div>
             <div>
                 <p className="text-amber-400 text-sm font-bold mb-1">Alerta de Projeção</p>
                 <p className="text-slate-400 text-xs leading-relaxed">
                     Seus gastos com <span className="text-white font-bold">Uber</span> subiram 15% esta semana. Recomendamos revisar o orçamento de transporte.
                 </p>
             </div>
        </div>
    </div>
);

// --- MAIN LANDING PAGE ---

export const LandingPage: React.FC<{ isLoggedIn?: boolean }> = ({ isLoggedIn = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => {
        document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToPricing = () => {
      const element = document.getElementById('pricing');
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
  };

  const faqs = [
    { q: "O app é seguro?", a: "Sim. Seus dados são criptografados e armazenados com segurança de nível bancário. Nós não pedimos senhas do seu banco e não vendemos seus dados." },
    { q: "Posso usar com minha esposa/marido?", a: "Com certeza. O FinancePro foi desenhado para famílias. Você pode adicionar membros ilimitados e gerenciar o orçamento conjunto ou separado." },
    { q: "Preciso conectar minha conta bancária?", a: "Não. O FinancePro funciona com input manual inteligente ou importação. Acreditamos que o ato de registrar ajuda na consciência financeira." },
    { q: "Funciona offline?", a: "Sim, você pode registrar gastos sem internet e eles sincronizam automaticamente na nuvem quando a conexão voltar." },
    { q: "Consigo exportar meus dados?", a: "Sim, você pode exportar relatórios completos em PDF ou CSV a qualquer momento." },
  ];

  const testimonials = [
    { name: "Ana Clara e Pedro Santos", location: "São Paulo, SP", role: "Casal com 2 filhos", text: "Antes do FinancePro, a gente brigava todo mês quando a fatura chegava. O app nos deu a clareza de quem estava gastando o quê. Hoje planejamos nossa viagem de fim de ano sem medo." },
    { name: "Juliana Mendes", location: "Belo Horizonte, MG", role: "Designer autônoma", text: "Como autônoma, minha renda varia muito. A IA do FinancePro me ajuda a prever meu fluxo de caixa e a separar o dinheiro da PJ do meu dinheiro pessoal. Salvou minha organização." },
    { name: "Marcos Oliveira", location: "Curitiba, PR", role: "Engenheiro", text: "Sou chato com dados e planilhas, mas o FinancePro entrega tudo que eu preciso sem o trabalho manual. O Raio-X financeiro é imbatível para entender onde cortar gastos." },
    { name: "Camila Ferreira", location: "Recife, PE", role: "Professora, mãe de 3", text: "Com 3 filhos, o dinheiro parecia sumir. O FinancePro me mostrou que pequenos gastos diários estavam corroendo nosso orçamento. A funcionalidade de metas conjuntas é incrível!" },
    { name: "Rafael Costa", location: "Porto Alegre, RS", role: "Empreendedor", text: "Testei dezenas de apps. O FinancePro é o único que entende o contexto brasileiro de parcelamento de cartão e dívidas. Finalmente consegui organizar meus cartões." },
    { name: "Leticia Almeida", location: "Brasília, DF", role: "Advogada", text: "Não tenho tempo para ficar categorizando gastos. A entrada inteligente por voz é sensacional. Falo 'Uber 25 reais' e ele já sabe tudo. Praticidade total." },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      
      {/* HEADER (UPDATED WITH FLOATING ISLAND EFFECT) */}
      <header
        className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out mx-auto w-full',
            {
                'bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm md:top-4 md:max-w-5xl md:rounded-full': scrolled && !mobileMenuOpen,
                'bg-white/90': mobileMenuOpen
            }
        )}
      >
        <nav
            className={cn(
                'flex h-16 md:h-14 w-full items-center justify-between px-6 transition-all ease-out',
                { 'md:px-6': scrolled }
            )}
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform rotate-3">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className={cn("text-lg md:text-xl font-bold tracking-tight transition-colors", scrolled ? "text-slate-800" : "text-slate-900")}>
                FinancePro
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#problem" className="hover:text-emerald-600 transition-colors">O Problema</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Soluções</a>
            <a href="#family" className="hover:text-emerald-600 transition-colors">Família</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Planos</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn && (
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  Login
                </button>
            )}
            
            <button 
              onClick={isLoggedIn ? () => navigate('/dashboard') : scrollToPricing}
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-md"
            >
              {isLoggedIn ? 'Dashboard' : 'Começar Agora'}
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
            className={cn(
                'fixed top-[64px] left-0 right-0 bottom-0 z-40 bg-white border-t border-slate-100 md:hidden flex flex-col',
                mobileMenuOpen ? 'block animate-fade-in' : 'hidden'
            )}
        >
             <div className="flex flex-col gap-1 p-4">
                <a href="#problem" className="flex items-center p-4 text-slate-600 font-medium hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>O Problema</a>
                <a href="#features" className="flex items-center p-4 text-slate-600 font-medium hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Soluções</a>
                <a href="#family" className="flex items-center p-4 text-slate-600 font-medium hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Família</a>
                <a href="#pricing" className="flex items-center p-4 text-slate-600 font-medium hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Planos</a>
             </div>
             
             <div className="mt-auto p-4 border-t border-slate-100 space-y-3 mb-20">
                {isLoggedIn ? (
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                      <Users size={18} /> Acessar Dashboard
                    </button>
                ) : (
                    <>
                        <button 
                          onClick={() => navigate('/login')}
                          className="w-full border border-slate-200 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50"
                        >
                          Login
                        </button>
                        <button 
                          onClick={scrollToPricing}
                          className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800"
                        >
                          Começar Agora
                        </button>
                    </>
                )}
             </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <AnimatedGridPattern
            numSquares={50}
            maxOpacity={0.3}
            duration={2}
            repeatDelay={0.5}
            className={cn(
              "[mask-image:radial-gradient(1000px_circle_at_center_top,white,transparent)]",
              "inset-x-0 inset-y-[-10%] h-[150%] skew-y-12",
              "fill-emerald-500/10 stroke-emerald-500/10",
              "text-emerald-400"
            )}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tighter mb-8 leading-[1.05]">
            O Painel de Controle <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">da Sua Vida Financeira.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Abandone as planilhas feias e confusas. Tenha clareza total sobre receitas, despesas, dívidas e metas familiares em um único lugar bonito, inteligente e fácil de usar.
          </p>
          
          <div className="animate-fade-in flex flex-col items-center mb-16">
              <button 
                onClick={isLoggedIn ? () => navigate('/dashboard') : scrollToPricing}
                className="px-10 py-5 bg-emerald-600 text-white rounded-full font-bold text-xl hover:bg-emerald-700 hover:scale-105 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3"
              >
                {isLoggedIn ? 'Acessar Dashboard' : 'Quero organizar minha vida agora'}
                <ArrowRight size={24} />
              </button>
              
              <div className="mt-8 text-sm text-slate-500 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                <span className="flex items-center gap-2 font-medium"><CheckCircle2 size={16} className="text-emerald-500" /> Sem cartão necessário</span>
                <span className="flex items-center gap-2 font-medium"><CheckCircle2 size={16} className="text-emerald-500" /> Plano familiar incluso</span>
                <span className="flex items-center gap-2 font-medium"><CheckCircle2 size={16} className="text-emerald-500" /> Cancelamento fácil</span>
              </div>
          </div>

          <div className="w-full max-w-5xl mx-auto animate-fade-in transform hover:scale-[1.01] transition-transform duration-700" style={{animationDelay: '0.1s'}}>
              <HeroCard className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-slate-200/60 ring-1 ring-slate-200">
                  <HeroCardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex flex-row items-center justify-between space-y-0">
                     <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-400/80"/>
                       <div className="w-3 h-3 rounded-full bg-amber-400/80"/>
                       <div className="w-3 h-3 rounded-full bg-emerald-400/80"/>
                     </div>
                     <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-100/50 px-3 py-1 rounded-full border border-slate-200/50">
                        <Lock size={10} /> financepro.app
                     </div>
                  </HeroCardHeader>
                  <HeroCardContent className="p-0 min-h-[500px] md:min-h-[600px] bg-slate-50">
                      <DashboardMockupContent />
                  </HeroCardContent>
              </HeroCard>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM (REDESIGNED) */}
      <section id="problem" className="py-32 px-6 bg-slate-900 relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px] mix-blend-screen"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] mix-blend-screen"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
                  Por que é tão difícil juntar dinheiro e manter a organização financeira em família?
              </h2>
              <div className="h-1 w-24 bg-emerald-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                  A maioria das pessoas não falha por falta de renda, mas por falta de <span className="text-white font-semibold">clareza, controle e ferramentas adequadas.</span>
              </p>
          </div>
      </section>

      {/* 3. TRADITIONAL TOOLS FAIL (BENTO GRID) */}
      <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">As ferramentas tradicionais jogam contra você</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                          <EyeOff size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Cegueira Financeira</h3>
                      <p className="text-slate-500 leading-relaxed">Apps de banco mostram apenas o passado. Você só descobre que gastou demais quando a fatura já fechou.</p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group md:mt-8">
                      <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          <Clock size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Planilhas Manuais</h3>
                      <p className="text-slate-500 leading-relaxed">Exigem disciplina diária. Um dia sem atualizar e tudo desmorona. São feias, complexas e péssimas no celular.</p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          <Users size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Caos Familiar</h3>
                      <p className="text-slate-500 leading-relaxed">Contas misturadas, ninguém sabe quem gastou o quê. O dinheiro vira fonte de brigas em vez de sonhos em comum.</p>
                  </div>
              </div>
              
              <div className="mt-16 text-center">
                   <button onClick={isLoggedIn ? () => navigate('/dashboard') : scrollToPricing} className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors shadow-lg hover:shadow-xl">
                       {isLoggedIn ? 'Acessar meu Dashboard' : 'Quero resolver isso agora'}
                   </button>
              </div>
          </div>
      </section>

      {/* 4. SOLUTION: AI SMART INPUT (MODERNIZED) */}
      <section id="features" className="py-32 px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-emerald-50 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <SmartInputMockup />
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8 border border-blue-100">
              <Sparkles size={14} /> IA Financeira
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              Registre gastos na velocidade do pensamento.
            </h2>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Digite naturalmente ou fale: <span className="text-slate-800 font-medium italic">“Paguei R$ 87 na padaria no débito hoje”</span>. A IA entende e preenche tudo automaticamente.
            </p>
            
            <div className="space-y-8 relative">
               <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-slate-100"></div>
               
               <div className="flex gap-6 relative">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-900 font-bold shadow-sm z-10">1</div>
                   <div>
                       <h4 className="font-bold text-slate-900 text-lg mb-1">Reconhecimento Inteligente</h4>
                       <p className="text-slate-500 leading-relaxed">Detecta automaticamente: valor, categoria, banco e data.</p>
                   </div>
               </div>
               <div className="flex gap-6 relative">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-900 font-bold shadow-sm z-10">2</div>
                   <div>
                       <h4 className="font-bold text-slate-900 text-lg mb-1">Aprendizado Contínuo</h4>
                       <p className="text-slate-500 leading-relaxed">Se você sempre gasta em “padaria” no débito, o app aprende e preenche sozinho na próxima vez.</p>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (TIMELINE) */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-16 tracking-tight">Como funciona em 4 passos simples</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  {/* Connector Line (Desktop) */}
                  <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-slate-200 -z-10"></div>

                  {[
                      { step: "1", title: "Cadastre-se", desc: "Crie sua conta em 30 segundos, sem burocracia." },
                      { step: "2", title: "Registre", desc: "Lance seus gastos e receitas rapidamente usando a IA." },
                      { step: "3", title: "Visualize", desc: "Acesse relatórios e projeções automáticos instantaneamente." },
                      { step: "4", title: "Compartilhe", desc: "Convide a família e organize as finanças conjuntas." }
                  ].map((item, idx) => (
                      <div key={idx} className="relative flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-white rounded-2xl border-2 border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl shadow-sm mb-6 z-10">
                              {item.step}
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed px-4">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 6. FAMILY FINANCE (CARDS) */}
      <section id="family" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
           <div className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
              Plano Familiar
            </div>
           <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Finanças para casais e famílias modernas</h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Card 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center h-auto md:h-[320px] flex flex-col justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-purple-600 shadow-sm mx-auto"><Users size={32} /></div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Login individual</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Cada pessoa tem seu próprio acesso, garantindo privacidade e organização.</p>
            </div>

            {/* Main Card (Center) */}
            <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-emerald-100 text-center relative transform md:scale-110 z-10">
                <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] px-3 py-1 font-bold rounded-full shadow-lg shadow-emerald-500/30">PREMIUM</div>
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-8 text-emerald-600 mx-auto"><CreditCard size={40} /></div>
                <h3 className="font-bold text-2xl mb-4 text-slate-900">Cartões separados</h3>
                <p className="text-slate-500 leading-relaxed">Veja exatamente quanto cada membro está gastando para ajustar o orçamento.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center h-auto md:h-[320px] flex flex-col justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-sm mx-auto"><Target size={32} /></div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Metas conjuntas</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Acompanhem juntos o progresso da viagem, carro novo ou casa própria.</p>
            </div>
        </div>
      </section>

      {/* 7. X-RAY (ANALYTICS) - DARK MODE SECTION */}
      <section className="py-32 bg-[#0B1120] px-6 text-white overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
             <div className="order-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8 border border-emerald-500/20">
                    <Activity size={14} /> Raio-X Financeiro
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                    Pare de dirigir no escuro. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Você no controle, finalmente.</span>
                </h2>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
                    Descubra em segundos para onde seu dinheiro está indo com nossos relatórios inteligentes.
                </p>
                <div className="space-y-6">
                    {[
                        "Gastos por categoria (com percentuais claros)",
                        "Comparação mês a mês",
                        "Projeção de fluxo de caixa para os próximos meses",
                        "Alertas inteligentes (ex: “Uber subiu 15% esta semana”)"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <Check size={14} strokeWidth={3} />
                            </div>
                            <span className="text-slate-300 font-medium">{item}</span>
                        </div>
                    ))}
                </div>
             </div>
             <div className="order-2 relative flex justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-20"></div>
                  <XRayMockup />
             </div>
        </div>
      </section>

      {/* 8. DEBTS */}
      <section id="debts" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
                 <div className="absolute inset-0 bg-slate-100 rounded-full blur-3xl opacity-50 transform rotate-6"></div>
                 <div className="grid gap-6 relative z-10">
                     <DebtCardMockup />
                     <div className="opacity-60 scale-95 transform translate-y-[-20px] blur-[1px]">
                         <DebtCardMockup />
                     </div>
                 </div>
            </div>
            <div>
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-8 text-red-600">
                    <TrendingUp size={28} />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                    Organize suas dívidas e transforme ansiedade em estratégia.
                </h2>
                <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                    O plano de fuga das dívidas começa aqui.
                </p>
                
                <div className="grid grid-cols-1 gap-4 mb-10">
                    {[
                        "Cadastro de dívidas com juros e prazos",
                        "Visualização clara do valor restante",
                        "Calculadora de progresso de quitação",
                        "Alertas de vencimento para evitar juros",
                        "Centralização de cartões estourados"
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <button onClick={isLoggedIn ? () => navigate('/dashboard') : scrollToPricing} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                    {isLoggedIn ? 'Acessar Gestão de Dívidas' : 'Começar a pagar dívidas'}
                </button>
            </div>
        </div>
      </section>

      {/* 9. SECURITY (MINIMALIST) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 px-6">
          <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-slate-900 shadow-sm border border-slate-200"><Lock size={32} /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Segurança de nível bancário,<br/> sem burocracia.</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
                  <div className="p-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                      <Fingerprint className="text-emerald-600 mb-6" size={32} />
                      <h4 className="font-bold text-slate-900 mb-3 text-lg">Criptografia Ponta-a-Ponta</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Seus dados são protegidos com a mesma tecnologia dos grandes bancos.</p>
                  </div>
                  <div className="p-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                      <EyeOff className="text-emerald-600 mb-6" size={32} />
                      <h4 className="font-bold text-slate-900 mb-3 text-lg">Dados Mínimos</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Não pedimos CPF, endereço ou senha do banco. Apenas seu e-mail para login.</p>
                  </div>
                  <div className="p-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                      <ShieldCheck className="text-emerald-600 mb-6" size={32} />
                      <h4 className="font-bold text-slate-900 mb-3 text-lg">Backup Automático</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Seus dados salvos automaticamente na nuvem, acessíveis de qualquer dispositivo.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* 10. COMPARISON (VS STYLE) */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16 tracking-tight">Por que o FinancePro é diferente?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
             {/* The Old Way */}
             <div className="p-10 bg-slate-50 border border-slate-200 rounded-3xl opacity-70 hover:opacity-100 transition-opacity">
                <h3 className="text-slate-500 font-bold text-xl mb-8 flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg"><LayoutDashboard size={20}/></div>
                    Planilhas e Apps Comuns
                </h3>
                <ul className="space-y-6 text-slate-500 font-medium">
                   <li className="flex gap-4 items-center"><XIcon size={20} className="text-red-400 shrink-0" /> Difícil de usar no celular</li>
                   <li className="flex gap-4 items-center"><XIcon size={20} className="text-red-400 shrink-0" /> Configuração manual chata</li>
                   <li className="flex gap-4 items-center"><XIcon size={20} className="text-red-400 shrink-0" /> Design poluído e confuso</li>
                   <li className="flex gap-4 items-center"><XIcon size={20} className="text-red-400 shrink-0" /> Sem suporte familiar real</li>
                   <li className="flex gap-4 items-center"><XIcon size={20} className="text-red-400 shrink-0" /> Sem gestão inteligente de dívidas</li>
                </ul>
             </div>

             {/* The FinancePro Way */}
             <div className="p-10 bg-white border border-emerald-100 rounded-3xl relative shadow-2xl shadow-emerald-900/5 ring-1 ring-emerald-500/10">
                <div className="absolute -top-4 right-8 bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">PREMIUM</div>
                <h3 className="text-emerald-900 font-bold text-xl mb-8 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle2 size={20}/></div>
                    FinancePro
                </h3>
                <ul className="space-y-6 text-slate-700 font-bold">
                   <li className="flex gap-4 items-center"><Check size={20} className="text-emerald-500 shrink-0" /> Mobile-First perfeito</li>
                   <li className="flex gap-4 items-center"><Check size={20} className="text-emerald-500 shrink-0" /> IA faz o trabalho duro</li>
                   <li className="flex gap-4 items-center"><Check size={20} className="text-emerald-500 shrink-0" /> Multi-usuário familiar</li>
                   <li className="flex gap-4 items-center"><Check size={20} className="text-emerald-500 shrink-0" /> Controle visual de dívidas e metas</li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS (MASONRY) */}
      <section className="py-32 px-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-20 tracking-tight">O que nossos usuários estão dizendo!</h2>
              
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                  {testimonials.map((t, i) => (
                      <div key={i} className="break-inside-avoid p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex gap-1 text-amber-400 mb-6">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                          </div>
                          <p className="text-slate-600 mb-6 text-sm leading-relaxed font-medium">"{t.text}"</p>
                          <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                  {t.name.charAt(0)}
                              </div>
                              <div>
                                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                                  <p className="text-xs text-slate-400">{t.role} • {t.location}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-20 text-center">
                   <button onClick={isLoggedIn ? () => navigate('/dashboard') : scrollToPricing} className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-black transition-all shadow-xl hover:scale-105">
                       {isLoggedIn ? 'Acessar Dashboard' : 'Junte-se a eles'}
                   </button>
              </div>
          </div>
      </section>

      {/* 12. PRICING (REFINED) */}
      <section id="pricing" className="py-32 px-6 bg-white">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Invista na organização da sua família</h2>
                <p className="text-slate-500 text-lg">Escolha o período ideal. Acesso completo em todos os planos.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
               
               {/* PLANO MENSAL */}
               <div className="p-8 rounded-[2rem] border border-slate-200 bg-white flex flex-col h-auto order-2 md:order-1">
                  <div className="mb-6">
                     <h3 className="text-lg font-bold text-slate-500 mb-2">Mensal</h3>
                     <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold text-slate-900">R$ 29</span>
                        <span className="text-slate-400 mb-1 font-medium">/mês</span>
                     </div>
                     <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-100 inline-block px-2 py-1 rounded">Pagamento recorrente</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1 text-slate-600 text-sm font-medium">
                     <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Acesso Completo</li>
                     <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Membros Ilimitados</li>
                     <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> IA Financeira</li>
                  </ul>
                  <button 
                    onClick={isLoggedIn ? () => navigate('/dashboard') : () => navigate('/login')}
                    className="w-full py-4 rounded-xl border-2 border-slate-100 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    {isLoggedIn ? 'Acessar Plano Atual' : 'Assinar Mensal'}
                  </button>
                  <div className="mt-4 flex flex-col items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      <span>• Sem cartão necessário</span>
                      <span>• Cancelamento fácil</span>
                  </div>
               </div>

               {/* PLANO ANUAL (DESTAQUE) */}
               <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white relative flex flex-col shadow-2xl shadow-slate-900/20 order-1 md:order-2 z-10 transform scale-105">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg tracking-wider">MAIS VANTAJOSO</div>
                  <div className="mb-8 text-center border-b border-white/10 pb-8">
                     <h3 className="text-lg font-bold text-emerald-400 mb-2">Anual</h3>
                     <div className="flex items-end justify-center gap-1 mb-2">
                        <span className="text-6xl font-bold text-white">R$ 147</span>
                        <span className="text-slate-400 mb-2 font-medium">/ano</span>
                     </div>
                     <p className="text-sm font-bold text-white/90">Apenas R$ 12,25 / mês</p>
                     <p className="text-xs text-emerald-400 mt-1 font-bold">Economia de 58%</p>
                  </div>
                  <ul className="space-y-5 mb-10 flex-1 text-slate-300 font-medium">
                     <li className="flex gap-4 items-center"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={14} /></div> Tudo do plano mensal</li>
                     <li className="flex gap-4 items-center"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={14} /></div> Suporte Prioritário</li>
                     <li className="flex gap-4 items-center"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={14} /></div> Mentoria de Setup (Video)</li>
                     <li className="flex gap-4 items-center"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={14} /></div> Badge de Fundador</li>
                  </ul>
                  <button 
                    onClick={isLoggedIn ? () => navigate('/dashboard') : () => navigate('/login')}
                    className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 text-lg"
                  >
                    {isLoggedIn ? 'Acessar Plano Atual' : 'Assinar Anual'}
                  </button>
                  <div className="mt-6 flex flex-col items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                      <span>• Sem cartão necessário</span>
                      <span>• Plano familiar incluso</span>
                  </div>
               </div>

               {/* PLANO SEMESTRAL */}
               <div className="p-8 rounded-[2rem] border border-slate-200 bg-white flex flex-col h-auto order-3">
                  <div className="mb-6">
                     <h3 className="text-lg font-bold text-slate-500 mb-2">Semestral</h3>
                     <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold text-slate-900">R$ 97</span>
                        <span className="text-slate-400 mb-1 font-medium">/sem</span>
                     </div>
                     <p className="text-sm font-medium text-emerald-600 mt-2">R$ 16,16 / mês</p>
                     <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-100 inline-block px-2 py-1 rounded">Cobrado a cada 6 meses</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1 text-slate-600 text-sm font-medium">
                     <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Acesso Completo</li>
                     <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Membros Ilimitados</li>
                     <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> IA Financeira</li>
                  </ul>
                  <button 
                    onClick={isLoggedIn ? () => navigate('/dashboard') : () => navigate('/login')}
                    className="w-full py-4 rounded-xl border-2 border-slate-100 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    {isLoggedIn ? 'Acessar Plano Atual' : 'Assinar Semestral'}
                  </button>
                  <div className="mt-4 flex flex-col items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      <span>• Sem cartão necessário</span>
                      <span>• Cancelamento fácil</span>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 13. GUARANTEE */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-2xl mx-auto text-center px-6">
              <div className="inline-flex items-center justify-center p-4 bg-white rounded-full text-emerald-600 mb-8 shadow-sm border border-slate-100">
                  <ShieldCheck size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Garantia de 30 dias</h2>
              <p className="text-slate-600 leading-relaxed">
                  Teste o FinancePro por 30 dias sem risco. Se não gostar, cancele e receba 100% do seu dinheiro de volta. Sem perguntas.
              </p>
          </div>
      </section>

      {/* 14. FAQ */}
      <section id="faq" className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-16 tracking-tight">Perguntas Frequentes</h2>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden transition-all hover:bg-white hover:shadow-md">
                        <button 
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-800"
                        >
                            {faq.q}
                            <ChevronDown className={`transition-transform duration-300 text-slate-400 ${openFaq === idx ? 'rotate-180' : ''}`} />
                        </button>
                        <div 
                            className={`px-6 text-slate-600 leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
                        >
                            {faq.a}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 15. FOOTER / FINAL CTA */}
      <section className="py-32 px-6 text-center bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[100px]"></div>
         </div>
         
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">Pronto para assumir o controle da sua vida financeira?</h2>
            <p className="text-xl text-slate-400 mb-12 font-light">Crie sua conta agora em 30 segundos e comece hoje mesmo com clareza total.</p>
            <button 
                onClick={isLoggedIn ? () => navigate('/dashboard') : scrollToPricing}
                className="px-12 py-5 bg-emerald-500 text-white rounded-full font-bold text-xl hover:bg-emerald-400 transition-colors shadow-2xl shadow-emerald-900/50 transform hover:scale-105"
            >
                {isLoggedIn ? 'Acessar Dashboard' : 'Criar Minha Conta Gratuitamente'}
            </button>
         </div>
         
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 border-t border-white/10 pt-10 mt-20">
            <p>© 2024 FinancePro. Todos os direitos reservados.</p>
            <div className="flex gap-8 mt-6 md:mt-0 font-medium">
               <a href="#" className="hover:text-emerald-400 transition-colors">Privacidade</a>
               <a href="#" className="hover:text-emerald-400 transition-colors">Termos</a>
               <a href="#" className="hover:text-emerald-400 transition-colors">Suporte</a>
            </div>
         </div>
      </section>
    </div>
  );
};