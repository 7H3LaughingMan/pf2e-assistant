import { Plugin } from "vite";

interface ViteReplacement {
    from: RegExp;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    to: (substring: string, ...args: any[]) => string;
}

function execCodeReplacement(code: string, replacements: ViteReplacement[]) {
    replacements.forEach((replacement) => {
        if (replacement.from instanceof RegExp === false) {
            throw new Error("[vite-plugin-replace]: The replacement option 'from' is not of type 'RegExp'.");
        } else if (replacement.to instanceof Function === false) {
            throw new Error("[vite-plugin-replace]: The replacement option 'to' is not of type 'Function'.");
        } else {
            code = code.replaceAll(replacement.from, replacement.to);
        }
    });

    return code;
}

export function replaceCodePlugin(config: Record<string, Record<string, string>>): Plugin {
    if (config === undefined) {
        config = {};
    } else if ((typeof config === "object" || config !== null) === false) {
        throw new Error("[vite-plugin-replace]: The configuration is not of type 'Object'.");
    }

    const replacements: ViteReplacement[] = [];

    for (const [key, value] of Object.entries(config)) {
        function replace(_substring: string, p1: string) {
            return JSON.stringify(value[p1]);
        }

        replacements.push({
            from: new RegExp(`${key}\\[\\"(.*?)\\"\\]`, "g"),
            to: replace
        });
    }

    return {
        name: "transform-file",
        transform(code) {
            return {
                code: execCodeReplacement(code, replacements),
                map: null
            };
        }
    };
}
