import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

import { Utils } from "utils.ts";

export const path = ["Consumables", "Shining Ammunition"];

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
            if (!Utils.Roll.isCheckRoll(data.roll)) return;

            await game.assistant.socket.addEffect(
                data.target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-shining-ammunition"],
                { origin: data.speaker, item: data.item, target: data.target, roll: data.roll }
            );
        }
    }
];
