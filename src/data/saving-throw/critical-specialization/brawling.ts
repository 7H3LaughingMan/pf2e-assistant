import { AssistantAction } from "action.ts";
import { EffectSource } from "foundry-pf2e";
import { AssistantMessage } from "message.ts";
import { Utils } from "utils.ts";

export const actions: AssistantAction[] = [
    {
        trigger: "saving-throw",
        predicate: [
            {
                or: ["check:outcome:failure", "check:outcome:critical-failure"],
            },
            "critical-specialization",
            "item:group:brawling",
        ],
        process: async (message: AssistantMessage) => {
            if (!message.speaker?.actor) return;
            if (!message.origin?.actor) return;
            if (!Utils.isInstanceOf(message.roll, "CheckRoll")) return;

            game.assistant.socket.addEmbeddedItem(
                message.speaker.actor,
                "Compendium.pf2e-assistant.pf2e-assistant-effects.Item.iSaDovIXZCJNPOOj",
                {
                    _id: null,
                    system: {
                        context: {
                            origin: {
                                actor: message.origin.actor.uuid,
                                token: message.origin.token?.uuid ?? null,
                                item: null,
                                spellcasting: null,
                            },
                            target: {
                                actor: message.speaker.actor.uuid,
                                token: message.speaker.token?.uuid ?? null,
                            },
                            roll: {
                                degreeOfSuccess: message.roll?.degreeOfSuccess,
                                total: message.roll?.total ?? null,
                            },
                        },
                    },
                } as EffectSource,
            );
        },
    },
];
