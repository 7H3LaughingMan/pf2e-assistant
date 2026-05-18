import Replace from "unplugin-replace/vite";
import { defineConfig } from "vite";
import moduleJSON from "./module.json" with { type: "json" };
import * as compendiumPacks from "./src/compendium-packs.ts";

type ReplaceItem = {
    find: string | RegExp;
    replacement: string | ((id: string, match: RegExpExecArray) => string);
};

function generateReplaceItems(config: Record<string, Record<string, string>>): ReplaceItem[] {
    if (config === undefined) {
        config = {};
    } else if ((typeof config === "object" || config !== null) === false) {
        throw new Error("[unplugin-replace]: The configuration is not of type 'Object'.");
    }

    const replacements: ReplaceItem[] = [];

    for (const [key, value] of Object.entries(config)) {
        function replace(_id: string, match: RegExpExecArray) {
            return JSON.stringify(value[match[1]]);
        }

        replacements.push({
            find: new RegExp(`${key}\\[\\"(.*?)\\"\\]`, "g"),
            replacement: replace
        });
    }

    return replacements;
}

export default defineConfig({
    base: `/modules/${moduleJSON.id}/dist`,
    server: {
        open: "/",
        port: 30001,
        proxy: {
            [`^(?!/modules/${moduleJSON.id}/dist/)`]: "http://localhost:30000",
            [`/modules/${moduleJSON.id}/dist/${moduleJSON.id}.js`]: {
                target: `http://localhost:30001/modules/${moduleJSON.id}/dist`,
                rewrite: () => "/index.ts"
            },
            "/socket.io": { target: "ws://localhost:30000", ws: true }
        }
    },
    build: {
        emptyOutDir: true,
        sourcemap: true,
        lib: { entry: "./src/index.ts", formats: ["es"], fileName: moduleJSON.id },
        rolldownOptions: {
            output: {
                codeSplitting: false
            }
        }
    },
    plugins: [Replace({ values: generateReplaceItems(compendiumPacks) })],
    resolve: {
        tsconfigPaths: true
    }
});
