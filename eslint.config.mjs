import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 👇 تعطيل تحذير "no-explicit-any"
      "@typescript-eslint/no-explicit-any": "off",

      // 👇 جعل بعض القواعد تحذير فقط بدلاً من خطأ
      "react/no-unescaped-entities": "warn",
      "react/jsx-key": "warn",
    },
  },

  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
