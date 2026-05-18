import { DocumentUUID } from "@7h3laughingman/foundry-types/client/utils/_module.mjs";
import * as R from "remeda";

export function path<T extends string>(tail: T): `systems/${string}/${T}`;
export function path(...path: string[]): string;
export function path(...path: string[]): string {
    return `systems/${game.system.id}/${R.join(path, "/")}`;
}

export function uuid<P extends DocumentUUID, S extends DocumentUUID>(pf2e: P, sf2e: S): P | S {
    return game.system.id === "pf2e" ? pf2e : sf2e;
}
