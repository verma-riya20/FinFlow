import React, { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for debounced values
 * Prevents excessive updates (e.g., search on every keystroke)
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for keyboard shortcuts
 * Binds global keyboard events with cleanup
 */
export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((e) => {
    const targetTag = e.target?.tagName?.toLowerCase();
    const isEditable = e.target?.isContentEditable;
    const isTypingContext = isEditable || targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';

    // Let users type normally in form controls unless holding Ctrl/Cmd explicitly.
    if (isTypingContext && !(e.ctrlKey || e.metaKey)) return;

    const isMeta = e.ctrlKey || e.metaKey;

    shortcuts.forEach(({ key, ctrlKey: needsCtrl, handler }) => {
      if (e.key.toLowerCase() === key.toLowerCase() && (!needsCtrl || isMeta)) {
        e.preventDefault();
        handler();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Custom hook for localStorage sync with cleanup
 * Auto-persists value to localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * Custom hook for click-outside detection
 * Useful for closing dropdowns, modals, etc.
 */
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};
