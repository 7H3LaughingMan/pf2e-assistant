import { Assistant } from "assistant.ts";
import { EffectSource } from "foundry-pf2e";

export const path = ["Consumables", "Blood Booster"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consume",
        predicate: [
            {
                or: [
                    "consumable:blood-booster-lesser",
                    "consumable:blood-booster-moderate",
                    "consumable:blood-booster-greater",
                ],
            },
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target?.actor ?? data.speaker.actor;

            game.assistant.socket.addEmbeddedItem(target, "Compendium.pf2e.equipment-effects.Item.LfhCO3rP5ImzPyNY", {
                _id: null,
                system: {
                    context: {
                        origin: {
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token?.uuid ?? null,
                            item: data.item?.uuid ?? null,
                            spellcasting: null,
                            rollOptions: data.item?.getOriginData().rollOptions ?? [],
                        },
                        target: null,
                        roll: null,
                    },
                },
            } as EffectSource);
        },
    },
];
