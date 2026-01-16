import fs from "fs";
import { glob } from "glob";
import path from "path";

interface JSON {
    slug: string;
    uuid: string;
}

function creatEnum(name: string, effects: JSON[]) {
    const data = [];

    data.push(`export const enum ${name} {`);
    data.push(...effects.map((effect) => `    "${effect.slug}" = "${effect.uuid}",`));
    data.push(`}`);

    return data;
}

const jsonFiles = (await glob("./src/compendium-packs/*.json")).sort();
const data = [];

for (const jsonFile of jsonFiles) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf-8")) as JSON[];
    jsonData.sort((a, b) => a.slug.localeCompare(b.slug));

    data.push(
        ...creatEnum(path.basename(jsonFile, path.extname(jsonFile)).toUpperCase().replaceAll("-", "_"), jsonData)
    );
    data.push(``);
}

fs.writeFileSync("./src/compendium-packs.ts", data.join("\n"));
