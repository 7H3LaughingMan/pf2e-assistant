import { SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import {
    ChatContextFlag,
    ChatMessagePF2e,
    CheckContextChatFlag,
    DamageDamageContextFlag
} from "@7h3laughingman/pf2e-types";
import * as R from "remeda";

export function isConsumable(chatMessage: ChatMessagePF2e): boolean {
    if (!chatMessage.item?.isOfType("consumable")) return false;
    const itemOriginFlag = chatMessage.flags[SYSTEM.id].origin;
    if (!itemOriginFlag) return false;
    return R.isDeepEqual(R.keys(itemOriginFlag), ["sourceId", "uuid", "type"]);
}

export function isCheckContextChatFlag(context?: ChatContextFlag): context is CheckContextChatFlag {
    return (
        R.isNonNullish(context) &&
        [
            "attack-roll",
            "check",
            "counteract-check",
            "flat-check",
            "initiative",
            "perception-check",
            "saving-throw",
            "skill-check"
        ].includes(context.type)
    );
}

export function isDamageDamageContextFlag(context?: ChatContextFlag): context is DamageDamageContextFlag {
    return R.isNonNullish(context) && context.type === "damage-roll";
}

let FAST_HEALING_REGEX: RegExp[];
export function isFastHealing(chatMessage: ChatMessagePF2e): boolean {
    FAST_HEALING_REGEX ??= [
        new RegExp(
            `<div>${game.i18n.localize("PF2E.Encounter.Broadcast.FastHealing.fast-healing.ReceivedMessage")}</div>`
        ),
        new RegExp(
            `<div>${game.i18n.localize("PF2E.Encounter.Broadcast.FastHealing.regeneration.ReceivedMessage")}</div>`
        )
    ];

    return FAST_HEALING_REGEX.some((value) => value.test(chatMessage.flavor));
}

let SHIELD_BLOCK_REGEX: RegExp[];
export function isShieldBlock(chatMessage: ChatMessagePF2e): boolean {
    SHIELD_BLOCK_REGEX ??= [
        new RegExp(
            game.i18n
                .format("PF2E.Actor.ApplyDamage.DamagedForNShield", {
                    actor: "(.*)",
                    absorbedDamage: "([0-9]*)",
                    hpDamage: "([0-9]*)"
                })
                .replace("<actor>", '<span class="target-name">')
                .replace("</actor>", "</span>")
        ),
        new RegExp(
            game.i18n
                .format("PF2E.Actor.ApplyDamage.ShieldAbsorbsAll", {
                    actor: "(.*)",
                    absorbedDamage: "([0-9]*)",
                    hpDamage: "([0-9]*)"
                })
                .replace("<actor>", '<span class="target-name">')
                .replace("</actor>", "</span>")
        )
    ];

    return SHIELD_BLOCK_REGEX.some((value) => value.test(chatMessage.content));
}
