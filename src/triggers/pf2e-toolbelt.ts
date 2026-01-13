import { Assistant } from "assistant.ts";
import {
    ChatMessagePF2e,
    CheckRoll,
    DegreeAdjustmentAmount,
    DegreeOfSuccessString,
    RollNoteSource,
    SaveType,
    TokenDocumentPF2e
} from "foundry-pf2e";
import { Rolled } from "foundry-pf2e/foundry/client/dice/_module.mjs";
import { Utils } from "utils.ts";

type SaveRollData = {
    die: number;
    dosAdjustments?: Record<string, { label: string; amount: DegreeAdjustmentAmount }>;
    modifiers: { label: string; modifier: number }[];
    notes: RollNoteSource[];
    private: boolean;
    rerolled?: "hero" | "new" | "lower" | "higher";
    roll: string;
    significantModifiers?: {
        appliedTo: "roll" | "dc";
        name: string;
        significance: "ESSENTIAL" | "HELPFUL" | "NONE" | "HARMFUL" | "DETRIMENTAL";
        value: number;
    }[];
    statistic: SaveType;
    success: DegreeOfSuccessString;
    unadjustedOutcome?: DegreeOfSuccessString | null;
    value: number;
};

type RollSaveHook = {
    roll: Rolled<CheckRoll>;
    message: ChatMessagePF2e;
    rollMessage: ChatMessagePF2e;
    target: TokenDocumentPF2e;
    data: SaveRollData;
};

type RerollSaveHook = {
    oldRoll: Rolled<CheckRoll>;
    newRoll: Rolled<CheckRoll>;
    keptRoll: Rolled<CheckRoll>;
    message: ChatMessagePF2e;
    target: TokenDocumentPF2e;
    data: SaveRollData;
};

Hooks.on("pf2e-toolbelt.rollSave", function (args: RollSaveHook) {
    processToolbelt(args.message, args.roll, args.target, args.data)
        .then((value) => game.assistant.storage.process(value))
        .then((value) => processReroll(value.data, value.reroll));
});

Hooks.on("pf2e-toolbelt.rerollSave", function (args: RerollSaveHook) {
    const reroll = args.message.flags["pf2e-assistant"]?.reroll;
    if (reroll !== undefined) {
        Assistant.processReroll(reroll[args.target.id])
            .then(() => processToolbelt(args.message, args.keptRoll, args.target, args.data))
            .then((value) => game.assistant.storage.process(value))
            .then((value) => processReroll(value.data, value.reroll));
    } else {
        processToolbelt(args.message, args.keptRoll, args.target, args.data)
            .then((value) => game.assistant.storage.process(value))
            .then((value) => processReroll(value.data, value.reroll));
    }
});

async function processToolbelt(
    message: ChatMessagePF2e,
    roll: Rolled<CheckRoll>,
    target: TokenDocumentPF2e,
    targetSave: SaveRollData
): Promise<Assistant.Data> {
    const data: Assistant.Data = {
        trigger: "saving-throw",
        rollOptions: [`check:outcome:${game.pf2e.system.sluggify(targetSave.success)}`],
        chatMessage: message,
        roll: roll
    };

    if (message.item) {
        data.item = message.item;
    }

    if (message.actor && message.token) {
        data.origin = {
            actor: message.actor,
            token: message.token
        };
    }

    if (Assistant.isValidToken(target) && target.actor) {
        data.speaker = {
            actor: target.actor,
            token: target
        };
    }

    if (data.speaker) data.rollOptions.push(...Utils.Actor.getRollOptions(data.speaker.actor, "self"));

    if (data.origin) {
        data.rollOptions.push(...Utils.Actor.getRollOptions(data.origin.actor, "origin"));
        if (data.speaker) {
            const allyOrEnemy = data.origin.actor.alliance === data.speaker.actor.alliance ? "ally" : "enemy";
            data.rollOptions.push(`origin:${allyOrEnemy}`);
        }
    }

    if (data.item) data.rollOptions.push(...data.item.getRollOptions("item"));

    return data;
}

async function processReroll(data: Assistant.Data, reroll: Assistant.Reroll) {
    if (data.chatMessage && data.speaker && Object.values(reroll).some((value) => value.length !== 0)) {
        await data.chatMessage.update({
            flags: {
                "pf2e-assistant": {
                    reroll: {
                        [data.speaker.token.id]: reroll
                    }
                }
            }
        });
    }
}
