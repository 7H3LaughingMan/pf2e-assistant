import { Assistant } from "assistant.ts";
import { PF2E_ASSISTANT_EFFECTS } from "effects.ts";

export const path = ["Critical Specializations", "Spear"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "critical-specialization", "item:group:spear"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-critical-specialization-spear"],
                {
                    origin: data.speaker,
                    target: data.target
                }
            );
        }
    }
];
