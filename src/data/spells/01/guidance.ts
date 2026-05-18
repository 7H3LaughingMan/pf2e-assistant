import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Guidance"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:guidance"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;

            if (Utils.Actor.hasEffect(data.target.actor, "effect-guidance-immunity")) {
                ui.notifications.warn(`The target is temporarily immune to Guidance.`);
                return;
            }

            await game.assistant.socket.addEffect(data.target.actor, PF2E_SPELL_EFFECTS["spell-effect-guidance"], {
                origin: data.speaker,
                item: data.item,
                target: data.target
            });

            await game.assistant.socket.addEffect(data.target.actor, PF2E_SPELL_EFFECTS["effect-guidance-immunity"], {
                origin: data.speaker,
                item: data.item,
                target: data.target
            });
        }
    }
];
