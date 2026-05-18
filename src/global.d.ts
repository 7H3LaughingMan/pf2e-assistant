import "@7h3laughingman/pf2e-types";
import { Assistant } from "assistant.ts";

declare global {
    type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

declare module "@7h3laughingman/pf2e-types" {
    interface ClientSettingsPF2e {
        get(module: "pf2e-assistant", setting: "disabledFiles"): string[];
        set(module: "pf2e-assistant", setting: "disabledFiles", value: string[]): Promise<string[]>;
    }

    interface GamePF2e {
        assistant: {
            socket: Assistant.Socket;
            storage: Assistant.Storage;
            extractPack: (packName: string, fileName: string) => void;
            generateReadme: () => void;
        };
    }
}
