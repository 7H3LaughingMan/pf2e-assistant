import { compilePack } from "@foundryvtt/foundryvtt-cli";
import fs from "fs";

fs.rmSync("packs/pf2e-effects", { force: true, recursive: true, maxRetries: 10 });
fs.rmSync("packs/pf2e-macros", { force: true, recursive: true, maxRetries: 10 });
await compilePack("src/packs/pf2e-effects", "packs/pf2e-effects");
await compilePack("src/packs/pf2e-macros", "packs/pf2e-macros");
