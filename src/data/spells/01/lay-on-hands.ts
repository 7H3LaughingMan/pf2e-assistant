import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";

export const path = ["Spells", "1st Rank", "Lay on Hands"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["item:lay-on-hands", "target:ally", { not: "target:mode:undead" }],
        process: async (data: Assistant.Data) => {
            if (!data.item?.isOfType("spell")) return;
            if (!data.item.damageKinds.has("healing")) return;
            if (!data.speaker) return;
            if (!data.target) return;
            if (data.speaker.actor.signature === data.target.actor.signature) return;

            await game.assistant.socket.addEffect(data.target.actor, PF2E_SPELL_EFFECTS["spell-effect-lay-on-hands"], {
                origin: data.speaker,
                item: data.item,
                target: data.target
            });
        }
    }
];
