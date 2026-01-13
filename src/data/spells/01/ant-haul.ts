import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "effects.js";

export const path = ["Spells", "1st Rank", "Ant Haul"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:ant-haul"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(data.target.actor, PF2E_SPELL_EFFECTS["spell-effect-ant-haul"], {
                origin: data.speaker,
                item: data.item,
                target: data.target
            });
        }
    }
];
