import { JSONFileSyncPreset } from "lowdb/node";
import path from "path";
import moduleJSON from "../module.json" with { type: "json" };

type Data = {
    dataPath?: string;
    installPath?: string;
};

export const dbFile = path.join(import.meta.dirname, `${moduleJSON.id}.json`);
export const db = JSONFileSyncPreset<Data>(dbFile, {});
