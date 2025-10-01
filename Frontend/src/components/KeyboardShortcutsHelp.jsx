import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

// This component shows keyboard shortcuts help
const KeyboardShortcutsHelp = () => {
  const [showHelp, setShowHelp] = useState(false);

  // Listen for keyboard shortcut to open/close help
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ctrl+Shift+/ toggles the help modal
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '/') {
        event.preventDefault();
        setShowHelp(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // List of available keyboard shortcuts
  const shortcuts = [
    { keys: 'Ctrl + K', description: 'Focus search' },
    { keys: 'Ctrl + N', description: 'Create new task' },
    { keys: 'Escape', description: 'Close modal' },
    { keys: 'Ctrl + 1', description: 'Go to Dashboard' },
    { keys: 'Ctrl + 2', description: 'Go to Profile' },
    { keys: 'Ctrl + Shift + /', description: 'Show this help' }
  ];

  // Don't render anything if modal is closed
  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
        {/* Modal header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-teal-400" />
            Keyboard Shortcuts
          </h3>
          {/* Close button */}
          <button
            onClick={() => setShowHelp(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* List of shortcuts */}
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
              <kbd className="px-2 py-1 text-sm bg-slate-700 text-slate-300 rounded border border-slate-600 font-mono">
                {shortcut.keys}
              </kbd>
              <span className="text-slate-400 text-sm">{shortcut.description}</span>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Press Ctrl+Shift+/ to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;