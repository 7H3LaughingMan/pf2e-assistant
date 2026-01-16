import { Assistant } from "assistant.ts";
import { PF2E_FEAT_EFFECTS } from "compendium-packs.ts";

export const path = ["Feats", "Accelerating Touch"];

export const actions: Assistant.Action[] = [
    {
        trigger: "action",
        predicate: ["item:lay-on-hands", "feat:accelerating-touch", { not: "target:mode:undead" }],
        process: async (data: Assistant.Data) => {
            if (!data.item?.isOfType("spell")) return;
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(data.target.actor, PF2E_FEAT_EFFECTS["effect-accelerating-touch"], {
                origin: data.speaker,
                item: data.item,
                target: data.target
            });
        }
    }
];
