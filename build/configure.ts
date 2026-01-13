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

const cli = binary(
    subcommands({
        name: "configure",
        cmds: { get, set, view, path }
    })
);

run(cli, process.argv);
