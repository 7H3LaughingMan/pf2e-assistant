import { htmlQueryAll } from "@7h3laughingman/pf2e-helpers/utilities";
import { ChatMessagePF2e } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";

Hooks.on("renderChatMessageHTML", function (message: ChatMessagePF2e, html: HTMLElement) {
    for (const button of htmlQueryAll<HTMLButtonElement>(html, "button[data-action]")) {
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
            rollOptions: [`choice:${button.value}`]
        };

        if (message.actor && message.token) {
            data.speaker = {
                actor: message.actor,
                token: message.token
            };
        }

        if (message.target?.actor && message.target?.token) {
            data.target = message.target;
        }

        if (message.item) {
            data.item = message.item;
            data.rollOptions.push(...message.item.getRollOptions("item"));
        }

        game.assistant.storage.process(data);
        game.assistant.socket.deleteChatMessage(message);
    }
}
