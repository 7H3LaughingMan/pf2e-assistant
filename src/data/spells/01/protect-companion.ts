import { Assistant } from "assistant.ts";

export const path = ["Spells", "1st Rank", "Protect Companion"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:protect-companion"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_SPELL_EFFECTS["spell-effect-protect-companion"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.target
                }
            );
        }
    }
];
