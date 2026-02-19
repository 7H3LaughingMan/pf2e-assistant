import { isRolledDamageRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";

export const path = ["Other", "Persistent Healing"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["condition:fast-healing"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.speaker) return;
            if (!isRolledDamageRoll(data.roll)) return;

            if (
                !(
                    game.modules.get("xdy-pf2e-workbench")?.active &&
                    game.settings.get("xdy-pf2e-workbench", "applyPersistentHealing")
                )
            ) {
                await data.speaker.actor.applyDamage({
                    damage: -(data.roll.total ?? 0),
                    token: data.speaker.token,
                    rollOptions: new Set([...data.speaker.actor.getSelfRollOptions()]),
                    skipIWR: true
                });
            }
        }
    }
];
