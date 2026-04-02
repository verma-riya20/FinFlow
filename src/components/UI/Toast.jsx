import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, typeOrOptions = 'success', maybeOptions = {}) => {
    const type = typeof typeOrOptions === 'string' ? typeOrOptions : 'success';
    const options = typeof typeOrOptions === 'object' ? typeOrOptions : maybeOptions;
    const { duration = 3200, actionLabel, onAction } = options;
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, actionLabel, onAction }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <div className="toast-row">
              <span>{t.message}</span>
              {t.actionLabel && (
                <button
                  type="button"
                  className="toast-action"
                  onClick={() => {
                    t.onAction?.();
                    removeToast(t.id);
                  }}
                >
                  {t.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
