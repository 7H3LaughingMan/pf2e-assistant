import { isRolledDamageRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Runes", "Crushing"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:crushing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.addEffect(data.target.actor, PF2E_EQUIPMENT_EFFECTS["effect-crushing"], {
                origin: data.speaker,
                target: data.target
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "item:rune:property:greater-crushing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledDamageRoll(data.roll)) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-crushing-greater"],
                {
                    origin: data.speaker,
                    target: data.target
                }
            );
        }
    }
];
