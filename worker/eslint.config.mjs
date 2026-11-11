// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Grafo de dependencias entre capas, hecho cumplir por el linter.
 * `allowTypeImports: true`: importar un TIPO cruzando capas no acopla en ejecución.
 */
const forbid = (...groups) => ({
  "no-restricted-imports": "off",
  "@typescript-eslint/no-restricted-imports": [
    "error",
    {
      patterns: groups.map((group) => ({
        group: [`**/${group}/**`],
        allowTypeImports: true,
        message: `Import prohibido por las reglas de capas: ${group} no es accesible desde esta capa.`,
      })),
    },
  ],
});

export const LAYER_RULES = [
  { files: ["src/utils/**"], rules: forbid("interfaces", "dtos", "services", "controllers", "middleware", "routes", "adapters", "database", "config", "bootstrap") },
  { files: ["src/interfaces/**"], rules: forbid("dtos", "services", "controllers", "middleware", "routes", "adapters", "database", "config", "bootstrap") },
  { files: ["src/dtos/**"], rules: forbid("services", "controllers", "middleware", "routes", "adapters", "database", "config", "bootstrap") },
  { files: ["src/services/**"], rules: forbid("controllers", "middleware", "routes", "adapters", "database", "config", "bootstrap") },
  { files: ["src/controllers/**"], rules: forbid("middleware", "routes", "adapters", "database", "config", "bootstrap") },
  { files: ["src/middleware/**"], rules: forbid("services", "controllers", "routes", "adapters", "database", "config", "bootstrap") },
  { files: ["src/routes/**"], rules: forbid("services", "adapters", "database", "config", "bootstrap") },
  { files: ["src/database/**", "src/adapters/**"], rules: forbid("dtos", "services", "controllers", "middleware", "routes", "config", "bootstrap") },
  { files: ["src/config/**"], rules: forbid("services", "controllers", "middleware", "routes", "adapters", "database", "bootstrap") },
];

export default tseslint.config(
  { ignores: ["node_modules/**", ".wrangler/**", "coverage/**", "*.config.mjs", "vitest.config.ts"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "separate-type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": ["error", { allow: ["error", "warn"] }],
      // Un adaptador en memoria cumple un puerto async sin nada que esperar.
      "@typescript-eslint/require-await": "off",
    },
  },

  ...LAYER_RULES,

  // Un caso de uso no lee el reloj ni el azar directo: los recibe como puertos.
  {
    files: ["src/services/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "NewExpression[callee.name='Date'][arguments.length=0]", message: "Usa el puerto Clock." },
        { selector: "MemberExpression[object.name='Date'][property.name='now']", message: "Usa el puerto Clock." },
        { selector: "MemberExpression[object.name='Math'][property.name='random']", message: "Usa el puerto Random." },
      ],
    },
  },

  {
    files: ["test/**"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
);
