import { Argument, Command } from "commander";
import { db, dbFile } from "./database.ts";

const program = new Command();

program
    .name("configure")
    .description("Manage configuration")
    .action(() => {
        if (db.data.installPath === undefined)
            console.error(
                "The install path is not set. Use `npm run configure set installPath <path>` to set it. " +
                    "Data paths looks like `C:/Program Files/Foundry Virtual Tabletop`"
            );

        if (db.data.dataPath === undefined)
            console.error(
                "The data path is not set. Use `npm run configure set dataPath <path>` to set it. " +
                    "Data paths looks like `C:/Users/Example/AppData/Local/FoundryVTT`"
            );

        if (db.data.installPath !== undefined && db.data.dataPath !== undefined) console.log("Configuration complete!");
    });

program
    .command("get")
    .addArgument(new Argument("<key>", "The configuration key").choices(["dataPath", "installPath"]))
    .action((key: "dataPath" | "installPath") => {
        console.log(db.data[key]);
    });

program
    .command("set")
    .addArgument(new Argument("<key>", "The configuration key").choices(["dataPath", "installPath"]))
    .argument("<value>", "The configuration value")
    .action((key: "dataPath" | "installPath", value: string) => {
        db.data[key] = value;
        db.write();
        console.log(`Set ${key} to ${value}`);
    });

program.command("view").action(() => {
    console.log("Current Configuration:", db.data);
});

program.command("path").action(() => {
    console.log("Current Configuration File:", dbFile);
});

program.parse();
