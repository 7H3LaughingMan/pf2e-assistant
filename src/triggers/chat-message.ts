import { getTargets, MODULE, SYSTEM } from "@7h3laughingman/pf2e-helpers/utilities";
import { ActorPF2e, ChatMessagePF2e, ConsumablePF2e, ScenePF2e, TokenDocumentPF2e } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

const createChatMessage = Hooks.on("createChatMessage", function (chatMessage: ChatMessagePF2e) {
    if (!chatMessage.isAuthor) return;
    if (chatMessage.getFlag(MODULE.id, "process") === false) return;

    processChatMessage(chatMessage)
        .then((data) => game.assistant.storage.process(data))
        .then(({ data, reroll }) => processReroll(data, reroll));
});

async function processChatMessage(chatMessage: ChatMessagePF2e): Promise<Assistant.Data> {
    const chatMessageFlags = chatMessage.flags[SYSTEM.id];

    const data: WithOptional<Assistant.Data, "trigger"> = {
        trigger: chatMessageFlags.context?.type,
        rollOptions: chatMessageFlags.context?.options ? Array.from(chatMessageFlags.context.options) : [],
        chatMessage: chatMessage
    };

    if (chatMessageFlags.context?.domains) {
        data.domains = chatMessageFlags.context.domains;
    }

    if (data.trigger === undefined) {
        if (chatMessage.item?.isOfType("condition") && chatMessage.item.slug === "persistent-damage") {
            data.trigger = "damage-roll";
        } else if (chatMessage.item?.isOfType("spell")) {
            data.trigger = "spell-cast";
        } else if (Utils.ChatMessage.isConsumable(chatMessage)) {
            const item = await fromUuid<ConsumablePF2e>(chatMessageFlags.origin!.uuid);
            data.trigger = "consumable";
            data.item = item ?? undefined;
        } else if (chatMessage.isDamageRoll && Utils.ChatMessage.isFastHealing(chatMessage)) {
            data.trigger = "damage-roll";
            data.rollOptions.push("self:condition:fast-healing");
        }
    }

    if (data.trigger === "damage-taken" && Utils.ChatMessage.isShieldBlock(chatMessage)) {
        data.rollOptions.push("self:shield:block");
    }

    if (chatMessage.item) {
        data.item = chatMessage.item;
    }

    const outcome = chatMessageFlags.context?.outcome;
    if (outcome) data.rollOptions.push(`check:outcome:${game.pf2e.system.sluggify(outcome)}`);

    if (chatMessage.actor && chatMessage.token) {
        data.speaker = { actor: chatMessage.actor, token: chatMessage.token };
    }

    if (chatMessage.target) {
        data.target = { actor: chatMessage.target.actor, token: chatMessage.target.token };
    } else {
        const target = getTargets()[0];

        if (target && target.actor) {
            data.target = { actor: target.actor, token: target.document };
        }
    }

    if (Utils.ChatMessage.isCheckContextChatFlag(chatMessageFlags.context)) {
        const checkContext = chatMessageFlags.context;

        if (checkContext.origin) {
            const actor = fromUuidSync<ActorPF2e>(checkContext.origin.actor);
            const token = fromUuidSync<TokenDocumentPF2e<ScenePF2e>>(checkContext.origin.token ?? "");

            if (actor && token) {
                data.origin = { actor, token };
            }
        }
    }

    if (chatMessage.isCheckRoll || chatMessage.isDamageRoll) {
        data.roll = chatMessage.rolls.at(0);
    }

    if (data.speaker) data.rollOptions.push(...Utils.Actor.getRollOptions(data.speaker.actor, "self"));

    if (data.target) {
        data.rollOptions.push(...Utils.Actor.getRollOptions(data.target.actor, "target"));
        if (data.speaker) {
            const allyOrEnemy = data.target.actor.alliance === data.speaker.actor.alliance ? "ally" : "enemy";
            data.rollOptions.push(`target:${allyOrEnemy}`);
        }
    }

    if (data.origin) {
        data.rollOptions.push(...Utils.Actor.getRollOptions(data.origin.actor, "origin"));
        if (data.speaker) {
            const allyOrEnemy = data.origin.actor.alliance === data.speaker.actor.alliance ? "ally" : "enemy";
            data.rollOptions.push(`origin:${allyOrEnemy}`);
        }
    }

    if (data.item) data.rollOptions.push(...data.item.getRollOptions("item"));

    data.rollOptions.sort((a, b) => a.localeCompare(b));

    if (data.trigger === undefined) return Promise.reject("Undefined Trigger");

    return data as Assistant.Data;
}

async function processReroll(data: Assistant.Data, reroll: Assistant.Reroll) {
    if (data.chatMessage && data.speaker && Object.values(reroll).some((value) => value.length !== 0)) {
        await game.assistant.socket.updateChatMessage(data.chatMessage, data.speaker.token.id, reroll);
    }
}

if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
        Hooks.off("createChatMessage", createChatMessage);
    });
}
