import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "effects.js";
import { Utils } from "utils.ts";

export const path = ["Spells", "4th Rank", "Vital Beacon"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:vital-beacon"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(data.speaker.actor, PF2E_SPELL_EFFECTS["spell-effect-vital-beacon"], {
                origin: data.speaker,
                item: data.item,
                target: data.speaker
            });
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["item:spell-effect-vital-beacon"],
        selectors: ["spell-effect-vital-beacon-inline-healing"],
        process: async (data: Assistant.Data) => {
            if (!data.item?.isOfType("effect")) return;

            const currentValue = data.item.system.badge?.value;

            if (Utils.Remeda.isNonNullish(currentValue) && Utils.Remeda.isNumber(currentValue)) {
                if (currentValue - 1 !== 0) {
                    await game.assistant.socket.updateEmbeddedItem(data.item, {
                        system: { badge: { value: currentValue - 1 } }
                    });
                } else {
                    await game.assistant.socket.deleteEmbeddedItem(data.item);
                }
            }
        }
    }
];
