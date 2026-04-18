import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  // Next.js base configs
  ...nextVitals,
  ...nextTs,

  // TypeScript strict rules
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/ban-ts-comment": ["error", {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": false
      }],
    },
  },

  // React specific rules
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": ["error", { "checkFragmentShorthand": true }],
      "react/self-closing-comp": ["error", {
        "component": true,
        "html": true
      }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
    },
  },

  // Code quality rules
  {
    rules: {
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-implicit-coercion": "error",
      "no-useless-return": "error",
      "max-depth": ["error", 4],
      "max-lines": ["warn", { "max": 300, "skipBlankLines": true, "skipComments": true }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
  },

  // Override default ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "coverage/**",
    ".jest-cache/**",
    "next-env.d.ts",
    "**/*.d.ts",
  ]),

  // Prettier must be last to disable conflicting rules
  prettierConfig,
]);

export default eslintConfig;
