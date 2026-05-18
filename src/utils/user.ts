import { ActorPF2e, ScenePF2e, TokenDocumentPF2e, TokenPF2e, UserPF2e } from "@7h3laughingman/pf2e-types";

export function getCurrentUser(): UserPF2e {
    return game.user ?? game.data.users.find((value) => value._id === game.userId);
}

export function userIsGM(user: UserPF2e = getCurrentUser()): boolean {
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}

export function getPrimaryUpdater(actor: ActorPF2e): UserPF2e | null {
    if (game.users.activeGM) return game.users.activeGM;

    const primaryPlayer = actor.isToken
        ? null
        : game.users.getDesignatedUser((user) => user.active && user.character === actor);
    if (primaryPlayer) return primaryPlayer;

    return game.users.getDesignatedUser((user) => user.active && actor.canUserModify(user, "update"));
}

export function isPrimaryUpdater(actor: ActorPF2e, user: UserPF2e = getCurrentUser()): boolean {
    return getPrimaryUpdater(actor) === user;
}

export function primaryPlayerOwner(actor: ActorPF2e): UserPF2e | null {
    return (
        game.users.getDesignatedUser((user) => user.active && user.character === actor) ??
        game.users.getDesignatedUser((user) => user.active && !user.isGM && actor.canUserModify(user, "update"))
    );
}

export function isPrimaryOwner(actor: ActorPF2e, user: UserPF2e = getCurrentUser()): boolean {
    return user.isGM || primaryPlayerOwner(actor) === user;
}

export function getTargets(user: UserPF2e = getCurrentUser()): TokenPF2e<TokenDocumentPF2e<ScenePF2e>>[] {
    return Array.from(user.targets ?? []);
}
