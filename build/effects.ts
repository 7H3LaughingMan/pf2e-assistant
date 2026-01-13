import * as fs from "fs";
import PF2E_ASSISTANT_EFFECTS from "../src/effects/pf2e-assistant-effects.json" with { type: "json" };
import PF2E_BESTIARY_EFFECTS from "../src/effects/pf2e-bestiary-effects.json" with { type: "json" };
import PF2E_CAMPAIGN_EFFECTS from "../src/effects/pf2e-campaign-effects.json" with { type: "json" };
import PF2E_CONDITIONS from "../src/effects/pf2e-conditions.json" with { type: "json" };
import PF2E_EQUIPMENT_EFFECTS from "../src/effects/pf2e-equipment-effects.json" with { type: "json" };
import PF2E_FEAT_EFFECTS from "../src/effects/pf2e-feat-effects.json" with { type: "json" };
import PF2E_OTHER_EFFECTS from "../src/effects/pf2e-other-effects.json" with { type: "json" };
import PF2E_SPELL_EFFECTS from "../src/effects/pf2e-spell-effects.json" with { type: "json" };

interface EffectJSON {
    slug: string;
    uuid: string;
}

function createDefinition(name: string, effects: EffectJSON[]) {
    const data = [];

    data.push(`export const ${name}: {`);
    data.push(...effects.map((effect) => `    "${effect.slug}": "${effect.uuid}";`));
    data.push(`};`);

    return data;
}

function createEffect(name: string, effects: EffectJSON[]) {
    const data = [];

    data.push(`export const ${name} = {`);
    data.push(...effects.map((effect) => `    "${effect.slug}": "${effect.uuid}",`));
    data.push(`};`);

    return data;
}

fs.writeFileSync(
    "./src/effects.js",
    [
        ...createEffect("PF2E_ASSISTANT_EFFECTS", PF2E_ASSISTANT_EFFECTS),
        "",
        ...createEffect("PF2E_BESTIARY_EFFECTS", PF2E_BESTIARY_EFFECTS),
        "",
        ...createEffect("PF2E_CAMPAIGN_EFFECTS", PF2E_CAMPAIGN_EFFECTS),
        "",
        ...createEffect("PF2E_CONDITIONS", PF2E_CONDITIONS),
        "",
        ...createEffect("PF2E_EQUIPMENT_EFFECTS", PF2E_EQUIPMENT_EFFECTS),
        "",
        ...createEffect("PF2E_FEAT_EFFECTS", PF2E_FEAT_EFFECTS),
        "",
        ...createEffect("PF2E_OTHER_EFFECTS", PF2E_OTHER_EFFECTS),
        "",
        ...createEffect("PF2E_SPELL_EFFECTS", PF2E_SPELL_EFFECTS)
    ].join("\n")
);

fs.writeFileSync(
    "./src/effects.d.ts",
    [
        ...createDefinition("PF2E_ASSISTANT_EFFECTS", PF2E_ASSISTANT_EFFECTS),
        "",
        ...createDefinition("PF2E_BESTIARY_EFFECTS", PF2E_BESTIARY_EFFECTS),
        "",
        ...createDefinition("PF2E_CAMPAIGN_EFFECTS", PF2E_CAMPAIGN_EFFECTS),
        "",
        ...createDefinition("PF2E_CONDITIONS", PF2E_CONDITIONS),
        "",
        ...createDefinition("PF2E_EQUIPMENT_EFFECTS", PF2E_EQUIPMENT_EFFECTS),
        "",
        ...createDefinition("PF2E_FEAT_EFFECTS", PF2E_FEAT_EFFECTS),
        "",
        ...createDefinition("PF2E_OTHER_EFFECTS", PF2E_OTHER_EFFECTS),
        "",
        ...createDefinition("PF2E_SPELL_EFFECTS", PF2E_SPELL_EFFECTS)
    ].join("\n")
);
