import { Assistant } from "assistant.ts";
import { PF2E_EQUIPMENT_EFFECTS } from "effects.js";

export const path = ["Consumables", "Fury Cocktail"];

export const actions: Assistant.Action[] = [
    {
        trigger: "consumable",
        predicate: ["item:fury-cocktail-lesser"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(target.actor, PF2E_EQUIPMENT_EFFECTS["effect-fury-cocktail-lesser"], {
                origin: data.speaker,
                item: data.item,
                target: target
            });
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:fury-cocktail-moderate"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-fury-cocktail-moderate"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    },
    {
        trigger: "consumable",
        predicate: ["item:fury-cocktail-greater"],
        process: async (data: Assistant.Data) => {
            if (!data.speaker) return;
            const target = data.target ?? data.speaker;

            await game.assistant.socket.addEffect(
                target.actor,
                PF2E_EQUIPMENT_EFFECTS["effect-fury-cocktail-greater"],
                { origin: data.speaker, item: data.item, target: target }
            );
        }
    }
];
