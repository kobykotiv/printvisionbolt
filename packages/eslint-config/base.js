<<<<<<< HEAD
<<<<<<< HEAD
module.exports = {
<<<<<<< HEAD
<<<<<<< HEAD
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  env: {
    browser: true,
    node: true,
    es6: true
=======
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
>>>>>>> 8d7edcb (reset to Monorepo with turburepo)
=======
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  env: {
    browser: true,
<<<<<<< HEAD
    es2022: true
>>>>>>> 52bc04b (day 2 configureing packages)
=======
    node: true,
    es6: true
  },
  settings: {
    react: {
      version: "detect"
    }
>>>>>>> b02bbb1 (feat: Enhance product management with Stripe integration and update product attributes)
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
<<<<<<< HEAD
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
<<<<<<< HEAD
<<<<<<< HEAD
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
=======
>>>>>>> b02bbb1 (feat: Enhance product management with Stripe integration and update product attributes)
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  }
};
<<<<<<< HEAD
=======
=======
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
>>>>>>> b38644b (feat: Enhance product management with Stripe integration and update product attributes)
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
<<<<<<< HEAD
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
=======
>>>>>>> 52bc04b (day 2 configureing packages)
  ignorePatterns: [
    "**/*.js",
    "node_modules",
    ".turbo",
    "dist",
    "coverage",
    "build"
  ]
}
<<<<<<< HEAD
>>>>>>> 60d53aa (day 2 configureing packages)
=======
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  }
};
>>>>>>> b38644b (feat: Enhance product management with Stripe integration and update product attributes)
=======
  {
    ignores: ["dist/**"],
  },
];
>>>>>>> 8d7edcb (reset to Monorepo with turburepo)
=======
>>>>>>> 52bc04b (day 2 configureing packages)
=======
>>>>>>> b02bbb1 (feat: Enhance product management with Stripe integration and update product attributes)
