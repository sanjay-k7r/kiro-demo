import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeProvider } from '../components/ThemeProvider';
import type { Theme } from '../components/ThemeProvider';
import React from 'react';

// Helper to create a wrapper with ThemeProvider
function createWrapper(props?: { defaultTheme?: Theme }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
  };
}

// Helper to render ThemeToggle with ThemeProvider
function renderThemeToggle(defaultTheme?: Theme) {
  return render(<ThemeToggle />, {
    wrapper: createWrapper({ defaultTheme }),
  });
}

describe('ThemeToggle', () => {
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

  describe('rendering', () => {
    it('renders a button element', () => {
      renderThemeToggle('light');
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has accessible label for light mode', () => {
      renderThemeToggle('light');
      
      const button = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(button).toBeInTheDocument();
    });

    it('has accessible label for dark mode', () => {
      renderThemeToggle('dark');
      
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      expect(button).toBeInTheDocument();
    });

    it('contains screen reader text', () => {
      renderThemeToggle('light');
      
      expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });
  });

  describe('icon display', () => {
    it('shows Moon icon when in light mode', () => {
      renderThemeToggle('light');
      
      // In light mode, Moon should be visible (to switch to dark)
      // Sun should be hidden
      const button = screen.getByRole('button');
      
      // Check that the button contains SVG elements (icons)
      const svgs = button.querySelectorAll('svg');
      expect(svgs.length).toBe(2); // Both Sun and Moon are rendered
      
      // Moon icon should have visible classes (scale-100, opacity-100)
      const moonIcon = svgs[1]; // Moon is the second icon
      expect(moonIcon.classList.toString()).toContain('scale-100');
      expect(moonIcon.classList.toString()).toContain('opacity-100');
    });

    it('shows Sun icon when in dark mode', () => {
      renderThemeToggle('dark');
      
      const button = screen.getByRole('button');
      const svgs = button.querySelectorAll('svg');
      expect(svgs.length).toBe(2);
      
      // Sun icon should have visible classes (scale-100, opacity-100)
      const sunIcon = svgs[0]; // Sun is the first icon
      expect(sunIcon.classList.toString()).toContain('scale-100');
      expect(sunIcon.classList.toString()).toContain('opacity-100');
    });
  });

  describe('theme toggling', () => {
    it('switches from light to dark mode on click', async () => {
      const user = userEvent.setup();
      renderThemeToggle('light');
      
      const button = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(button);
      
      // After clicking, the document should have dark class
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('switches from dark to light mode on click', async () => {
      const user = userEvent.setup();
      renderThemeToggle('dark');
      
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      await user.click(button);
      
      // After clicking, the document should have light class
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('updates aria-label after toggling from light to dark', async () => {
      const user = userEvent.setup();
      renderThemeToggle('light');
      
      const button = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(button);
      
      // After toggling to dark, label should say "Switch to light mode"
      expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
    });

    it('updates aria-label after toggling from dark to light', async () => {
      const user = userEvent.setup();
      renderThemeToggle('dark');
      
      const button = screen.getByRole('button', { name: /switch to light mode/i });
      await user.click(button);
      
      // After toggling to light, label should say "Switch to dark mode"
      expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
    });

    it('can toggle multiple times', async () => {
      const user = userEvent.setup();
      renderThemeToggle('light');
      
      // Start in light mode
      expect(document.documentElement.classList.contains('light')).toBe(true);
      
      // Toggle to dark
      await user.click(screen.getByRole('button'));
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      // Toggle back to light
      await user.click(screen.getByRole('button'));
      expect(document.documentElement.classList.contains('light')).toBe(true);
      
      // Toggle to dark again
      await user.click(screen.getByRole('button'));
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('CSS transitions', () => {
    it('has transition classes on the button', () => {
      renderThemeToggle('light');
      
      const button = screen.getByRole('button');
      expect(button.classList.toString()).toContain('transition');
      expect(button.classList.toString()).toContain('duration-300');
    });

    it('has transition classes on icons', () => {
      renderThemeToggle('light');
      
      const button = screen.getByRole('button');
      const svgs = button.querySelectorAll('svg');
      
      svgs.forEach((svg) => {
        expect(svg.classList.toString()).toContain('transition-all');
        expect(svg.classList.toString()).toContain('duration-300');
        expect(svg.classList.toString()).toContain('ease-in-out');
      });
    });
  });

  describe('integration with ThemeProvider', () => {
    it('persists theme preference to localStorage', async () => {
      const user = userEvent.setup();
      renderThemeToggle('light');
      
      await user.click(screen.getByRole('button'));
      
      expect(localStorage.getItem('trolling-todo-app-theme')).toBe('dark');
    });

    it('respects saved theme preference', () => {
      localStorage.setItem('trolling-todo-app-theme', 'dark');
      renderThemeToggle();
      
      // Should show "Switch to light mode" because we're in dark mode
      expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
    });
  });
});
