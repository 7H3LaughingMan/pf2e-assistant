import { Assistant } from "assistant.ts";
import {
    ActorPF2e,
    ChatMessageFlagsPF2e,
    ChatMessagePF2e,
    CheckDC,
    CheckDCReference,
    CheckRoll,
    ConditionPF2e,
    ConditionSlug,
    ConditionSource,
    EffectSystemData,
    ItemPF2e,
    ItemSourcePF2e,
    ModifierObjectParams,
    RollNoteSource,
    RollTwiceOption,
    SaveType,
    TokenDocumentPF2e,
    TraitViewData
} from "foundry-pf2e";
import { Rolled } from "foundry-pf2e/foundry/client/dice/_module.mjs";
import { RollMode } from "foundry-pf2e/foundry/common/constants.mjs";
import {
    ActorUUID,
    ChatMessageUUID,
    ItemUUID,
    TokenDocumentUUID
} from "foundry-pf2e/foundry/common/documents/_module.mjs";
import * as R from "remeda";
import { Utils } from "utils.ts";
import { ActorToken, isActorToken } from "./data.ts";
import { AddItem, RemoveItem, UpdateCondition } from "./reroll.ts";

export class Socket {
    #socket = socketlib.registerModule("pf2e-assistant")!;
    #updateQueue = new foundry.utils.Semaphore(1);

    constructor() {
        this.#socket.register("addEmbeddedItem", this.#addEmbeddedItem);
        this.#socket.register("createEmbeddedItem", this.#createEmbeddedItem);
        this.#socket.register("deleteEmbeddedItem", this.#deleteEmbeddedItem);
        this.#socket.register("updateEmbeddedItem", this.#updateEmbeddedItem);

        this.#socket.register("decreaseCondition", this.#decreaseCondition);
        this.#socket.register("increaseCondition", this.#increaseCondition);
        this.#socket.register("toggleCondition", this.#toggleCondition);
        this.#socket.register("addCondition", this.#addCondition);
        this.#socket.register("removeCondition", this.#removeCondition);

        this.#socket.register("rollSave", this.#rollSave);

        this.#socket.register("deleteChatMessage", this.#deleteChatMessage);
        this.#socket.register("updateChatMessage", this.#updateChatMessage);

        this.#socket.register("promptChoice", this.#promptChoice);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type
    async #executeAsActor<T>(actor: ActorPF2e, handler: string | Function, ...args: any[]): Promise<Maybe<T>> {
        const primaryUser = Utils.Actor.getPrimaryUser(actor);

        if (primaryUser) {
            return this.#socket.executeAsUser<T>(handler, primaryUser.id, ...args);
        }

        return undefined;
    }

    async addEffect(
        actor: ActorPF2e,
        effectUuid: ItemUUID,
        data: {
            origin: ActorToken;
            item?: ItemPF2e;
            target?: ActorToken;
            roll?: Pick<Rolled<CheckRoll>, "total" | "degreeOfSuccess">;
            duration?: EffectSystemData["duration"];
            choiceSet?: { flag?: string; selection: string | number | boolean };
            tokenMark?: { slug: string; token: TokenDocumentPF2e };
        }
    ): Promise<RemoveItem[]> {
        const effect = await fromUuid<ItemPF2e>(effectUuid);
        if (!effect?.isOfType("effect")) return [];

        const effectSource = effect.toObject();

        Utils.Effect.addContext(effectSource, {
            origin: data.origin,
            item: data.item,
            target: data.target,
            roll: data.roll
        });

        if (data.duration) {
            Utils.Effect.setDuration(effectSource, data.duration);
        }

        if (data.choiceSet) {
            Utils.Effect.setChoiceSet(effectSource, data.choiceSet);
        }

        if (data.tokenMark) {
            Utils.Effect.setTokenMark(effectSource, data.tokenMark);
        }

        return await this.createEmbeddedItem(actor, effectSource);
    }

