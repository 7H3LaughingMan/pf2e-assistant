import { AutomationList } from "apps/automation-list.ts";
import ApplicationV2 from "foundry-pf2e/foundry/client/applications/api/application.mjs";

Hooks.once("init", () => {
    game.settings.registerMenu("pf2e-assistant", "automationMenu", {
        name: "Automations",
        label: "Manage Automations",
        hint: "Allows you to manage which automations are enabled/disabled.",
        icon: "fas fa-gears",
        type: AutomationList as ConstructorOf<ApplicationV2>,
        restricted: true
    });

    game.settings.register("pf2e-assistant", "disabledFiles", {
        name: "Disabled Automations",
        scope: "world",
        config: false,
        type: Array,
        default: []
    });

    game.settings.register("pf2e-assistant", "initialized", {
        name: "Initialized",
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });
});
