import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

export const path = ["Spells", "1st Rank", "Precious Gleam"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:precious-gleam"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (data.targets.length !== 1) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.targets[0].actor,
                PF2E_SPELL_EFFECTS["spell-effect-precious-gleam"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.speaker
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["self:effect:precious-gleam"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            const effects = Utils.Actor.getEffects(data.speaker.actor, ["spell-effect-precious-gleam"]);
            for (const effect of effects) {
                if (Utils.Rules.getChoiceSetSelect(effect._source, { flag: "weapon" }) === data.item?.id)
                    await game.assistant.socket.deleteEmbeddedItem(effect);
            }
        }
    }
];
