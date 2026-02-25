import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export const path = ["Class Features", "Champion", "Champion's Reaction"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-taken",
        predicate: ["self:effect:champions-resistance"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            await game.assistant.socket.deleteEmbeddedItems(
                Utils.Actor.getEffects(data.speaker.actor, ["effect-champions-resistance"])
            );
        }
    }
];
