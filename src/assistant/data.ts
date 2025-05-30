import { ActorPF2e, ChatMessagePF2e, ItemPF2e, ScenePF2e, TokenDocumentPF2e } from "foundry-pf2e";

export interface ActorToken {
    actor: ActorPF2e;
    token: TokenDocumentPF2e;
}
export interface Data {
    trigger: string;
    rollOptions: string[];
    domains?: string[];
    chatMessage?: ChatMessagePF2e;
    roll?: Roll;
    item?: ItemPF2e;
    speaker?: ActorToken;
    target?: ActorToken;
    origin?: ActorToken;
}

export function isValidToken(token: Maybe<TokenDocumentPF2e>): token is TokenDocumentPF2e<ScenePF2e> {
    if (token === null || token === undefined) return false;
    return token.parent !== null;
}
