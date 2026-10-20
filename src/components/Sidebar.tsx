import { Home, Timer, CheckCircle2, Menu, X, Sparkles, ShoppingCart, Flame, FileText } from 'lucide-react';
import { useTodoStore } from '../store/store';
import { useState } from 'react';

export function Sidebar() {
  const { 
    currentListId, 
    currentView, 
    setCurrentListId, 
    setCurrentView,
    streak,
    darkMode,
    toggleDarkMode,
    focusMode,
    toggleFocusMode,
    toggleWritingMode
  } = useTodoStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'home', label: 'Tasks', icon: Home },
    { id: 'fun', label: 'Fun', icon: Sparkles },
    { id: 'wantToBuy', label: 'Want to Buy', icon: ShoppingCart },
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

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-card border-border'} min-h-screen p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Streak Widget */}
      <div className={`${darkMode ? 'bg-dark-background-dark border-dark-border' : 'bg-background border-border'} rounded-card p-4 mb-6`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Flame size={20} className="text-accent" />
          </div>
          <div>
            <p className={`${darkMode ? 'text-dark-text-muted' : 'text-text-muted'} text-xs uppercase tracking-wider`}>Streak</p>
            <p className={`${darkMode ? 'text-dark-text' : 'text-text'} text-2xl font-bold`}>{streak}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="mb-6">
          <p className={`${darkMode ? 'text-dark-text-muted' : 'text-text-muted'} text-xs uppercase tracking-wider mb-3 px-3`}>Navigation</p>
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
                    : `${darkMode ? 'text-dark-text-muted hover:bg-dark-background-dark hover:text-dark-text' : 'text-text-muted hover:bg-background hover:text-text'}`
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
      <div className={`border-t ${darkMode ? 'border-dark-border' : 'border-border'} pt-4 mt-4`}>
        {/* Writing Mode */}
        <button
          onClick={toggleWritingMode}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-3 transition-colors ${darkMode ? 'text-dark-text-muted hover:bg-dark-background-dark hover:text-dark-text' : 'text-text-muted hover:bg-background hover:text-text'}`}
        >
          <FileText size={18} />
          <span className="text-sm font-medium">Writing Mode</span>
        </button>
        
        {/* Focus Mode Toggle */}
        <button
          onClick={toggleFocusMode}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-3 transition-colors ${darkMode ? 'text-dark-text-muted hover:bg-dark-background-dark hover:text-dark-text' : 'text-text-muted hover:bg-background hover:text-text'}`}
        >
          <span className="text-sm font-medium">Focus Mode</span>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${focusMode ? 'bg-accent' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${focusMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-3 transition-colors ${darkMode ? 'text-dark-text-muted hover:bg-dark-background-dark hover:text-dark-text' : 'text-text-muted hover:bg-background hover:text-text'}`}
        >
          <span className="text-sm font-medium">Dark Mode</span>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-accent' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>

        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
            U
          </div>
          <div>
            <p className={`${darkMode ? 'text-dark-text' : 'text-text'} text-sm font-medium`}>User</p>
            <p className={`${darkMode ? 'text-dark-text-muted' : 'text-text-muted'} text-xs`}>to.do</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
