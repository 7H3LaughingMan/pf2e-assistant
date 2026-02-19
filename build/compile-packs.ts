import { compilePack } from "@foundryvtt/foundryvtt-cli";
import fs from "fs";

fs.rmSync("packs/pf2e-macros", { force: true, recursive: true, maxRetries: 10 });
fs.rmSync("packs/sf2e-macros", { force: true, recursive: true, maxRetries: 10 });
await compilePack("src/packs/pf2e-macros", "packs/pf2e-macros");
await compilePack("src/packs/sf2e-macros", "packs/sf2e-macros");
