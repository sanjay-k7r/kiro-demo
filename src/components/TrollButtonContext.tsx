/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * TROLL: Context for managing which Done button is currently displaced
 * 
 * Only ONE button can be displaced at a time. When a new button is hovered,
 * it becomes the active displaced button and the previous one returns to
 * its original position.
 */

interface TrollButtonContextValue {
  activeButtonId: string | null;
  setActiveButton: (id: string | null) => void;
  isActiveButton: (id: string) => boolean;
}

const TrollButtonContext = createContext<TrollButtonContextValue | undefined>(undefined);

interface TrollButtonProviderProps {
  children: ReactNode;
}

/**
 * TROLL: Provider that tracks which button is currently displaced
 * Wrap your TodoList or App with this provider to enable single-button displacement
 */
export function TrollButtonProvider({ children }: TrollButtonProviderProps) {
  // TROLL: Track which button is currently displaced (by todo ID)
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);

  const setActiveButton = useCallback((id: string | null) => {
    setActiveButtonId(id);
  }, []);

  const isActiveButton = useCallback((id: string) => {
    return activeButtonId === id;
  }, [activeButtonId]);

  return (
    <TrollButtonContext.Provider value={{ activeButtonId, setActiveButton, isActiveButton }}>
      {children}
    </TrollButtonContext.Provider>
  );
}

/**
 * TROLL: Hook to access the troll button context
 * Returns functions to check/set which button is currently displaced
 */
export function useTrollButtonContext() {
  const context = useContext(TrollButtonContext);
  
  if (context === undefined) {
    throw new Error('useTrollButtonContext must be used within a TrollButtonProvider');
  }
  
  return context;
}
