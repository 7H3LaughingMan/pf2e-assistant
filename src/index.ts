import { Assistant } from "assistant.ts";
import "./settings.ts";
import "./triggers/index.ts";

Hooks.once("ready", async function () {
    Object.assign(game, { assistant: { socket: new Assistant.Socket(), storage: new Assistant.Storage() } });

    if (game.user.isGM) {
        const module = game.modules.get("pf2e-assistant");
        const system = module?.relationships.systems.find((system) => system.id === game.system.id);

        if (module && system) {
            if (game.system.version !== system.compatibility.minimum) {
                foundry.ui.notifications.warn(
                    `${module.title} v${module.version} was built for ${game.system.title} v${system.compatibility.minimum}. It appears that you are currently running ${game.system.title} v${game.system.version} which might not be compatible.`
                );
            }
        }
    }

    foundry.ui.notifications.info("Hello World!");
});
