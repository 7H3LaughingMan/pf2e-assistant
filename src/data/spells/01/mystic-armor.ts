import { Assistant } from "assistant.ts";

export const path = ["Spells", "1st Rank", "Mystic Armor"];

export const actions: Assistant.Action[] = [
    {
        trigger: "action",
        predicate: ["item:slug:mystic-armor"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.speaker.actor,
                PF2E_SPELL_EFFECTS["spell-effect-mystic-armor"],
                { origin: data.speaker, item: data.item, target: data.speaker }
            );
        }
    }
];
