import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { db } from "./database.ts";

if (db.data.installPath === undefined) {
    console.error(
        "The install path is not set. Use `npm run configure set installPath <path>` to set it. " +
            "Data paths looks like `C:/Program Files/Foundry Virtual Tabletop`"
    );
    process.exit(1);
}

if (db.data.dataPath === undefined) {
    console.error(
        "The data path is not set. Use `npm run configure set dataPath <path>` to set it. " +
            "Data paths looks like `C:/Users/Example/AppData/Local/FoundryVTT`"
    );
    process.exit(1);
}

const electronPath = path.normalize(path.join(db.data.installPath, "resources", "app", "main.js"));
const nodePath = path.normalize(path.join(db.data.installPath, "main.js"));
const fvttPath = fs.existsSync(electronPath) ? electronPath : nodePath;

if (!fs.existsSync(fvttPath)) {
    console.error(`Unable to find a valid launch path at '${nodePath}' or ''${electronPath}.`);
    process.exit(1);
}

spawn("node", [fvttPath, `--dataPath=${db.data.dataPath}`], { stdio: "inherit" });
