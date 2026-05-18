import { Assistant } from "assistant.ts";
import * as R from "remeda";

export const path = ["Conditions", "Frightened"];

export const actions: Assistant.Action[] = [
    {
        trigger: "end-turn",
        predicate: ["self:condition:frightened"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;

            if (
                !(
                    game.modules.get("xdy-pf2e-workbench")?.active &&
                    game.settings.get("xdy-pf2e-workbench", "decreaseFrightenedConditionEachTurn")
                )
            ) {
                const conditions = data.speaker.actor.getCondition("frightened", { all: true });
                const maxValue = Math.max(
                    ...conditions.map((item) => (R.isNumber(item.badge?.value) ? item.badge.value : 0))
                );
                const atMax = conditions.filter((item) => maxValue === item.badge?.value);

                if (atMax.some((item) => item.isLocked)) return;
            }
        }
    }
];
