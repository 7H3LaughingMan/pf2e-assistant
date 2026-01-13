import { extractPack } from "@foundryvtt/foundryvtt-cli";

await extractPack("packs/pf2e-effects", "src/packs/pf2e-effects", { clean: true });
await extractPack("packs/pf2e-macros", "src/packs/pf2e-macros", { clean: true });