    async addEmbeddedItem(
        actor: ActorPF2e,
        itemUuid: ItemUUID,
        data?: PreCreate<ItemSourcePF2e>
    ): Promise<RemoveItem[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (await this.#executeAsActor(actor, "addEmbeddedItem", actor.uuid, itemUuid, data)) ?? [];
        }

        const item = await fromUuid<ItemPF2e>(itemUuid);

        if (item) {
            const itemSource = !data ? item.toObject() : foundry.utils.mergeObject(item.toObject(), data);
            const createdItem = await actor.createEmbeddedDocuments("Item", [itemSource]);
            return createdItem.map((i) => ({ actor: actor.uuid, item: i.uuid }));
        }

        return [];
    }

    async #addEmbeddedItem(
        actorUuid: ActorUUID,
        itemUuid: ItemUUID,
        data?: PreCreate<ItemSourcePF2e>
    ): Promise<RemoveItem[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        return await game.assistant.socket.addEmbeddedItem(actor, itemUuid, data);
    }

    async createEmbeddedItem(actor: ActorPF2e, data: PreCreate<ItemSourcePF2e>): Promise<RemoveItem[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (await this.#executeAsActor(actor, "createEmbeddedItem", actor.uuid, data)) ?? [];
        }

        const createdItem = await actor.createEmbeddedDocuments("Item", [data]);
        return createdItem.map((i) => ({ actor: actor.uuid, item: i.uuid }));
    }

    async #createEmbeddedItem(actorUuid: ActorUUID, data: PreCreate<ItemSourcePF2e>): Promise<RemoveItem[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        return await game.assistant.socket.createEmbeddedItem(actor, data);
    }

    async deleteEmbeddedItems(items: ItemPF2e[]): Promise<AddItem[]> {
        const returnValue: AddItem[] = [];

        items.forEach(async (item) => {
            returnValue.push(...(await game.assistant.socket.deleteEmbeddedItem(item)));
        });

        return returnValue;
    }

    async deleteEmbeddedItem(item: ItemPF2e): Promise<AddItem[]> {
        if (!item.parent) return [];

        if (!item.parent.canUserModify(game.user, "update")) {
            return (await this.#executeAsActor(item.parent, "deleteEmbeddedItem", item.uuid)) ?? [];
        }

        const returnValue = [{ actor: item.parent.uuid, item: item.toObject() }];
        await item.delete();
        return returnValue;
    }

    async #deleteEmbeddedItem(itemUuid: ItemUUID): Promise<AddItem[]> {
        const item = await fromUuid<ItemPF2e>(itemUuid);
        if (!item) return [];

        return await game.assistant.socket.deleteEmbeddedItem(item);
    }

    async updateEmbeddedItem(item: ItemPF2e, data: Record<string, unknown>) {
        if (!item.parent) return;

        if (!item.parent.canUserModify(game.user, "update")) {
            await this.#executeAsActor(item.parent, "updateEmbeddedItem", item.uuid);
            return;
        }

        await item.update(data);
    }

    async #updateEmbeddedItem(itemUuid: ItemUUID, data: Record<string, unknown>) {
        const item = await fromUuid<ItemPF2e>(itemUuid);
        if (!item) return;

        await game.assistant.socket.updateEmbeddedItem(item, data);
    }

    async decreaseCondition(
        actor: ActorPF2e,
        conditionSlug: ConditionSlug,
        { value, forceRemove }: { value?: number; forceRemove?: boolean } = {}
    ): Promise<UpdateCondition[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (
                (await this.#executeAsActor(actor, "decreaseCondition", actor.uuid, conditionSlug, {
                    value,
                    forceRemove
                })) ?? []
            );
        }

        const conditions = actor.itemTypes.condition.filter((c) => c.slug === conditionSlug && !c.isLocked);
        if (conditions.length !== 0) {
            const returnValue = conditions.map((c) => ({ actor: actor.uuid, id: c.id, data: c.toObject() }));

            for (const condition of conditions) {
                const currentValue = condition._source.system.value.value;
                const newValue = R.isNumber(currentValue) ? Math.max(currentValue - (value ?? 1), 0) : null;
                if (newValue !== null && !forceRemove) {
                    await game.pf2e.ConditionManager.updateConditionValue(condition.id, actor, newValue);
                } else {
                    await condition.delete();
                }
            }

            return returnValue;
        }

        return [];
    }

    async #decreaseCondition(
        actorUuid: ActorUUID,
        conditionSlug: ConditionSlug,
        { value, forceRemove }: { value?: number; forceRemove?: boolean } = {}
    ): Promise<UpdateCondition[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        return await game.assistant.socket.decreaseCondition(actor, conditionSlug, { value, forceRemove });
    }

    async increaseCondition(
        actor: ActorPF2e,
        conditionSlug: ConditionSlug,
        { value, max = Number.MAX_SAFE_INTEGER }: { value?: number; max?: number } = {}
    ): Promise<UpdateCondition[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (
                (await this.#executeAsActor(actor, "increaseCondition", actor.uuid, conditionSlug, { value, max })) ??
                []
            );
        }

        const conditions = actor.itemTypes.condition.filter((c) => c.slug === conditionSlug && !c.isLocked);

        if (conditions.length !== 0) {
            const returnValue = conditions.map((c) => ({ actor: actor.uuid, id: c.id, data: c.toObject() }));

            for (const condition of conditions) {
                const newValue = (() => {
                    const currentValue = condition._source.system.value.value;
                    if (currentValue === null) return null;
                    const addend = value ?? 1;
                    return Math.clamp(currentValue + addend, 1, max);
                })();
                if (!newValue) continue;
                await game.pf2e.ConditionManager.updateConditionValue(condition.id, actor, newValue);
            }

            return returnValue;
        } else {
            const conditionSource = game.pf2e.ConditionManager.getCondition(conditionSlug).toObject();
            const conditionValue = R.isNumber(conditionSource.system.value.value)
                ? Math.clamp(conditionSource.system.value.value, value ?? 1, max)
                : null;
            conditionSource.system.value.value = conditionValue;
            const items = (await actor.createEmbeddedDocuments("Item", [
                conditionSource
            ])) as ConditionPF2e<ActorPF2e>[];

            return items.map((c) => ({
                actor: actor.uuid,
                id: c.id
            }));
        }
    }

    async #increaseCondition(
        actorUuid: ActorUUID,
        conditionSlug: ConditionSlug,
        { value, max = Number.MAX_SAFE_INTEGER }: { value?: number; max?: number } = {}
    ): Promise<UpdateCondition[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        return await game.assistant.socket.increaseCondition(actor, conditionSlug, { value, max });
    }

    async toggleCondition(
        actor: ActorPF2e,
        conditionSlug: ConditionSlug,
        { active }: { active?: boolean } = {}
    ): Promise<UpdateCondition[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (await this.#executeAsActor(actor, "toggleCondition", actor.uuid, conditionSlug, { active })) ?? [];
        }

        const hasCondition = actor.hasCondition(conditionSlug);
        active ??= !hasCondition;

        if (active && !hasCondition) {
            return await game.assistant.socket.increaseCondition(actor, conditionSlug);
        } else if (active) {
            return [];
        } else if (!active && hasCondition) {
            return await game.assistant.socket.decreaseCondition(actor, conditionSlug, { forceRemove: true });
        }

        return [];
    }

    async #toggleCondition(
        actorUuid: ActorUUID,
        conditionSlug: ConditionSlug,
        { active }: { active?: boolean } = {}
    ): Promise<UpdateCondition[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        return await game.assistant.socket.toggleCondition(actor, conditionSlug, { active });
    }

    async addCondition(
        actor: ActorPF2e,
        conditionSlug: ConditionSlug,
        { value, persistent }: { value?: number; persistent?: ConditionSource["system"]["persistent"] } = {}
    ): Promise<UpdateCondition[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (await this.#executeAsActor(actor, "addCondition", actor.uuid, conditionSlug, { value })) ?? [];
        }

        if (conditionSlug === "persistent-damage" && persistent === undefined) return [];

        const conditionSource = game.pf2e.ConditionManager.getCondition(conditionSlug).toObject();
        const conditionValue = R.isNumber(conditionSource.system.value.value)
            ? Math.clamp(conditionSource.system.value.value, value ?? 1, Number.MAX_SAFE_INTEGER)
            : null;
        conditionSource.system.value.value = conditionValue;

        if (conditionSlug === "persistent-damage") conditionSource.system.persistent = persistent;

        const items = (await actor.createEmbeddedDocuments("Item", [conditionSource])) as ConditionPF2e<ActorPF2e>[];

        return items.map((c) => ({
            actor: actor.uuid,
            id: c.id
        }));
    }

    async #addCondition(
        actorUuid: ActorUUID,
        conditionSlug: ConditionSlug,
        { value, persistent }: { value?: number; persistent?: ConditionSource["system"]["persistent"] } = {}
    ): Promise<UpdateCondition[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        return await game.assistant.socket.addCondition(actor, conditionSlug, { value, persistent });
    }

    async removeCondition(actor: ActorPF2e, conditionSlug: ConditionSlug): Promise<UpdateCondition[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (await this.#executeAsActor(actor, "removeCondition", actor.uuid, conditionSlug)) ?? [];
        }

        const conditions = actor.itemTypes.condition.filter((c) => c.slug === conditionSlug && !c.isLocked);
        const conditionSources = conditions.map((c) => ({ actor: actor.uuid, id: c.id, data: c.toObject() }));
        conditions.forEach(async (condition) => {
            await condition.delete();
        });
        return conditionSources;
    }

    async #removeCondition(actorUuid: ActorUUID, conditionSlug: ConditionSlug): Promise<UpdateCondition[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        return await game.assistant.socket.removeCondition(actor, conditionSlug);
    }

    async rollSave(
        actor: ActorPF2e,
        save: SaveType,
        args: {
            /** A string of some kind to identify the roll: will be included in `CheckRoll#options` */
            identifier?: string;
            /** The slug of an action of which this check is a constituent roll */
            action?: string;
            /** What token to use for the roll itself. Defaults to the actor's token */
            token?: Maybe<TokenDocumentPF2e>;
            /** Which attack this is (for the purposes of multiple attack penalty) */
            attackNumber?: number;
            /** Optional target for the roll */
            target?: Maybe<ActorPF2e>;
            /** Optional origin for the roll: only one of target and origin may be provided */
            origin?: Maybe<ActorPF2e>;
            /** Optional DC data for the roll */
            dc?: CheckDC | CheckDCReference | number | null;
            /** Optional override for the check modifier label */
            label?: string;
            /** An optional identifying slug to give a specific check: propagated to roll options */
            slug?: Maybe<string>;
            /** Optional override for the dialog's title: defaults to label */
            title?: string;
            /** Any additional roll notes that should be used in the roll. */
            extraRollNotes?: RollNoteSource[];
            /** Any additional options that should be used in the roll. */
            extraRollOptions?: string[];
            /** Additional modifiers */
            modifiers?: ModifierObjectParams[];
            /** The originating item of this attack, if any */
            item?: ItemPF2e<ActorPF2e> | null;
            /** The roll mode (i.e., 'roll', 'blindroll', etc) to use when rendering this roll. */
            rollMode?: RollMode | "roll";
            /** Should the dialog be skipped */
            skipDialog?: boolean;
            /** Should this roll be rolled twice? If so, should it keep highest or lowest? */
            rollTwice?: RollTwiceOption;
            /** Any traits for the check */
            traits?: (TraitViewData | string)[];
            /** Whether the check is part of a damaging action */
            damaging?: boolean;
            /** Indication that the check is associated with a melee action */
            melee?: boolean;
            /** Whether to create a chat message using the roll (defaults true) */
            createMessage?: boolean;
        }
    ) {
        if (!actor.canUserModify(game.user, "update")) {
            await this.#executeAsActor(actor, "rollSave", actor.uuid, save, {
                identifier: args.identifier,
                action: args.action,
                token: args.token?.uuid,
                attackNumber: args.attackNumber,
                target: args.target?.uuid,
                origin: args.origin?.uuid,
                dc: args.dc,
                label: args.label,
                slug: args.slug,
                title: args.title,
                extraRollNodes: args.extraRollNotes,
                extraRollOptions: args.extraRollOptions,
                modifiers: args.modifiers,
                item: args.item?.uuid,
                rollMode: args.rollMode,
                skipDialog: args.skipDialog,
                rollTwice: args.rollTwice,
                traits: args.traits,
                damaging: args.damaging,
                melee: args.melee,
                createMessage: args.createMessage
            });
            return;
        }

        await actor.saves?.[save]?.roll({
            identifier: args.identifier,
            action: args.action,
            token: args.token,
            attackNumber: args.attackNumber,
            target: args.target,
            origin: args.origin,
            dc: args.dc,
            label: args.label,
            slug: args.slug,
            title: args.title,
            extraRollNotes: args.extraRollNotes,
            extraRollOptions: args.extraRollOptions,
            modifiers: args.modifiers?.map((value) => new game.pf2e.Modifier(value)),
            item: args.item,
            rollMode: args.rollMode,
            skipDialog: args.skipDialog,
            rollTwice: args.rollTwice,
            traits: args.traits,
            damaging: args.damaging,
            melee: args.melee,
            createMessage: args.createMessage
        });
    }

    async #rollSave(
        actorUuid: ActorUUID,
        save: SaveType,
        args: {
            /** A string of some kind to identify the roll: will be included in `CheckRoll#options` */
            identifier?: string;
            /** The slug of an action of which this check is a constituent roll */
            action?: string;
            /** What token to use for the roll itself. Defaults to the actor's token */
            token?: Maybe<TokenDocumentUUID>;
            /** Which attack this is (for the purposes of multiple attack penalty) */
            attackNumber?: number;
            /** Optional target for the roll */
            target?: Maybe<ActorUUID>;
            /** Optional origin for the roll: only one of target and origin may be provided */
            origin?: Maybe<ActorUUID>;
            /** Optional DC data for the roll */
            dc?: CheckDC | CheckDCReference | number | null;
            /** Optional override for the check modifier label */
            label?: string;
            /** An optional identifying slug to give a specific check: propagated to roll options */
            slug?: Maybe<string>;
            /** Optional override for the dialog's title: defaults to label */
            title?: string;
            /** Any additional roll notes that should be used in the roll. */
            extraRollNotes?: RollNoteSource[];
            /** Any additional options that should be used in the roll. */
            extraRollOptions?: string[];
            /** Additional modifiers */
            modifiers?: ModifierObjectParams[];
            /** The originating item of this attack, if any */
            item?: ItemUUID | null;
            /** The roll mode (i.e., 'roll', 'blindroll', etc) to use when rendering this roll. */
            rollMode?: RollMode | "roll";
            /** Should the dialog be skipped */
            skipDialog?: boolean;
            /** Should this roll be rolled twice? If so, should it keep highest or lowest? */
            rollTwice?: RollTwiceOption;
            /** Any traits for the check */
            traits?: (TraitViewData | string)[];
            /** Whether the check is part of a damaging action */
            damaging?: boolean;
            /** Indication that the check is associated with a melee action */
            melee?: boolean;
            /** Whether to create a chat message using the roll (defaults true) */
            createMessage?: boolean;
        }
    ) {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return;

        await game.assistant.socket.rollSave(actor, save, {
            identifier: args.identifier,
            action: args.action,
            token: args.token ? ((await fromUuid<TokenDocumentPF2e>(args.token)) ?? undefined) : undefined,
            attackNumber: args.attackNumber,
            target: args.target ? ((await fromUuid<ActorPF2e>(args.target)) ?? undefined) : undefined,
            origin: args.origin ? ((await fromUuid<ActorPF2e>(args.origin)) ?? undefined) : undefined,
            dc: args.dc,
            label: args.label,
            slug: args.slug,
            title: args.title,
            extraRollNotes: args.extraRollNotes,
            extraRollOptions: args.extraRollOptions,
            modifiers: args.modifiers,
            item: args.item ? ((await fromUuid<ItemPF2e<ActorPF2e>>(args.item)) ?? undefined) : undefined,
            rollMode: args.rollMode,
            skipDialog: args.skipDialog,
            rollTwice: args.rollTwice,
            traits: args.traits,
            damaging: args.damaging,
            melee: args.melee,
            createMessage: args.createMessage
        });
    }

    async deleteChatMessage(chatMessage: ChatMessagePF2e) {
        if (!chatMessage.canUserModify(game.user, "delete")) {
            await this.#socket.executeAsGM("deleteChatMessage", chatMessage.uuid);
        }
        if (chatMessage.flags["pf2e-assistant"]?.process !== false) return;

        await chatMessage.delete();
    }

    async #deleteChatMessage(chatMessageUuid: ChatMessageUUID) {
        const chatMessage = await fromUuid<ChatMessagePF2e>(chatMessageUuid);
        if (!chatMessage) return;

        await game.assistant.socket.deleteChatMessage(chatMessage);
    }

    async updateChatMessage(chatMessage: ChatMessagePF2e, tokenId: string, reroll: Assistant.Reroll) {
        if (!chatMessage.canUserModify(game.user, "update")) {
            await this.#socket.executeAsGM("updateChatMessage", chatMessage.uuid, tokenId, reroll);
        }

        this.#updateQueue.add(chatMessage.update.bind(chatMessage), {
            flags: { "pf2e-assistant": { process: false, reroll: { [tokenId]: reroll } } }
        });
    }

    async #updateChatMessage(chatMessageUuid: ChatMessageUUID, tokenId: string, reroll: Assistant.Reroll) {
        const chatMessage = await fromUuid<ChatMessagePF2e>(chatMessageUuid);
        if (!chatMessage) return;

        await game.assistant.socket.updateChatMessage(chatMessage, tokenId, reroll);
    }

    async promptChoice(
        actor: ActorPF2e,
        param: {
            speaker: { actor: ActorPF2e; token: TokenDocumentPF2e };
            item?: ItemPF2e;
            target?: { actor: ActorPF2e; token: TokenDocumentPF2e };
            data: ChoiceData;
        }
    ): Promise<ChatMessageUUID[]> {
        if (!actor.canUserModify(game.user, "update")) {
            return (
                (await this.#executeAsActor(actor, "promptChoice", actor.uuid, {
                    speaker: { actor: param.speaker.actor.uuid, token: param.speaker.token.uuid },
                    item: param.item ? param.item.uuid : undefined,
                    target: param.target
                        ? { actor: param.target.actor.uuid, token: param.target.token.uuid }
                        : undefined,
                    data: param.data
                })) ?? []
            );
        }

        const flags: DeepPartial<ChatMessageFlagsPF2e> = {
            core: {
                canPopout: false
            },
            pf2e: {
                context: {
                    target: param.target
                        ? { actor: param.target.actor.uuid, token: param.target.token.uuid }
                        : undefined
                },
                origin: param.item ? param.item.getOriginData() : undefined,
                casting:
                    param.item?.isOfType("spell") && param.item.spellcasting?.statistic
                        ? {
                              id: param.item.spellcasting.id,
                              tradition: param.item.spellcasting.tradition ?? param.item.traditions.first() ?? "arcane",
                              embeddedSpell: param.item.parentItem ? param.item.toObject() : undefined
                          }
                        : undefined
            },
            "pf2e-assistant": {
                process: false
            }
        };

        const chatMessage = await ChatMessage.create({
            content: await foundry.applications.handlebars.renderTemplate(
                "modules/pf2e-assistant/templates/chat/prompt-choice.hbs",
                param.data
            ),
            flags,
            speaker: ChatMessage.getSpeaker(param.speaker),
            whisper: game.users
                .filter((user) => param.speaker.actor.canUserModify(user, "update"))
                .map((user) => user.id)
        });

        return chatMessage ? [chatMessage.uuid] : [];
    }

    async #promptChoice(
        actorUuid: ActorUUID,
        param: {
            speaker: { actor: ActorUUID; token: TokenDocumentUUID };
            item?: ItemUUID;
            target?: { actor: ActorUUID; token: TokenDocumentUUID };
            data: ChoiceData;
        }
    ): Promise<ChatMessageUUID[]> {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return [];

        const speaker = {
            actor: await fromUuid<ActorPF2e>(param.speaker.actor),
            token: await fromUuid<TokenDocumentPF2e>(param.speaker.token)
        };
        const item = param.item ? await fromUuid<ItemPF2e>(param.item) : undefined;
        const target = param.target
            ? {
                  actor: await fromUuid<ActorPF2e>(param.target.actor),
                  token: await fromUuid<TokenDocumentPF2e>(param.target.token)
              }
            : undefined;
        const data = param.data;

        if (isActorToken(speaker)) {
            return await game.assistant.socket.promptChoice(actor, {
                speaker,
                item: item ? item : undefined,
                target: isActorToken(target) ? target : undefined,
                data
            });
        }

        return [];
    }
}

interface ChoiceData {
    description: string;
    choices: Choice[];
}

interface Choice {
    label: string;
    value: string;
}
