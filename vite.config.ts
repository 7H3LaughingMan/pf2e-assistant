import vttSync from "foundryvtt-sync";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import moduleJSON from "./module.json" with { type: "json" };
import * as compendiumPacks from "./src/compendium-packs.ts";
import { replaceCodePlugin } from "./vite-plugin-replace.ts";

export default defineConfig({
    root: "./src",
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
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true,
        lib: { entry: "index.ts", formats: ["es"], fileName: moduleJSON.id },
        rollupOptions: {
            output: {
                manualChunks: () => {
                    return moduleJSON.id;
                }
            }
        }
    },
    plugins: [
        replaceCodePlugin(compendiumPacks),
        tsconfigPaths(),
        vttSync(moduleJSON, {
            dataDirectory: "src/packs",
            transformer(doc) {
                if (doc["system"]) {
                    // @ts-expect-error Property '_migration' does not exist
                    if (doc["system"]["_migration"]) {
                        // @ts-expect-error Property '_migration' does not exist
                        delete doc["system"]["_migration"];
                    }
                }

                if (doc["ownership"]) {
                    doc["ownership"] = { default: 0 };
                }

                if (doc["_stats"]) {
                    delete doc["_stats"];
                }
            }
        })
    ]
});
