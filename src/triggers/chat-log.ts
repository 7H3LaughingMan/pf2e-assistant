import { ChatMessagePF2e } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

// @ts-expect-error No overload matches this call.
Hooks.on("renderChatMessageHTML", function (message: ChatMessagePF2e, html: HTMLElement) {
    for (const button of Utils.HTML.htmlQueryAll<HTMLButtonElement>(html, "button[data-action]")) {
        button.addEventListener("click", async (event) => onClickButton(message, event, html, button));
    }
});

async function onClickButton(
    message: ChatMessagePF2e,
    _event: MouseEvent,
    _html: HTMLElement,
    button: HTMLButtonElement
) {
    if (button.dataset.action === "choice") {
        const data: Assistant.Data = {
            trigger: "choice",
            rollOptions: [`choice:${button.value}`],
            targets: []
        };

        if (message.actor && message.token) {
            data.speaker = {
                actor: message.actor,
                token: message.token
            };
        }

        if (message.target?.actor && message.target?.token) {
            data.targets.push(message.target);
        }

        if (message.item) {
            data.item = message.item;
            data.rollOptions.push(...message.item.getRollOptions("item"));
        }

        game.assistant.storage.process(data);
        game.assistant.socket.deleteChatMessage(message);
    }
}
