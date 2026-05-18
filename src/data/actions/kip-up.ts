import { Assistant } from "assistant.ts";

export const path = ["Actions", "Kip Up"];

export const actions: Assistant.Action[] = [
    {
        trigger: "action",
        predicate: ["action:kip-up"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            if (data.speaker.actor.hasCondition("prone")) {
                await game.assistant.socket.removeCondition(data.speaker.actor, "prone");

                await ChatMessage.create({
                    content:
                        "Stands up from @UUID[Compendium.pf2e.conditionitems.Item.j91X7x0XSomq8d60]{Prone}. This movement doesn't trigger reactions.",
                    flags: { pf2e: {}, "pf2e-assistant": { process: false } },
                    speaker: ChatMessage.getSpeaker(data.speaker)
                });
            }
        }
    }
];
