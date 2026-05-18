import { Assistant } from "assistant.ts";

export const path = ["Spells", "1st Rank", "Stabilize"];

export const actions: Assistant.Action[] = [
    {
        trigger: "spell-cast",
        predicate: ["item:stabilize", "target:condition:dying"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!data.item?.isOfType("spell")) return;

            await game.assistant.socket.decreaseCondition(data.target.actor, "dying", { forceRemove: true });

            if (
                !(
                    game.modules.get("xdy-pf2e-workbench")?.active &&
                    game.settings.get("xdy-pf2e-workbench", "giveUnconsciousIfDyingRemovedAt0HP")
                ) &&
                data.target.actor.hitPoints?.value === 0
            ) {
                await game.assistant.socket.toggleCondition(data.target.actor, "unconscious", { active: true });
            }

            if (
                !(
                    game.modules.get("xdy-pf2e-workbench")?.active &&
                    game.settings.get("xdy-pf2e-workbench", "giveWoundedWhenDyingRemoved")
                )
            ) {
                await game.assistant.socket.increaseCondition(data.target.actor, "wounded");
            }
        }
    }
];
