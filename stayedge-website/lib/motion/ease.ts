/**
 * The brand's two motion curves, as JS arrays for Framer Motion. They mirror
 * --se-ease-edge / --se-ease-settle in web-extension.css exactly; CSS and JS
 * animations have to share a gait or the site feels like two products.
 */

/** Confident rise — entrances, reveals, page changes. */
export const EASE_EDGE = [0.2, 0.8, 0.2, 1] as const;

/** Score settle — things arriving at a final value (counters, progress). */
export const EASE_SETTLE = [0.16, 1, 0.3, 1] as const;
