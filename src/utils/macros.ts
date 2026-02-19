import { isCompendiumPack } from "@7h3laughingman/pf2e-helpers/utilities";
import { ItemPF2e } from "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";
import * as R from "remeda";

const delay = (ms: number) =>
    new Promise((resolve, _reject) => {
        setTimeout(resolve, ms);
    });

export async function extractPack(packName: string, fileName: string) {
    function downloadFile(fileName: string, data: BlobPart, mime = "text/plain") {
        const blob = new Blob([data], { type: mime });
        const a = document.createElement("a");

        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(a.href);
            a.remove();
        }, 200);
    }
    const pack = game.packs.get(packName);

    if (isCompendiumPack<ItemPF2e<null>>(pack, "Item")) {
        const items = await pack.getDocuments();
        const json = JSON.stringify(
            items.map((item) => ({
                slug:
                    R.isNullish(item.slug) || R.isEmptyish(item.slug)
                        ? game.pf2e.system.sluggify(item.name)
                        : item.slug,
                uuid: item.uuid
            })),
            null,
            4
        );
        downloadFile(fileName, json);
        await delay(1000);
    }
}

export function generateReadme() {
    function outputFolder(folder: Assistant.Folder, spaces: number): string[] {
        const data = [];

        data.push(`${" ".repeat(spaces)}- ${folder.label}`);

        for (const child of folder.children) {
            data.push(...outputFolder(child, spaces + 2));
        }

        for (const entry of folder.entries) {
            data.push(`${" ".repeat(spaces + 2)}- ${entry.label}`);
        }

        return data;
    }

    function outputRootFolder(rootFolder: Assistant.Folder): string[] {
        const data = [];

        data.push(`<details>`);
        data.push(`  <summary>Available Automations</summary>`);
        data.push(``);

        for (const child of rootFolder.children) {
            data.push(...outputFolder(child, 2));
        }

        for (const entry of rootFolder.entries) {
            data.push(`  - ${entry.label}`);
        }

        data.push(``);
        data.push(`</details>`);

        return data;
    }

    navigator.clipboard
        .writeText(outputRootFolder(game.assistant.storage.getRootFolder()).join("\n"))
        .then(() => foundry.ui.notifications.info("[PF2e Assistant] Generated README.md Data"));
}
