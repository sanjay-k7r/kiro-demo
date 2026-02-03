import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import type { Theme } from '../components/ThemeProvider';
import React from 'react';

const STORAGE_KEY = 'trolling-todo-app-theme';

// Helper to create a wrapper with ThemeProvider
function createWrapper(props?: { defaultTheme?: Theme; storageKey?: string }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
  };
}

describe('ThemeProvider', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let addEventListenerMock: ReturnType<typeof vi.fn>;
  let removeEventListenerMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
    
    // Mock matchMedia
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : false,
      media: query,
      onchange: null,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useTheme hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });

    it('returns theme, setTheme, and resolvedTheme', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      expect(result.current.theme).toBeDefined();
      expect(result.current.setTheme).toBeDefined();
      expect(result.current.resolvedTheme).toBeDefined();
      expect(typeof result.current.setTheme).toBe('function');
    });

    it('defaults to system theme when no preference saved', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      expect(result.current.theme).toBe('system');
    });

    it('uses defaultTheme prop when provided', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'dark' }),
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('theme persistence', () => {
    it('loads saved theme from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      expect(result.current.theme).toBe('dark');
    });

    it('persists theme to localStorage when setTheme is called', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });

    it('uses custom storageKey when provided', () => {
      const customKey = 'custom-theme-key';
      localStorage.setItem(customKey, 'dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ storageKey: customKey }),
      });

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.setTheme('light');
      });

      expect(localStorage.getItem(customKey)).toBe('light');
    });

    it('handles invalid localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-theme');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      // Should fall back to default theme
      expect(result.current.theme).toBe('light');
    });
  });

  describe('system theme detection', () => {
    it('detects light system preference', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
      }));

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'system' }),
      });

      expect(result.current.resolvedTheme).toBe('light');
    });

    it('detects dark system preference', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
      }));

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'system' }),
      });

      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('listens for system theme changes when theme is system', () => {
      renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'system' }),
      });

      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('removes listener when theme changes from system', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'system' }),
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('resolvedTheme', () => {
    it('returns light when theme is light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      expect(result.current.resolvedTheme).toBe('light');
    });

    it('returns dark when theme is dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'dark' }),
      });

      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('resolves system to actual theme based on preference', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
      }));

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'system' }),
      });

      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  describe('document class application', () => {
    it('applies light class to document root', () => {
      renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('applies dark class to document root', () => {
      renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'dark' }),
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('updates document class when theme changes', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('removes previous theme class when switching', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      act(() => {
        result.current.setTheme('dark');
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('updates theme to light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'dark' }),
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('updates theme to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('updates theme to system', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
    });
  });

  describe('localStorage error handling', () => {
    it('handles localStorage read errors gracefully', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      // Should fall back to default theme
      expect(result.current.theme).toBe('light');
      
      getItemSpy.mockRestore();
    });

    it('handles localStorage write errors gracefully', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper({ defaultTheme: 'light' }),
      });

      // Should not throw, just log warning
      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      
      setItemSpy.mockRestore();
    });
  });
});
