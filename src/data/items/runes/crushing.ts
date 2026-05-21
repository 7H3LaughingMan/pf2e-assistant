import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Items", "Runes", "Crushing"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:crushing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (data.targets.length !== 1) return;
            if (!Utils.Roll.isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.addEffect(data.targets[0].actor, PF2E_EQUIPMENT_EFFECTS["effect-crushing"], {
                origin: data.speaker,
                target: data.targets[0]
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-crushing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (data.targets.length !== 1) return;
            if (!Utils.Roll.isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.addEffect(
                data.targets[0].actor,
                PF2E_EQUIPMENT_EFFECTS["effect-crushing-greater"],
                {
                    origin: data.speaker,
                    target: data.targets[0]
                }
            );
        }
    }
];
