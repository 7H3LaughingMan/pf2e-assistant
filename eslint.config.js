import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import noRestrictedProperties from "./eslint-local-rules/no-restricted-properties.js";
import {
    PF2E_ASSISTANT_EFFECTS,
    PF2E_BESTIARY_EFFECTS,
    PF2E_CAMPAIGN_EFFECTS,
    PF2E_CONDITIONS,
    PF2E_EQUIPMENT_EFFECTS,
    PF2E_FEAT_EFFECTS,
    PF2E_OTHER_EFFECTS,
    PF2E_SPELL_EFFECTS
} from "./src/effects.js";

export default defineConfig([
    globalIgnores(["dist/*"]),
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {
            js,
            custom: {
                rules: {
                    "no-restricted-properties": noRestrictedProperties
                }
            }
        },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }
            ],
            "custom/no-restricted-properties": [
                2,
                { object: "PF2E_ASSISTANT_EFFECTS", allowProperties: Object.keys(PF2E_ASSISTANT_EFFECTS) },
                { object: "PF2E_BESTIARY_EFFECTS", allowProperties: Object.keys(PF2E_BESTIARY_EFFECTS) },
                { object: "PF2E_CAMPAIGN_EFFECTS", allowProperties: Object.keys(PF2E_CAMPAIGN_EFFECTS) },
                { object: "PF2E_CONDITIONS", allowProperties: Object.keys(PF2E_CONDITIONS) },
                { object: "PF2E_EQUIPMENT_EFFECTS", allowProperties: Object.keys(PF2E_EQUIPMENT_EFFECTS) },
                { object: "PF2E_FEAT_EFFECTS", allowProperties: Object.keys(PF2E_FEAT_EFFECTS) },
                { object: "PF2E_OTHER_EFFECTS", allowProperties: Object.keys(PF2E_OTHER_EFFECTS) },
                { object: "PF2E_SPELL_EFFECTS", allowProperties: Object.keys(PF2E_SPELL_EFFECTS) }
            ]
        }
    },
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended
]);
