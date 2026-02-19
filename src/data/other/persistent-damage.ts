import { isRolledDamageRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { ActorPF2e, ConditionPF2e } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";

export const path = ["Other", "Persistent Damage"];

export const actions: Assistant.Action[] = [
    {
        trigger: "damage-roll",
        predicate: ["condition:persistent-damage"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.speaker) return;
            if (!data.item?.isOfType("condition")) return;
            if (!data.item.parent) return;
            if (!isRolledDamageRoll(data.roll)) return;

            if (
                !(
                    game.modules.get("xdy-pf2e-workbench")?.active &&
                    game.settings.get("xdy-pf2e-workbench", "applyPersistentDamage")
                )
            ) {
                await data.speaker.actor.applyDamage({
                    damage: data.roll,
                    token: data.speaker.token,
                    item: data.item as ConditionPF2e<ActorPF2e>,
                    rollOptions: new Set([
                        ...data.item.getRollOptions("item"),
                        ...data.speaker.actor.getSelfRollOptions()
                    ]),
                    skipIWR: false
                });
            }

            if (
                !(
                    game.modules.get("xdy-pf2e-workbench")?.active &&
                    game.settings.get("xdy-pf2e-workbench", "applyPersistentDamageRecoveryRoll")
                )
            ) {
                await data.item.rollRecovery();
            }
        }
    }
];
