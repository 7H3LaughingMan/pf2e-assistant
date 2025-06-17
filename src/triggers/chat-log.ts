import { Assistant } from "assistant.ts";
import { ChatMessagePF2e } from "foundry-pf2e";
import { htmlQueryAll } from "utils/dom.ts";

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
        let data: Assistant.Data = {
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
