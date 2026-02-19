import { MODULE } from "@7h3laughingman/pf2e-helpers/utilities";
import { Assistant } from "assistant.ts";
import * as R from "remeda";

export class Storage {
    #actions: Assistant.Action[] = [];
    #rootFolder: Assistant.Folder = { label: "Root", children: [], entries: [] };
    #disabledFiles = game.settings.get("pf2e-assistant", "disabledFiles");

    constructor() {
        const modules = import.meta.glob<Assistant.Module>("../data/**/*.ts");

        for (const path in modules) {
            modules[path]().then((module) => {
                this.addModule(module, path);
            });
        }
    }

    reset() {
        this.#actions = [];
        this.#rootFolder = { label: "Root", children: [], entries: [] };
        this.#disabledFiles = game.settings.get("pf2e-assistant", "disabledFiles");
    }

    addModule(module: Assistant.Module, path: string) {
        Storage.addFile(this.#rootFolder, module.path, path, !this.#disabledFiles.includes(path));
        if (!this.#disabledFiles.includes(path)) {
            this.#actions.push(...module.actions);
        }
    }

    private static addFile(folder: Assistant.Folder, path: string[], value: string, enabled: boolean) {
        if (path.length > 1) {
            let subFolder = folder.children.find((child) => child.label === path[0]);

            if (!subFolder) {
                subFolder = { label: path[0], children: [], entries: [] };
                const sortedIndex = R.sortedIndexBy(folder.children, subFolder, R.prop("label"));
                folder.children.splice(sortedIndex, 0, subFolder);
            }

            Storage.addFile(subFolder, path.slice(1), value, enabled);
        } else if (path.length == 1) {
            const entry = { enabled, label: path[0], value };
            const sortedIndex = R.sortedIndexBy(folder.entries, entry, R.prop("label"));
            folder.entries.splice(sortedIndex, 0, entry);
        }
    }

    getRootFolder() {
        return R.clone(this.#rootFolder);
    }

    private static filterActions(action: Assistant.Action, data: Assistant.Data) {
        if (action.trigger !== data.trigger) return false;

        if (!game.pf2e.Predicate.test(action.predicate, data.rollOptions)) return false;

        if (action.selectors) {
            if (data.domains) {
                return action.selectors.some((selection) => data.domains!.includes(selection));
            }
            return false;
        }

        return true;
    }

    async process(data: Assistant.Data): Promise<{ data: Assistant.Data; reroll: Assistant.Reroll }> {
        const reroll = Assistant.createReroll();

        if (MODULE.isDebug) console.debug(data);

        const actions = this.#actions.filter((action) => Storage.filterActions(action, data));

        for (const action of actions) {
            const returnedData = await action.process(data);

            if (returnedData) {
                reroll.updateCondition.push(...returnedData.updateCondition);
                reroll.addItem.push(...returnedData.addItem);
                reroll.removeItem.push(...returnedData.removeItem);
                reroll.deleteChatMessage.push(...returnedData.deleteChatMessage);
            }
        }

        return { data, reroll };
    }
}

if (import.meta.hot) {
    // @ts-expect-error HMR
    Storage.prototype.hotReload = function (modules: Record<string, () => Promise<string>>) {
        this.reset();

        for (const path in modules) {
            modules[path]().then((module) => {
                import(/* @vite-ignore */ module).then((module: Assistant.Module) => {
                    this.addModule(module, path);
                });
            });
        }
    };

    import.meta.hot.accept((newModule) => {
        if (newModule) {
            const modules = import.meta.glob<string>("../data/**/*.ts", {
                query: "?url",
                import: "default"
            });
            // @ts-expect-error HMR
            game.assistant.storage.hotReload(modules);
        }
    });
}
