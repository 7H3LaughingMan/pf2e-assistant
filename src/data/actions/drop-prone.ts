import { Assistant } from "assistant.ts";

export const path = ["Actions", "Drop Prone"];

export const actions: Assistant.Action[] = [
    {
        trigger: "action",
        predicate: ["action:drop-prone"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            if (!data.speaker.actor.hasCondition("prone")) {
                await game.assistant.socket.addCondition(data.speaker.actor, "prone");

                await ChatMessage.create({
                    content: "Falls @UUID[Compendium.pf2e.conditionitems.Item.j91X7x0XSomq8d60]{Prone}.",
                    flags: { pf2e: {}, "pf2e-assistant": { process: false } },
                    speaker: ChatMessage.getSpeaker(data.speaker)
                });
            }
        }
    }
];
