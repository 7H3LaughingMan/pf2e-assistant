import { Assistant } from "assistant.ts";
import {
    ActorPF2e,
    ChatMessageFlagsPF2e,
    ChatMessagePF2e,
    CheckDC,
    CheckDCReference,
    ConditionPF2e,
    ConditionSlug,
    ConditionSource,
    EffectSystemData,
    ItemPF2e,
    ItemSourcePF2e,
    SaveType,
    TokenDocumentPF2e
} from "foundry-pf2e";
import {
    ActorUUID,
    ChatMessageUUID,
    ItemUUID,
    TokenDocumentUUID
} from "foundry-pf2e/foundry/common/documents/_module.mjs";
import { Utils } from "utils.ts";
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
        data: SocketTypes.Effect.AddEffectData
    ): Promise<RemoveItem[]> {
        const effect = await fromUuid<ItemPF2e>(effectUuid);
        if (!effect?.isOfType("effect")) return [];

        const item = data.item?.uuid ?? null;
        const spellcasting =
            data.item?.isOfType("spell") && data.item.spellcasting
                ? {
                      attribute: {
                          type: data.item.attribute,
                          mod: data.item.spellcasting.statistic?.attributeModifier?.value ?? 0
                      },
                      tradition: data.item.spellcasting.tradition
                  }
                : null;
        const rollOptions = [data.origin.actor.getSelfRollOptions("origin"), data.item?.getRollOptions("origin:item")]
            .flat()
            .filter(Utils.Remeda.isTruthy);

        const origin = {
            actor: data.origin.actor.uuid,
            token: data.origin.token.uuid,
            item,
            spellcasting,
            rollOptions
        };
        const target = data.target ? { actor: data.target.actor.uuid, token: data.target.token.uuid } : null;
        const roll =
            data.roll?.total && data.roll?.degreeOfSuccess
                ? { total: data.roll.total, degreeOfSuccess: data.roll.degreeOfSuccess }
                : null;

        const effectSource = effect.toObject();
        effectSource.system.context = {
            origin,
            target,
            roll
        };

        if (data.duration) {
            effectSource.system.duration = data.duration;
        }

        if (data.choiceSet) {
            const choiceSet = effectSource.system.rules
                .filter(Utils.Rules.isChoiceSet)
                .find((rule) => (data.choiceSet?.flag === undefined ? true : rule.flag === data.choiceSet.flag));

            if (choiceSet) {
                choiceSet.selection = data.choiceSet.selection;
            }
        }

        if (data.tokenMark) {
            const tokenMark = effectSource.system.rules
                .filter(Utils.Rules.isTokenMark)
                .find((rule) => rule.slug === data.tokenMark?.slug);

            if (tokenMark) {
                tokenMark.uuid = data.tokenMark.token.uuid;
            }
        }

        if (data.item?.isOfType("spell")) effectSource.system.level.value = data.item.rank;

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
                const newValue = Utils.Remeda.isNumber(currentValue) ? Math.max(currentValue - (value ?? 1), 0) : null;
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
            const conditionValue = Utils.Remeda.isNumber(conditionSource.system.value.value)
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
        const conditionValue = Utils.Remeda.isNumber(conditionSource.system.value.value)
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

    async rollSave(actor: ActorPF2e, save: SaveType, args: SocketTypes.Save.RollParameters) {
        if (!actor.canUserModify(game.user, "update")) {
            await this.#executeAsActor(actor, "rollSave", actor.uuid, save, {
                origin: args.origin?.uuid,
                dc: args.dc,
                extraRollOptions: args.extraRollOptions,
                skipDialog: args.skipDialog
            });
            return;
        }

        await actor.saves?.[save]?.roll(args);
    }

    async #rollSave(actorUuid: ActorUUID, save: SaveType, args: SocketTypes.Save.SerializedRollParameters) {
        const actor = await fromUuid<ActorPF2e>(actorUuid);
        if (!actor) return;

        await game.assistant.socket.rollSave(actor, save, {
            origin: args.origin ? await fromUuid<ActorPF2e>(args.origin) : undefined,
            dc: args.dc,
            extraRollOptions: args.extraRollOptions,
            skipDialog: args.skipDialog
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

        this.#updateQueue.add(chatMessage.update, {
            flags: { "pf2e-assistant": { process: false, reroll: { [tokenId]: reroll } } }
        });
    }

    async #updateChatMessage(chatMessageUuid: ChatMessageUUID, tokenId: string, reroll: Assistant.Reroll) {
        const chatMessage = await fromUuid<ChatMessagePF2e>(chatMessageUuid);
        if (!chatMessage) return;

        await game.assistant.socket.updateChatMessage(chatMessage, tokenId, reroll);
    }

    async promptChoice(actor: ActorPF2e, param: SocketTypes.Prompt.ChoiceParameters): Promise<ChatMessageUUID[]> {
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
        param: SocketTypes.Prompt.SerializedChoiceParameters
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

        if (SocketTypes.isActorToken(speaker)) {
            return await game.assistant.socket.promptChoice(actor, {
                speaker,
                item: item ? item : undefined,
                target: SocketTypes.isActorToken(target) ? target : undefined,
                data
            });
        }

        return [];
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SocketTypes {
    export function isActorToken(data?: {
        actor: Maybe<ActorPF2e>;
        token: Maybe<TokenDocumentPF2e>;
    }): data is ActorToken {
        return Utils.Remeda.isNonNullish(data?.actor) && Utils.Remeda.isNonNullish(data?.token);
    }

    export interface ActorToken {
        actor: ActorPF2e;
        token: TokenDocumentPF2e;
    }

    export interface SerializedActorToken {
        actor: ActorUUID;
        token: TokenDocumentUUID;
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Effect {
        export interface AddEffectData {
            origin: ActorToken;
            item?: ItemPF2e;
            target?: ActorToken;
            roll?: NonNullable<EffectSystemData["context"]>["roll"];
            duration?: EffectSystemData["duration"];
            choiceSet?: { flag?: string; selection: string | number | boolean };
            tokenMark?: { slug: string; token: TokenDocumentPF2e };
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Prompt {
        export interface SerializedChoiceParameters {
            speaker: { actor: ActorUUID; token: TokenDocumentUUID };
            item?: ItemUUID;
            target?: { actor: ActorUUID; token: TokenDocumentUUID };
            data: ChoiceData;
        }

        export interface ChoiceParameters {
            speaker: { actor: ActorPF2e; token: TokenDocumentPF2e };
            item?: ItemPF2e;
            target?: { actor: ActorPF2e; token: TokenDocumentPF2e };
            data: ChoiceData;
        }

        export interface ChoiceData {
            description: string;
            choices: Choice[];
        }

        export interface Choice {
            label: string;
            value: string;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Save {
        export interface RollParameters {
            origin?: Maybe<ActorPF2e>;
            dc?: CheckDC | CheckDCReference | number | null;
            extraRollOptions?: string[];
            skipDialog?: boolean;
        }

        export interface SerializedRollParameters {
            origin?: ActorUUID;
            dc?: CheckDC | CheckDCReference | number | null;
            extraRollOptions?: string[];
            skipDialog?: boolean;
        }
    }
}
