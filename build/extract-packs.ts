import { extractPack } from "@foundryvtt/foundryvtt-cli";

await extractPack("packs/pf2e-macros", "src/packs/pf2e-macros", { clean: true });
await extractPack("packs/sf2e-macros", "src/packs/sf2e-macros", { clean: true });
