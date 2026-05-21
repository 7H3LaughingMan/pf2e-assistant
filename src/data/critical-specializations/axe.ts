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
            if (data.targets.length !== 1) return;
            if (!Utils.Item.isWeapon(data.item)) return;
            if (!Utils.Roll.isRolledDamageRoll(data.roll)) return;

            const validTargets = Utils.Scene.getTokens(data.targets[0].token.scene, {
                enemyOf: data.speaker.actor,
                adjacentTo: data.targets[0].token,
                distanceTo: {
                    target: data.speaker.token,
                    distance: data.speaker.actor.getReach({ action: "attack", weapon: data.item })
                },
                predicate: (token) => token.uuid !== data.targets[0]?.token.uuid
            });

            if (validTargets.length === 0) return;

            const axeDamage = Utils.Roll.extractBaseDamage(data.roll, false);

            if (axeDamage) {
                const roll = await new (Utils.Roll.getDamageRollClass())(axeDamage).evaluate();
                await roll.toMessage({
                    flags: {
                        "pf2e-assistant": { process: false },
                        "pf2e-toolbelt": { targetHelper: { targets: [] } }
                    },
                    flavor: Utils.Notes.notesToHTML([
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
            if (data.targets.length !== 1) return;
            if (!Utils.Item.isWeapon(data.item)) return;
            if (!Utils.Roll.isRolledDamageRoll(data.roll)) return;

            const validTargets = Utils.Scene.getTokens(data.targets[0].token.scene, {
                enemyOf: data.speaker.actor,
                adjacentTo: data.targets[0].token,
                distanceTo: {
                    target: data.speaker.token,
                    distance: data.speaker.actor.getReach({ action: "attack", weapon: data.item })
                },
                predicate: (token) => token.uuid !== data.targets[0]?.token.uuid
            });

            if (validTargets.length === 0) return;

            const axeDamage = Utils.Roll.extractBaseDamage(data.roll, false);

            if (axeDamage) {
                const roll = await new (Utils.Roll.getDamageRollClass())(axeDamage).evaluate();
                await roll.toMessage({
                    flags: {
                        "pf2e-assistant": { process: false },
                        "pf2e-toolbelt": { targetHelper: { targets: [] } }
                    },
                    flavor: Utils.Notes.notesToHTML([
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
