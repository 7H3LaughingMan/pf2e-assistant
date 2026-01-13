import { Assistant } from "assistant.ts";
import { ChatMessagePF2e, Check } from "foundry-pf2e";
import { Utils } from "utils.ts";
import module from "../../module.json" with { type: "json" };

interface RerollOptions {
    resource?: string;
    keep?: "new" | "higher" | "lower";
}

Hooks.once("ready", async () => {
    libWrapper.register<Check, typeof Check.rerollFromMessage>(
        module.id,
        "game.pf2e.Check.rerollFromMessage",
        async function (this: Check, message: ChatMessagePF2e, options: RerollOptions = {}) {
            if (!(message.isAuthor || game.user.isGM)) return;

            const actor = message.actor;
            if (!actor) return;

            const rerollingActor = actor.isOfType("familiar") ? actor.master : actor;
            const resourceKey = options.resource;
            const resource = rerollingActor?.getResource(resourceKey ?? "");

            if (resource) {
                if (rerollingActor?.isOfType("character")) {
                    if (resource && resource.value == 0) return;
                }
            }

            if (!Utils.ChatMessage.isCheckContextFlag(message.flags.pf2e.context)) return;

            const reroll = message.flags["pf2e-assistant"]?.reroll as Record<string, Assistant.Reroll>;
            if (reroll !== undefined && message.token !== null) {
                await Assistant.processReroll(reroll[message.token.id]);
            }
        },
        "LISTENER"
    );
});
