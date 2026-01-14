import { binary, command, positional, run, string, subcommands } from "cmd-ts";
import Config from "./config.ts";

const get = command({
    name: "get",
    args: {
        key: positional({ displayName: "key", type: string })
    },
    handler: (args) => {
        console.log(Config.instance.get(args.key));
    }
});

const set = command({
    name: "set",
    args: {
        key: positional({ displayName: "key", type: string }),
        value: positional({ displayName: "value", type: string })
    },
    handler: (args) => {
        Config.instance.set(args.key, args.value);
        console.log(`Set ${args.key} to ${args.value}`);
    }
});

const view = command({
    name: "view",
    args: {},
    handler: () => {
        console.log("Current Configuration:", Config.instance.getAll());
    }
});

const path = command({
    name: "path",
    args: {},
    handler: () => {
        console.log("Current Configuration File:", Config.instance.configPath);
    }
});

const test = command({
    name: "test",
    args: {},
    handler: () => {
        const installPath = Config.instance.get("installPath");
        if (!installPath) {
            console.error(
                "The installation path is not set. Use `npm run configure set installPath <path>` to set it. Install paths look like `C:/Program Files/Foundry Virtual Tabletop`"
            );
        }

        const dataPath = Config.instance.get("dataPath");
        if (!dataPath) {
            console.error(
                "The data path is not set. Use `npm run configure set dataPath <path>` to set it. Data paths look like `C:/Users/Example/AppData/Local/FoundryVTT`"
            );
        }

        if (installPath && dataPath) console.log("Configuration complete!");
    }
});

const cli = binary(
    subcommands({
        name: "configure",
        cmds: { get, set, view, path, test }
    })
);

run(cli, process.argv);
