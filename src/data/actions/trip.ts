import { getDamageRollClass } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";

export const path = ["Actions", "Trip"];

export const actions: Assistant.Action[] = [
    {
        trigger: "skill-check",
        predicate: ["action:trip", "check:outcome:critical-success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.toggleCondition(data.target.actor, "prone", { active: true })) ?? [])
            );

            const showBreakdown = game.pf2e.settings.metagame.breakdowns || !!data.speaker.actor.hasPlayerOwner;
            const roll = await new (getDamageRollClass())("{1d6[bludgeoning]}", {}, { showBreakdown }).evaluate();
            const createdMessage = await roll.toMessage({
                flags: { "pf2e-assistant": { process: false } },
                speaker: ChatMessage.getSpeaker({ actor: data.speaker.actor, token: data.speaker.token })
            });
            reroll.deleteChatMessage.push(createdMessage.uuid);

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:trip", "check:outcome:success"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.toggleCondition(data.target.actor, "prone", { active: true })) ?? [])
            );

            return reroll;
        }
    },
    {
        trigger: "skill-check",
        predicate: ["action:trip", "check:outcome:critical-failure"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            const reroll = Assistant.createReroll();

            reroll.updateCondition.push(
                ...((await game.assistant.socket.toggleCondition(data.speaker.actor, "prone", { active: true })) ?? [])
            );

            return reroll;
        }
    }
];
