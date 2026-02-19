import { ActorUUID, ChatMessageUUID, ItemUUID } from "@7h3laughingman/foundry-types/common/documents/_module.mjs";
import { ActorPF2e, ChatMessagePF2e, ConditionSource, ItemPF2e, ItemSourcePF2e } from "@7h3laughingman/pf2e-types";

export interface Reroll {
    updateCondition: UpdateCondition[];
    removeItem: RemoveItem[];
    addItem: AddItem[];
    deleteChatMessage: ChatMessageUUID[];
}

export interface UpdateCondition {
    actor: ActorUUID;
    id: string;
    source?: ConditionSource;
}

export interface RemoveItem {
    actor: ActorUUID;
    item: ItemUUID;
}

export interface AddItem {
    actor: ActorUUID;
    item: ItemSourcePF2e;
}

export function createReroll(): Reroll {
    return {
        updateCondition: [],
        removeItem: [],
        addItem: [],
        deleteChatMessage: []
    };
}

export async function processReroll(reroll: Maybe<Reroll>) {
    if (reroll === null || reroll === undefined) return;

    for (const data of reroll.updateCondition) {
        const actor = await fromUuid<ActorPF2e>(data.actor);

        if (actor) {
            const condition = actor.itemTypes.condition.find((c) => c.id === data.id);

            if (condition) {
                if (data.source !== undefined) {
                    await game.assistant.socket.updateEmbeddedItem(condition, data.source);
                } else {
                    await game.assistant.socket.deleteEmbeddedItem(condition);
                }
            } else if (data.source !== undefined) {
                await game.assistant.socket.createEmbeddedItem(actor, data.source);
            }
        }
    }

    for (const data of reroll.removeItem) {
        const item = await fromUuid<ItemPF2e>(data.item);

        if (item) {
            await game.assistant.socket.deleteEmbeddedItem(item);
        }
    }

    for (const data of reroll.addItem) {
        const actor = await fromUuid<ActorPF2e>(data.actor);

        if (actor) {
            await game.assistant.socket.createEmbeddedItem(actor, data.item);
        }
    }

    for (const data of reroll.deleteChatMessage) {
        const chatMessage = await fromUuid<ChatMessagePF2e>(data);

        if (chatMessage) {
            await game.assistant.socket.deleteChatMessage(chatMessage);
        }
    }
}
