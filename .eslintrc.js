module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-undef": "off", // TypeScript handles this
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js", "*.cjs"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // TypeScript specific rules can go here
      },
    },
  ],
};
