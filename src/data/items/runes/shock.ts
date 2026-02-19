import { getDamageRollClass, isRolledDamageRoll, notesToHTML } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Items", "Runes", "Shock"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:shock"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            const shockDamage = Utils.Roll.extractDamage(data.roll, "shock", true);

            if (shockDamage) {
                const roll = await new (getDamageRollClass())(shockDamage).evaluate();
                await roll.toMessage({
                    flags: {
                        "pf2e-assistant": { process: false },
                        "pf2e-toolbelt": { targetHelper: { targets: [""] } }
                    },
                    flavor: notesToHTML([
                        {
                            title: "PF2E.WeaponPropertyRune.shock.Name",
                            text: "PF2E.WeaponPropertyRune.shock.Note.criticalSuccess"
                        }
                    ]),
                    speaker: ChatMessage.getSpeaker(data.speaker)
                });
            }
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-shock"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            const shockDamage = Utils.Roll.extractDamage(data.roll, "greater-shock", true);

            if (shockDamage) {
                const roll = await new (getDamageRollClass())(
                    shockDamage,
                    {},
                    {
                        bypass: {
                            immunity: { ignore: [], downgrade: [], redirect: [] },
                            resistance: { ignore: [{ type: "electricity", max: Infinity }], redirect: [] }
                        }
                    }
                ).evaluate();
                await roll.toMessage({
                    flags: {
                        "pf2e-assistant": { process: false },
                        "pf2e-toolbelt": { targetHelper: { targets: [""] } }
                    },
                    flavor: notesToHTML([
                        {
                            title: "PF2E.WeaponPropertyRune.greaterShock.Name",
                            text: "PF2E.WeaponPropertyRune.greaterShock.Note.criticalSuccess"
                        }
                    ]),
                    speaker: ChatMessage.getSpeaker(data.speaker)
                });
            }
        }
    }
];
