import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import Config from "./config.ts";

const installPath = Config.instance.get("installPath");
if (!installPath) {
    console.error(
        "The installation path is not set. Use `npm run configure set installPath <path>` to set it. Install paths looks like `C:/Program Files/Foundry Virtual Tabletop`"
    );
    process.exit(1);
}

const dataPath = Config.instance.get("dataPath");
if (!dataPath) {
    console.error(
        "The data path is not set. Use `npm run configure set dataPath <path>` to set it. Data paths looks like `C:/Users/Example/AppData/Local/FoundryVTT`"
    );
    process.exit(1);
}

const electronPath = path.normalize(path.join(installPath, "resources", "app", "main.js"));
const nodePath = path.normalize(path.join(installPath, "main.js"));
const fvttPath = fs.existsSync(electronPath) ? electronPath : nodePath;

if (!fs.existsSync(fvttPath)) {
    console.error(`Unable to find a valid launch path at '${nodePath}' or ''${electronPath}.`);
    process.exit(1);
}

spawn("node", [fvttPath, `--dataPath=${dataPath}`], { stdio: "inherit" });
