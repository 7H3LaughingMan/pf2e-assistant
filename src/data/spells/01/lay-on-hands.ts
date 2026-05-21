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
            if (data.targets.length !== 1) return;
            if (data.speaker.actor.signature === data.targets[0].actor.signature) return;

            await game.assistant.socket.addEffect(
                data.targets[0].actor,
                PF2E_SPELL_EFFECTS["spell-effect-lay-on-hands"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.targets[0]
                }
            );
        }
    }
];
