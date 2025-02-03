import { ActorPF2e, CheckDC, EffectPF2e, ScenePF2e, TokenDocumentPF2e, UserPF2e, ZeroToThree } from "foundry-pf2e";

export function getClassDC(actor: ActorPF2e): CheckDC | number | undefined {
    if (actor.isOfType("character")) {
        return !actor.classDC
            ? undefined
            : {
                  label: `${actor.classDC.label} DC`,
                  value: actor.classDC.dc.value
              };
    }

    if (actor.isOfType("npc")) {
        return actor.attributes.classDC.value;
    }

    return undefined;
}

export function getPrimaryUser(actor: ActorPF2e): UserPF2e | null {
    const activeUsers = game.users.filter((user) => user.active);
    const primaryPlayer = actor.isToken ? null : activeUsers.find((user) => user.character?.id === actor.id);
    if (primaryPlayer) return primaryPlayer;

    const activeUpdaters = activeUsers.filter((user) => actor.canUserModify(user, "update"));
    if (activeUpdaters.length === 1) return activeUpdaters[0];

    return game.users.activeGM;
}

export interface ActorToken {
    actor: ActorPF2e;
    token: TokenDocumentPF2e<ScenePF2e>;
}

export function isActorToken(data: { actor: Maybe<ActorPF2e>; token: Maybe<TokenDocumentPF2e> }): data is ActorToken {
    if (data.actor && data.token && data.token.parent) {
        return true;
    }
    return false;
}

export function hasEffect(
    actor: ActorPF2e,
    slug: string,
    data?: { origin?: ActorPF2e; target?: ActorPF2e; degreeOfSuccess?: ZeroToThree }
): boolean {
    let effects = actor.itemTypes.effect.filter((effect) => !effect.isExpired && effect.slug === slug);

    if (data?.origin) {
        effects = effects.filter((effect) => effect.system.context?.origin.actor === data.origin!.uuid);
    }

    if (data?.target) {
        effects = effects.filter((effect) => effect.system.context?.target?.actor === data.target!.uuid);
    }

    if (data?.degreeOfSuccess) {
        effects = effects.filter((effect) => effect.system.context?.roll?.degreeOfSuccess === data.degreeOfSuccess);
    }

    return effects.length !== 0;
}

export function hasEffects(
    actor: ActorPF2e,
    slugs: string[],
    data?: { origin?: ActorPF2e; target?: ActorPF2e; degreeOfSuccess?: ZeroToThree }
): boolean {
    let effects = actor.itemTypes.effect.filter((effect) => !effect.isExpired && slugs.includes(effect.slug ?? ""));

    if (data?.origin) {
        effects = effects.filter((effect) => effect.system.context?.origin.actor === data.origin!.uuid);
    }

    if (data?.target) {
        effects = effects.filter((effect) => effect.system.context?.target?.actor === data.target!.uuid);
    }

    if (data?.degreeOfSuccess) {
        effects = effects.filter((effect) => effect.system.context?.roll?.degreeOfSuccess === data.degreeOfSuccess);
    }

    return effects.length !== 0;
}

export function getEffect(
    actor: ActorPF2e,
    slug: string,
    data?: { origin?: ActorPF2e; target?: ActorPF2e; degreeOfSuccess?: ZeroToThree }
): Maybe<EffectPF2e<ActorPF2e>> {
    let effects = actor.itemTypes.effect.filter((effect) => !effect.isExpired && effect.slug === slug);

    if (data?.origin) {
        effects = effects.filter((effect) => effect.system.context?.origin.actor === data.origin!.uuid);
    }

    if (data?.target) {
        effects = effects.filter((effect) => effect.system.context?.target?.actor === data.target!.uuid);
    }

    if (data?.degreeOfSuccess) {
        effects = effects.filter((effect) => effect.system.context?.roll?.degreeOfSuccess === data.degreeOfSuccess);
    }

    return effects.at(0);
}

export function getEffects(
    actor: ActorPF2e,
    slugs: string[],
    data?: { origin?: ActorPF2e; target?: ActorPF2e; degreeOfSuccess?: ZeroToThree }
): EffectPF2e<ActorPF2e>[] {
    let effects = actor.itemTypes.effect.filter((effect) => !effect.isExpired && slugs.includes(effect.slug ?? ""));

    if (data?.origin) {
        effects = effects.filter((effect) => effect.system.context?.origin.actor === data.origin!.uuid);
    }

    if (data?.target) {
        effects = effects.filter((effect) => effect.system.context?.target?.actor === data.target!.uuid);
    }

    if (data?.degreeOfSuccess) {
        effects = effects.filter((effect) => effect.system.context?.roll?.degreeOfSuccess === data.degreeOfSuccess);
    }

    return effects;
}

export function getRollOptions(actor: ActorPF2e, prefix: "self" | "target" | "origin") {
    if (prefix === "self") return actor.getRollOptions();

    return actor.getRollOptions().map((value) => {
        if (value.startsWith("self")) return `${prefix}${value.substring(4)}`;
        return `${prefix}:${value}`;
    });
}
