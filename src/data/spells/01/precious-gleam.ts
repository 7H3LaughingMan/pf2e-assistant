import { ChoiceSetRuleElement } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { PF2E_SPELL_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";
import { isRuleElement } from "utils/rules.ts";

export const path = ["Spells", "1st Rank", "Precious Gleam"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:precious-gleam"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_SPELL_EFFECTS["spell-effect-precious-gleam"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.speaker
                }
            );
        }
    },
    {
        trigger: "damage-roll",
        predicate: ["self:effect:precious-gleam"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            const effects = Utils.Actor.getEffects(data.speaker.actor, ["spell-effect-precious-gleam"]);
            for (const effect of effects) {
                const rule = effect.rules.find(
                    (value) => isRuleElement<ChoiceSetRuleElement>(value, "ChoiceSet") && value.flag === "weapon"
                ) as ChoiceSetRuleElement;

                if (rule && rule.selection == data.item?.id) {
                    await game.assistant.socket.deleteEmbeddedItem(effect);
                }
            }
        }
    }
];
