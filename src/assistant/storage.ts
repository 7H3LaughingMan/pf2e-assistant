import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export class Storage {
    #actions: Assistant.Action[] = [];
    #rootFolder: Assistant.Folder = { label: "Root", children: [], entries: [] };

    constructor() {
        const disabledFiles = game.settings.get("pf2e-assistant", "disabledFiles");
        const modules = import.meta.glob<Assistant.Module>("../data/**/*.ts");

        for (const path in modules) {
            modules[path]().then((module) => {
                Storage.addFile(this.#rootFolder, module.path, path, !disabledFiles.includes(path));
                if (!disabledFiles.includes(path)) {
                    this.#actions.push(...module.actions);
                }
            });
        }

        Storage.sortFolder(this.#rootFolder);
    }

    reset() {
        this.#actions = [];
        this.#rootFolder = { label: "Root", children: [], entries: [] };
    }

    addFile(path: string[], value: string, enabled: boolean) {
        Storage.addFile(this.#rootFolder, path, value, enabled);
    }

    addActions(actions: Assistant.Action[]) {
        this.#actions.push(...actions);
    }

    sortFolder() {
        Storage.sortFolder(this.#rootFolder);
    }

    private static addFile(folder: Assistant.Folder, path: string[], value: string, enabled: boolean) {
        if (path.length > 1) {
            let subFolder = folder.children.find((child) => child.label === path[0]);

            if (!subFolder) {
                subFolder = { label: path[0], children: [], entries: [] };
                folder.children.push(subFolder);
            }

            Storage.addFile(subFolder, path.slice(1), value, enabled);
        } else if (path.length == 1) {
            folder.entries.push({ enabled, label: path[0], value });
        }
    }

    private static sortEntries(a: Assistant.File, b: Assistant.File) {
        return a.label.localeCompare(b.label);
    }

    private static sortChildren(a: Assistant.Folder, b: Assistant.Folder) {
        return a.label.localeCompare(b.label);
    }

    private static sortFolder(folder: Assistant.Folder) {
        folder.children.sort(Storage.sortChildren);
        folder.entries.sort(Storage.sortEntries);

        for (const child of folder.children) {
            Storage.sortFolder(child);
        }
    }

    getRootFolder() {
        return Utils.Remeda.clone(this.#rootFolder);
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
        if (data.trigger == "") throw Error;

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
        const disabledFiles = game.settings.get("pf2e-assistant", "disabledFiles");

        for (const path in modules) {
            modules[path]().then((moduleName) => {
                import(/* @vite-ignore */ moduleName).then((module: Assistant.Module) => {
                    this.addFile(module.path, path, !disabledFiles.includes(path));
                    if (!disabledFiles.includes(path)) {
                        this.addActions(module.actions);
                    }
                });
            });
        }

        this.sortFolder();
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
