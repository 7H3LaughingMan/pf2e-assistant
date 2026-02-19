import fs from "fs";
import { glob } from "glob";
import path from "path";
import * as R from "remeda";

interface Item {
    slug: string;
    uuid: string;
}

function creatEnum(name: string, items: Item[]) {
    const data = [];

    data.push(`export const enum ${name} {`);
    data.push(...items.map((item) => `    "${item.slug}" = "${item.uuid}",`));
    data.push(`}`);

    return data;
}

function fixDuplicates(items: Item[]) {
    const duplicates = R.filter(
        items,
        (value) => R.filter(items, (secondValue) => value.slug === secondValue.slug).length !== 1
    );
    if (duplicates.length !== 0) {
        for (const item of duplicates) {
            const itemId = item.uuid.split(".")[4];
            item.slug = `${item.slug}-${itemId}`;
        }
    }
}

const jsonFiles = (await glob("./src/compendium-packs/*.json")).sort();
const data = [];

for (const jsonFile of jsonFiles) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf-8")) as Item[];
    fixDuplicates(jsonData);
    jsonData.sort((a, b) => a.slug.localeCompare(b.slug));

    data.push(
        ...creatEnum(path.basename(jsonFile, path.extname(jsonFile)).toUpperCase().replaceAll("-", "_"), jsonData)
    );
    data.push(``);
}

fs.writeFileSync("./src/compendium-packs.ts", data.join("\n"));
