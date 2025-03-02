module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "turbo"
  ],
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  ignorePatterns: [
    "**/*.js",
    "node_modules",
    ".turbo",
    "dist",
    "coverage",
    "build"
  ]
}
