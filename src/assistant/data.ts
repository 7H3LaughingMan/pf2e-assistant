import { ActorUUID, TokenDocumentUUID } from "@7h3laughingman/foundry-types/common/documents/_module.mjs";
import { ActorPF2e, ChatMessagePF2e, ItemPF2e, ScenePF2e, TokenDocumentPF2e } from "@7h3laughingman/pf2e-types";

import * as R from "remeda";

export interface ActorToken {
    actor: ActorPF2e;
    token: TokenDocumentPF2e;
}

export interface SerializedActorToken {
    actor: ActorUUID;
    token: TokenDocumentUUID;
}

export type Trigger =
    | "action"
    | "activate-exploration"
    | "area-fire"
    | "attack-roll"
    | "auto-fire"
    | "check"
    | "choice"
    | "combat-start"
    | "consumable"
    | "counteract-check"
    | "create-effect"
    | "damage-roll"
    | "damage-taken"
    | "deactivate-exploration"
    | "delete-effect"
    | "end-turn"
    | "flat-check"
    | "initiative"
    | "perception-check"
    | "saving-throw"
    | "self-effect"
    | "skill-check"
    | "spell-cast"
    | "start-turn";

export interface Data {
    trigger: Trigger;
    rollOptions: string[];
    domains?: string[];
    chatMessage?: ChatMessagePF2e;
    roll?: Roll;
    item?: ItemPF2e;
    speaker?: ActorToken;
    target?: ActorToken;
    origin?: ActorToken;
}

export function isActorToken(data?: { actor: Maybe<ActorPF2e>; token: Maybe<TokenDocumentPF2e> }): data is ActorToken {
    return R.isNonNullish(data?.actor) && R.isNonNullish(data?.token);
}

export function isValidToken(token: Maybe<TokenDocumentPF2e>): token is TokenDocumentPF2e<ScenePF2e> {
    if (token === null || token === undefined) return false;
    return token.parent !== null;
}
