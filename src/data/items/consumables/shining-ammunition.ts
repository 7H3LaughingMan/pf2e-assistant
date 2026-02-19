import { isRolledCheckRoll } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";

export const path = ["Items", "Consumables", "Shining Ammunition"];

export const actions: Assistant.Action[] = [
    {
        trigger: "attack-roll",
        predicate: [
            "item:ammo:slug:shining-ammunition",
            { or: ["check:outcome:critical-success", "check:outcome:success"] }
        ],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            if (!data.target) return;
            if (!isRolledCheckRoll(data.roll)) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-shining-ammunition"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.target,
                    roll: { total: data.roll.total, degreeOfSuccess: data.roll.degreeOfSuccess }
                }
            );
        }
    }
];
