import fs from "fs";
import path from "path";
import prompts from "prompts";
import moduleJSON from "../module.json" with { type: "json" };
import { db } from "./database.ts";

if (db.data.dataPath === undefined) {
    console.error(
        "The data path is not set. Use `npm run configure set dataPath <path>` to set it. " +
            "Data paths looks like `C:/Users/Example/AppData/Local/FoundryVTT`"
    );
    process.exit(1);
}

const symlinkPath = path.resolve(db.data.dataPath, "Data", "modules", moduleJSON.id);
const symlinkStats = fs.lstatSync(symlinkPath, { throwIfNoEntry: false });
if (symlinkStats) {
    const atPath = symlinkStats.isDirectory() ? "folder" : symlinkStats.isSymbolicLink() ? "symlink" : "file";
    const proceed = (
        await prompts({
            type: "confirm",
            name: "value",
            initial: false,
            message: `A "${moduleJSON.id}" ${atPath} already exists in the "modules" subfolder. Replace with new symlink?`
        })
    ).value;
    if (!proceed) {
        console.error("Aborting . . . ");
        process.exit(1);
    }
}

try {
    if (symlinkStats?.isDirectory()) {
        fs.rmSync(symlinkPath, { recursive: true, force: true });
    } else if (symlinkStats) {
        fs.unlinkSync(symlinkPath);
    }
    fs.symlinkSync(path.resolve(process.cwd()), symlinkPath, "junction");
} catch (error) {
    console.error(error);
    process.exit(1);
}

console.log(`Symlink sucesfully created at "${symlinkPath}"!`);
