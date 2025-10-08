import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["dist"]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        settings: {
            react: {
                version: "detect"
            }
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true }
            ]
        }
    },
    eslintConfigPrettier
);
