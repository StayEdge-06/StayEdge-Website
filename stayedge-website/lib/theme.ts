/**
 * Theme contract, shared by the blocking inline script in the document head
 * and by the React provider that renders the toggle.
 *
 * Dark is the default and the brand's home register — the identity, the purple
 * ambient light and the 3D scenes are all composed for the charcoal ground. The
 * site therefore does NOT auto-flip on `prefers-color-scheme`; light is an
 * explicit choice the visitor makes and the browser remembers.
 */
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "se-theme";

/** The charcoal/off-white the browser chrome should match in each theme. */
export const THEME_COLOR: Record<Theme, string> = {
  dark: "#171123",
  light: "#F5F2F8",
};

/**
 * Runs before first paint, inlined in <head>. Its only job is to stamp the
 * document so the very first frame is already in the visitor's theme — without
 * it, a light-theme visitor gets a charcoal flash on every navigation.
 *
 * Kept deliberately tiny and dependency-free: it is parsed and executed on the
 * critical path. Dark needs no attribute (it is the CSS default), so only the
 * light case writes anything.
 */
export const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light"){document.documentElement.setAttribute("data-theme","light")}}catch(e){}})();`;

/** Reads the theme the document is currently rendering in. */
export function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/**
 * Applies a theme to the document and remembers it.
 *
 * The `data-theme-switching` marker scopes a colour crossfade to the switch
 * itself (see globals.css). Without that scoping, every surface on the page
 * would carry a background transition permanently, which turns ordinary hover
 * states mushy and costs paint work on scroll.
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.setAttribute("data-theme-switching", "");
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or storage disabled: the theme still applies for this
    // page view, it just will not be remembered. Not worth surfacing.
  }

  // Keep the browser chrome (mobile address bar) in step with the page.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);

  window.setTimeout(() => root.removeAttribute("data-theme-switching"), 300);
}
