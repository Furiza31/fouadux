// @ts-check
import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  ignores: [
    "assets/css/main.css",
    "lib/db/migrations/**",
  ],
  vue: true,
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
}, {
  rules: {
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": "off",
    "antfu/no-top-level-await": ["off"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "perfectionist/sort-imports": ["error", {
      tsconfigRootDir: ".",
    }],
  },
});
