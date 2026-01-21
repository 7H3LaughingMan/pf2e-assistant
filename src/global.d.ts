import { Assistant } from "assistant.ts";
import "foundry-pf2e";

declare module "foundry-pf2e" {
    interface ClientSettingsPF2e {
        get(module: "pf2e-assistant", setting: "disabledFiles"): string[];
        set(module: "pf2e-assistant", setting: "disabledFiles", value: string[]): Promise<string[]>;
    }

    interface GamePF2e {
        assistant: {
            socket: Assistant.Socket;
            storage: Assistant.Storage;
            systemId: SystemId;
            extractPack: (packName: string, fileName: string) => void;
            generateReadme: () => void;
        };
    }
}
