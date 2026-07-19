import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // n8n Workflow SDK sources (deployed via MCP, not part of the app build)
    "os/**",
  ]),
  {
    rules: {
      // Mount-time setState after client-only checks (tiering, consent,
      // passport reads) is the intentional SSR-safe hydration pattern used
      // across this app; React 19's strict rule flags it wholesale. Kept as
      // a warning so genuinely cascading cases still surface in review.
      "react-hooks/set-state-in-effect": "warn",
      // Allow intentionally-unused destructure slots prefixed with _
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
