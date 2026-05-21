import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "compendium-packs.ts";
import { Utils } from "utils.ts";

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
            if (data.targets.length !== 1) return;
            if (!Utils.Roll.isRolledCheckRoll(data.roll)) return;

            await game.assistant.socket.addEffect(
                data.targets[0].actor,
                PF2E_EQUIPMENT_EFFECTS["effect-shining-ammunition"],
                {
                    origin: data.speaker,
                    item: data.item,
                    target: data.targets[0],
                    roll: { total: data.roll.total, degreeOfSuccess: data.roll.degreeOfSuccess }
                }
            );
        }
    }
];
