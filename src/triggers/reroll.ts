import { ChatMessagePF2e, Check } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import * as R from "remeda";
import { Utils } from "utils.ts";

interface RerollOptions {
    resource?: string;
    keep?: "new" | "higher" | "lower";
}

Hooks.once("ready", async () => {
    libWrapper.register<Check, typeof Check.rerollFromMessage>(
        "pf2e-assistant",
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

            if (!Utils.ChatMessage.isCheckContextChatFlag(message.flags.pf2e.context)) return;

            const reroll = R.prop(message.flags, "pf2e-assistant", "reroll") as Maybe<Record<string, Assistant.Reroll>>;
            if (R.isNonNullish(reroll) && message.token !== null) {
                await Assistant.processReroll(reroll[message.token.id]);
            }
        },
        "LISTENER"
    );
});
