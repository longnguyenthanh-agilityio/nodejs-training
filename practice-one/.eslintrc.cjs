module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "prettier", // Integrate Prettier with ESLint
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": "off", // Allow console statements (optional, adjust as needed)
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn on unused variables, ignore variables with names starting with _
  },
  ignorePatterns: ["node_modules/*", "dist/*", "build/*", "coverage/*", "logs/*", "*.min.js"],
};
