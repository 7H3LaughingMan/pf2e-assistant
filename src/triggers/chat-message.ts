import { ActorPF2e, ChatMessagePF2e, ConsumablePF2e, ScenePF2e, TokenDocumentPF2e } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { Module } from "module.ts";
import { Utils } from "utils.ts";

// @ts-expect-error No overload matches this call.
const createChatMessage = Hooks.on("createChatMessage", (chatMessage: ChatMessagePF2e) => {
    if (!chatMessage.isAuthor) return;
    if (chatMessage.getFlag(Module.id, "process") === false) return;

    processChatMessage(chatMessage)
        .then((value) => Promise.all(value.map((data) => game.assistant.storage.process(data))))
        .then((values) =>
            values.reduce((previousValue, currentValue) => {
                return {
                    data: previousValue.data,
                    reroll: Assistant.mergeRerolls(previousValue.reroll, currentValue.reroll)
                };
            })
        )
        .then(({ data, reroll }) => processReroll(data, reroll))
        .catch((reason) => {
            if (import.meta.env.DEV) console.debug(reason);
        });
});

async function processChatMessage(chatMessage: ChatMessagePF2e): Promise<Assistant.Data[]> {
    const chatMessageFlags = chatMessage.flags[game.system.id];

    const data: WithOptional<Assistant.Data, "trigger"> = {
        trigger: chatMessageFlags.context?.type,
        rollOptions: chatMessageFlags.context?.options ? Array.from(chatMessageFlags.context.options) : [],
        chatMessage: chatMessage
    };

    const targets: Assistant.ActorToken[] = [];

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
        targets.push({ actor: chatMessage.target.actor, token: chatMessage.target.token });
    } else {
        const userTargets = Utils.User.getTargets();

        if (data.trigger !== "spell-cast") {
            const userTarget = userTargets[0];

            if (userTarget && userTarget.actor && userTarget.document) {
                targets.push({ actor: userTarget.actor, token: userTarget.document });
            }
        } else {
            for (const userTarget of userTargets) {
                if (userTarget.actor && userTarget.document) {
                    targets.push({ actor: userTarget.actor, token: userTarget.document });
                }
            }
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

    if (data.origin) {
        data.rollOptions.push(...Utils.Actor.getRollOptions(data.origin.actor, "origin"));
        if (data.speaker) {
            const allyOrEnemy = data.origin.actor.alliance === data.speaker.actor.alliance ? "ally" : "enemy";
            data.rollOptions.push(`origin:${allyOrEnemy}`);
        }
    }

    if (data.item) data.rollOptions.push(...data.item.getRollOptions("item"));

    if (data.trigger === undefined) return Promise.reject("Undefined Trigger");

    const dataResults: Assistant.Data[] = [];

    for (const target of targets) {
        const clonedData = foundry.utils.deepClone(data) as Assistant.Data;

        clonedData.target = target;
        clonedData.rollOptions.push(...Utils.Actor.getRollOptions(target.actor, "target"));
        if (clonedData.speaker) {
            const allyOrEnemy = target.actor.alliance === clonedData.speaker.actor.alliance ? "ally" : "enemy";
            clonedData.rollOptions.push(`target:${allyOrEnemy}`);
        }

        clonedData.rollOptions = [...new Set(clonedData.rollOptions)].sort((a, b) => a.localeCompare(b));
        clonedData.domains = [...new Set(clonedData.domains)].sort((a, b) => a.localeCompare(b));

        dataResults.push(clonedData);
    }

    return dataResults;
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
