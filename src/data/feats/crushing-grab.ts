import { getDamageRollClass, isRolledCheckRoll, notesToHTML } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";
import { PF2E_ACTIONS } from "compendium-packs.ts";

export const path = ["Feats", "Crushing Grab"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: [
            "action:grapple",
            "feat:crushing-grab",
            { or: ["check:outcome:success", "check:outcome:critical-success"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledCheckRoll(data.roll)) return;

            const roll = await new (getDamageRollClass())(
                `{${data.speaker.actor.abilities?.str.mod ?? 0}[bludgeoning]}`
            ).evaluate();

            await roll.toMessage({
                flags: {
                    "pf2e-assistant": { process: false },
                    "pf2e-toolbelt": { targetHelper: { targets: [data.target.token.uuid] } }
                },
                flavor: notesToHTML([
                    {
                        title: "Crushing Grab",
                        text: `Like a powerful constrictor, you crush targets in your unyielding grasp. When you successfully @UUID[${PF2E_ACTIONS["grapple"]}] a creature, you can deal bludgeoning damage to that creature equal to your Strength modifier. You can make this attack nonlethal with no penalty.`
                    }
                ]),
                speaker: ChatMessage.getSpeaker(data.speaker)
            });
        }
    }
];
