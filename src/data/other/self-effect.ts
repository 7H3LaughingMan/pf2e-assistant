import { createHTMLElement, htmlQuery } from "@7h3laughingman/pf2e-helpers/utilities";
import { EffectPF2e, EffectSource } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";

export const path = ["Other", "Self-Applied Effects"];

export const actions: Assistant.Action[] = [
    {
        trigger: "self-effect",
        predicate: [],
        process: async (data: Assistant.Data) => {
            if (game.modules.get("pf2e-toolbelt")?.active && game.settings.get("pf2e-toolbelt", "actionable.apply"))
                return;
            if (!data.speaker) return;
            if (!data.item) return;
            if (!data.chatMessage) return;

            const effect =
                data.item.isOfType("action", "feat") && data.item.system.selfEffect
                    ? await fromUuid<EffectPF2e>(data.item.system.selfEffect.uuid)
                    : null;

            if (effect) {
                const traits = data.item.system.traits.value?.filter((t) => t in effect.constructor.validTraits) ?? [];

                const effectSource: EffectSource = foundry.utils.mergeObject(effect.toObject(), {
                    _id: null,
                    system: {
                        context: {
                            origin: {
                                actor: data.speaker.actor.uuid,
                                token: data.speaker.token.uuid,
                                item: data.item.uuid,
                                spellcasting: null,
                                rollOptions: data.item.getOriginData().rollOptions
                            },
                            target: { actor: data.speaker.actor.uuid, token: data.speaker.token.uuid },
                            roll: null
                        },
                        traits: { value: traits }
                    }
                });

                await game.assistant.socket.createEmbeddedItem(data.speaker.actor, effectSource);

                const parsedMessageContent = ((): HTMLElement => {
                    const container = document.createElement("div");
                    container.innerHTML = data.chatMessage.content;
                    return container;
                })();

                const buttons = htmlQuery(parsedMessageContent, ".message-buttons");
                if (buttons) {
                    const span = createHTMLElement("span", { classes: ["effect-applied"] });
                    const anchor = effect.toAnchor({ attrs: { draggable: "true" } });
                    const locKey = "PF2E.Item.Ability.SelfAppliedEffect.Applied";
                    const statement = game.i18n.format(locKey, { effect: anchor.outerHTML });
                    span.innerHTML = statement;
                    htmlQuery(buttons, "button[data-action=apply-effect]")?.replaceWith(span);
                    await data.chatMessage.update({
                        flags: { "pf2e-assistant": { process: false } },
                        content: parsedMessageContent.innerHTML
                    });
                }
            }
        }
    }
];
