import { Module } from "module.ts";
import { Assistant } from "./assistant.ts";
import "./settings.ts";
import "./triggers/index.ts";
import { Utils } from "./utils.ts";

Hooks.once("ready", async function () {
    game.assistant = {
        socket: new Assistant.Socket(),
        storage: new Assistant.Storage(),
        extractPack: Utils.Macros.extractPack,
        generateReadme: Utils.Macros.generateReadme
    };

    if (game.user.isGM) {
        const module = game.modules.get(Module.id)!;
        const system = module?.relationships.systems.find((system) => system.id === game.system.id);

        if (module && system) {
            if (game.system.version !== system.compatibility.minimum) {
                foundry.ui.notifications.warn(
                    `${module.title} v${module.version} was built for ${game.system.title} v${system.compatibility.minimum}. It appears that you are currently running ${game.system.title} v${game.system.version} which might not be compatible.`
                );
            }
        }

        const useAction = game.macros.find((macro) => macro.name === "Use Action" && macro.type === "script");

        if (!useAction) {
            Macro.create({
                name: "Use Action",
                type: "script",
                img: Utils.System.path("icons/actions/OneAction.webp"),
                scope: "global",
                command: `if (actor === null || token === null) {
    ui.notifications.warn("Missing Actor/Token Information! Make sure you are using this on a character.");
    return;
}

if (scope.item === undefined) {
    ui.notifications.warn("Missing Item Information! Macro must be attached to a action/feat that can be used.");
    return;
}

game.assistant.storage.process({
    trigger: "action",
    rollOptions: [...actor.getRollOptions(), ...scope.item.getRollOptions("action")],
    item: scope.item,
    speaker: { actor: actor, token: token.document }
});`,
                ownership: {
                    default: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
                }
            });
        }
    }
});
