import { MODULE } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";
import moduleJSON from "../module.json" with { type: "json" };
import "./settings.ts";
import "./triggers/index.ts";

MODULE.register(moduleJSON.id);

Hooks.once("ready", async function () {
    game.assistant = {
        socket: new Assistant.Socket(),
        storage: new Assistant.Storage(),
        extractPack: Utils.Macros.extractPack,
        generateReadme: Utils.Macros.generateReadme
    };

    if (game.user.isGM) {
        const module = MODULE.current;
        const system = module?.relationships.systems.find((system) => system.id === game.system.id);

        if (module && system) {
            if (game.system.version !== system.compatibility.minimum) {
                foundry.ui.notifications.warn(
                    `${module.title} v${module.version} was built for ${game.system.title} v${system.compatibility.minimum}. It appears that you are currently running ${game.system.title} v${game.system.version} which might not be compatible.`
                );
            }
        }
    }
});
