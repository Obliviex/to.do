import { useState, useEffect, useRef } from 'react';
import { Copy, X } from 'lucide-react';
import { useTodoStore } from '../store/store';

export function WritingMode() {
  const { darkMode, setCurrentView } = useTodoStore();
  const [text, setText] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [mouseTimeout, setMouseTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleMouseMove = () => {
    setShowControls(true);
    if (mouseTimeout) clearTimeout(mouseTimeout);
    const timeout = setTimeout(() => setShowControls(false), 2000);
    setMouseTimeout(timeout);
  };

  const handleKeyDown = () => {
    setShowControls(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClose = () => {
    setCurrentView('home');
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (mouseTimeout) clearTimeout(mouseTimeout);
    };
  }, [mouseTimeout]);

  return (
    <div 
      className="fixed inset-0 z-50"
      onMouseMove={handleMouseMove}
    >
      {/* Top controls */}
      {showControls && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-card border-border'} border transition-opacity duration-300`}>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${darkMode ? 'text-dark-text hover:bg-dark-background-dark' : 'text-text hover:bg-background'} transition-colors`}
          >
            <Copy size={14} />
            <span>Copy</span>
          </button>
          <button
            onClick={handleClose}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${darkMode ? 'text-dark-text hover:bg-dark-background-dark' : 'text-text hover:bg-background'} transition-colors`}
          >
            <X size={14} />
            <span>Close</span>
          </button>
        </div>
      )}

      {/* Main text area */}
      <div className="h-full flex items-center justify-center p-8">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start writing..."
          className={`w-full max-w-4xl h-full resize-none text-lg leading-relaxed outline-none ${
            darkMode 
              ? 'bg-dark-background text-dark-text placeholder:text-dark-text-muted' 
              : 'bg-background text-text placeholder:text-text-muted'
          }`}
          style={{ minHeight: 'calc(100vh - 200px)' }}
        />
      </div>

      {/* Bottom word count */}
      {showControls && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-card border-border'} border transition-opacity duration-300`}>
          <span className={`text-xs ${darkMode ? 'text-dark-text-muted' : 'text-text-muted'}`}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
        </div>
      )}
    </div>
  );
}
