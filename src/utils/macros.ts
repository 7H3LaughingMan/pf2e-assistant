import { Assistant } from "assistant.ts";
import { Utils } from "utils.ts";

export function extractPack(packName: string, fileName: string) {
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

    if (Utils.CompendiumCollection.isItemPack(pack)) {
        pack.getDocuments()
            .then((items) =>
                JSON.stringify(
                    items.map((item) => ({ slug: item.slug, uuid: item.uuid })),
                    null,
                    4
                )
            )
            .then((value) => downloadFile(fileName, value));
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
