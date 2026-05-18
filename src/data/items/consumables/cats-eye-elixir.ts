import { Assistant } from "assistant.ts";
import { PF2E_CONDITIONS } from "compendium-packs.ts";
import { Utils } from "utils.ts";
import { ModifyFlatDCRuleElementSource, TreatAsRuleElementSource } from "utils/rules.ts";

export const path = ["Items", "Consumables", "Cat's Eye Elixir"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:cats-eye-elixir"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.item?.isOfType("consumable")) return;

            const target = data.target ?? data.speaker;

            await game.assistant.socket.createEmbeddedItem(target.actor, {
                name: "Effect: Cat's Eye Elixir",
                type: "effect",
                system: {
                    description: {
                        value: `<p>For the next minute, you reduce the flat check to target @UUID[${PF2E_CONDITIONS["hidden"]}]{Hidden} creatures to @Check[flat|showDC:all|dc:5], and you don't need to attempt a flat check to target @UUID[${PF2E_CONDITIONS["concealed"]}]{Concealed} creatures. These benefits apply only against creatures within 30 feet of you.</p>`
                    },
                    rules: game.modules.get("pf2e-flatcheck-helper")?.active
                        ? [
                              {
                                  key: "fc-ModifyFlatDC",
                                  type: "hidden",
                                  mode: "override",
                                  value: 5,
                                  predicate: [{ lte: ["target:distance", 30] }]
                              } as ModifyFlatDCRuleElementSource,
                              {
                                  key: "fc-TreatAs",
                                  condition: "concealed",
                                  treatAs: "observed",
                                  mode: "downgrade",
                                  predicate: [{ lte: ["target:distance", 30] }]
                              } as TreatAsRuleElementSource
                          ]
                        : [],
                    slug: "effect-mistform-elixir-greater",
                    publication: {
                        title: "Pathfinder GM Core",
                        license: "ORC",
                        remaster: true
                    },
                    level: {
                        value: 2
                    },
                    duration: {
                        value: 1,
                        unit: "minutes",
                        expiry: "turn-start",
                        sustained: false
                    },
                    context: {
                        origin: {
                            actor: data.speaker.actor.uuid,
                            token: data.speaker.token.uuid,
                            item: data.item.uuid,
                            rollOptions: Utils.RollOptions.getOriginRollOptions(data.speaker.actor, data.item)
                        },
                        target: {
                            actor: target.actor.uuid,
                            token: target.token.uuid
                        }
                    }
                },
                img: "icons/consumables/potions/potion-tube-corked-glowing-red.webp"
            });
        }
    }
];
