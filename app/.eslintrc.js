module.exports = {
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["warn"],
    "no-console": ["warn", { allow: ["error", "warn", "info"] }],
    "prefer-const": "warn",
    "no-var": "warn",
  },
};
