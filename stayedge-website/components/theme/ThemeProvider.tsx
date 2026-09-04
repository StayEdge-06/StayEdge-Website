"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { applyTheme, readTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/* ------------------------------------------------------------------
   The theme lives in the DOM, not in React.

   The blocking script in <head> stamps `data-theme` before first paint, so by
   the time React runs the answer already exists on the document element. That
   makes the document an external store, and useSyncExternalStore the right way
   to read it: no mount effect, no post-hydration state flip, and the toggle in
   a second tab stays in step through the `storage` event.
   ------------------------------------------------------------------ */

let listeners: (() => void)[] = [];

function emit() {
  for (const l of listeners) l();
}

function handleStorage(e: StorageEvent) {
  if (e.key !== THEME_STORAGE_KEY) return;
  applyTheme(e.newValue === "light" ? "light" : "dark");
  emit();
}

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  if (listeners.length === 1) window.addEventListener("storage", handleStorage);
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
    if (listeners.length === 0) window.removeEventListener("storage", handleStorage);
  };
}

/** Dark is what the server renders, because dark is the CSS default. */
const serverSnapshot = (): Theme => "dark";

type ThemeApi = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeApi | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, serverSnapshot);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    emit();
  }, []);

  const toggle = useCallback(() => {
    applyTheme(readTheme() === "dark" ? "light" : "dark");
    emit();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Read the active theme. Returns the dark default outside a provider rather
 * than throwing — a decorative consumer (a 3D scene, an illustration) should
 * degrade to the brand's home register, not take the page down.
 */
export function useTheme(): ThemeApi {
  return (
    useContext(ThemeContext) ?? {
      theme: "dark",
      setTheme: () => {},
      toggle: () => {},
    }
  );
}
