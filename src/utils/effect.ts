import { ActorToken } from "assistant/data.ts";
import { CheckRoll, EffectSource, EffectSystemData, ItemPF2e, TokenDocumentPF2e } from "foundry-pf2e";
import { Rolled } from "foundry-pf2e/foundry/client/dice/_module.mjs";
import { Utils } from "utils.ts";

export function addContext(
    effectSource: EffectSource,
    context: {
        origin: ActorToken;
        item?: ItemPF2e;
        target?: ActorToken;
        roll?: Pick<Rolled<CheckRoll>, "total" | "degreeOfSuccess">;
    }
) {
    const item = context.item?.uuid ?? null;

    const spellcasting =
        context.item?.isOfType("spell") && context.item.spellcasting
            ? {
                  attribute: {
                      type: context.item.attribute,
                      mod: context.item.spellcasting.statistic?.attributeModifier?.value ?? 0
                  },
                  tradition: context.item.spellcasting.tradition
              }
            : null;

    const rollOptions = [
        context.origin?.actor.getSelfRollOptions("origin"),
        context.item?.getRollOptions("origin:item")
    ]
        .flat()
        .filter(Utils.Remeda.isTruthy)
        .sort();

    const origin = {
        actor: context.origin.actor.uuid,
        token: context.origin.token.uuid,
        item,
        spellcasting,
        rollOptions
    };

    const target = context.target ? { actor: context.target.actor.uuid, token: context.target.token.uuid } : null;

    const roll =
        context.roll?.total && context.roll?.degreeOfSuccess
            ? { total: context.roll.total, degreeOfSuccess: context.roll.degreeOfSuccess }
            : null;

    effectSource.system.context = {
        origin,
        target,
        roll
    };

    if (context.item?.isOfType("spell")) effectSource.system.level.value = context.item.rank;
}

export function createEffect(effectSource: PreCreate<EffectSource>): EffectSource {
    return foundry.utils.mergeObject(
        new CONFIG.PF2E.Item.documentClasses.effect({ type: "effect", name: "Effect" }).toObject(),
        effectSource
    );
}

export function setChoiceSet(
    effectSource: EffectSource,
    { flag, selection }: { flag?: string; selection: string | number | boolean }
) {
    const choiceSet = effectSource.system.rules
        .filter(Utils.Rules.isChoiceSet)
        .find((rule) => (flag === undefined ? true : rule.flag === flag));

    if (choiceSet) {
        choiceSet.selection = selection;
    }
}

export function setDuration(effectSource: EffectSource, duration: EffectSystemData["duration"]) {
    effectSource.system.duration = duration;
}

export function setTokenMark(effectSource: EffectSource, { slug, token }: { slug: string; token: TokenDocumentPF2e }) {
    const tokenMark = effectSource.system.rules.filter(Utils.Rules.isTokenMark).find((rule) => rule.slug === slug);

    if (tokenMark) {
        tokenMark.uuid = token.uuid;
    }
}
