import { Home, Timer, CheckCircle2, Menu, X, Sparkles } from 'lucide-react';
import { useTodoStore } from '../store/store';
import { useState } from 'react';

export function Sidebar() {
  const { 
    currentListId, 
    currentView, 
    setCurrentListId, 
    setCurrentView,
    streak 
  } = useTodoStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'home', label: 'Tasks', icon: Home },
    { id: 'fun', label: 'Fun', icon: Sparkles },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Streak Widget */}
      <div className="bg-background border border-border rounded-card p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <span className="text-accent text-lg font-bold">🔥</span>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider">Streak</p>
            <p className="text-text text-2xl font-bold">{streak}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="mb-6">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-3 px-3">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id && currentListId === null;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as any);
                  setCurrentListId(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-text-muted hover:bg-background hover:text-text'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
            U
          </div>
          <div>
            <p className="text-text text-sm font-medium">User</p>
            <p className="text-text-muted text-xs">to.do</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
