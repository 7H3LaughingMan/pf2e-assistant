import { getDamageRollClass, isRolledDamageRoll, notesToHTML } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Critical Specializations", "Axe"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:axe",
            { not: "item:rune:property:grievous" }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            const axeDamage = Utils.Roll.extractBaseDamage(data.roll, false);

            if (axeDamage) {
                const roll = await new (getDamageRollClass())(axeDamage).evaluate();
                await roll.toMessage({
                    flags: {
                        "pf2e-assistant": { process: false },
                        "pf2e-toolbelt": { targetHelper: { targets: [""] } }
                    },
                    flavor: notesToHTML([
                        {
                            title: "PF2E.Actor.Creature.CriticalSpecialization",
                            text: "PF2E.Item.Weapon.CriticalSpecialization.axe"
                        }
                    ]),
                    speaker: ChatMessage.getSpeaker(data.speaker)
                });
            }
        }
    },
    {
        trigger: "damage-roll",
        predicate: [
            "check:outcome:critical-success",
            "critical-specialization",
            "item:group:axe",
            "item:rune:property:grievous"
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            const axeDamage = Utils.Roll.extractBaseDamage(data.roll, false);

            if (axeDamage) {
                const roll = await new (getDamageRollClass())(axeDamage).evaluate();
                await roll.toMessage({
                    flags: {
                        "pf2e-assistant": { process: false },
                        "pf2e-toolbelt": { targetHelper: { targets: [""] } }
                    },
                    flavor: notesToHTML([
                        {
                            title: "PF2E.Actor.Creature.CriticalSpecialization",
                            text: "PF2E.Item.Weapon.CriticalSpecialization.axe"
                        },
                        {
                            title: "PF2E.WeaponPropertyRune.grievous.Name",
                            text: "PF2E.WeaponPropertyRune.grievous.Note.Axe"
                        }
                    ]),
                    speaker: ChatMessage.getSpeaker(data.speaker)
                });
            }
        }
    }
];
