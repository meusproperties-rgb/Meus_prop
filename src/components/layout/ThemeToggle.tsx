'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils/index';

const STORAGE_KEY = 'meus-theme';

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const shouldUseDark = storedTheme === 'dark';

    document.documentElement.classList.toggle('dark', shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    document.documentElement.classList.toggle('dark', nextIsDark);
    window.localStorage.setItem(STORAGE_KEY, nextIsDark ? 'dark' : 'light');
    setIsDark(nextIsDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn(
        'relative inline-flex h-8 w-16 items-center rounded-full border border-border bg-muted p-1 text-muted-foreground shadow-inner transition-colors',
        className
      )}
    >
      <span
        className={cn(
          'absolute left-1 top-1 h-6 w-6 rounded-full bg-background shadow-sm ring-1 ring-border transition-transform duration-300 ease-out',
          isDark && 'translate-x-8'
        )}
      />
      <span
        className={cn(
          'relative z-10 flex w-7 items-center justify-center transition-colors',
          !isDark && 'text-foreground'
        )}
      >
        <Sun className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          'relative z-10 flex w-7 items-center justify-center transition-colors',
          isDark && 'text-foreground'
        )}
      >
        <Moon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span className="sr-only">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
