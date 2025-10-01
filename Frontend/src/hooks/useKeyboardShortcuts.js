// Custom hook for handling keyboard shortcuts throughout the application
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ctrl+K or Cmd+K - Focus on search input
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl+N or Cmd+N - Create new task
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        const newTaskBtn = document.querySelector('button');
        const buttons = document.querySelectorAll('button');
        // Find the button that creates new tasks
        const addButton = Array.from(buttons).find(btn => 
          btn.textContent.includes('Add New Task') || btn.textContent.includes('New Task')
        );
        if (addButton) {
          addButton.click();
        }
      }

      // Escape key - Close modals or dialogs
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"], .modal, .fixed');
        if (modal) {
          const closeBtn = modal.querySelector('button[aria-label="Close"], button:contains("Close")');
          if (closeBtn) closeBtn.click();
        }
      }

      // Ctrl+1 - Navigate to Dashboard
      if ((event.ctrlKey || event.metaKey) && event.key === '1') {
        event.preventDefault();
        navigate('/dashboard');
      }

      // Ctrl+2 - Navigate to Profile
      if ((event.ctrlKey || event.metaKey) && event.key === '2') {
        event.preventDefault();
        navigate('/profile');
      }

      // Ctrl+Shift+/ - Show keyboard shortcuts help
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '/') {
        event.preventDefault();
        // This shortcut can be used to show help dialog
        // Implementation depends on the help component
      }
    };

    // Add event listener when component mounts
    document.addEventListener('keydown', handleKeyPress);
    
    // Clean up event listener when component unmounts
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
};