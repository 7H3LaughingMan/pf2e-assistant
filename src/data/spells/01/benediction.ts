import { Assistant } from "assistant.ts";

export const path = ["Spells", "1st Rank", "Benediction"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:benediction"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(data.speaker.actor, PF2E_SPELL_EFFECTS["spell-effect-benediction"], {
                origin: data.speaker,
                item: data.item,
                target: data.speaker
            });
        }
    }
];
