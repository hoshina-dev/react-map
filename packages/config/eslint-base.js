// @ts-check

import { createESLintConfig } from "@leomotors/config";
import { defineConfig } from "eslint/config";
import turboPlugin from "eslint-plugin-turbo";

export const config = defineConfig(
  ...createESLintConfig(),
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    ignores: ["dist/**"],
  },
);
