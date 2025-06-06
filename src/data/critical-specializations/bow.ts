import { Assistant } from "assistant.ts";

export const path = ["Critical Specializations", "Bow"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["check:outcome:critical-success", "critical-specialization", "item:group:bow"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_ASSISTANT_EFFECTS["effect-critical-specialization-bow"],
                { origin: data.speaker, target: data.target }
            );
        }
    }
];
