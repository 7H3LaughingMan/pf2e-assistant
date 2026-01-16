import { ChoiceSetRuleElement, RollOptionRuleElement, RuleElementSource, TokenMarkRuleElement } from "foundry-pf2e";

export interface ModifyFlatDCRuleElementSource extends RuleElementSource {
    type: string;
    mode: "add" | "upgrade" | "downgrade" | "override";
    value: string | number;
    affects?: "origin" | "self";
}

export interface TreatAsRuleElementSource extends RuleElementSource {
    condition: "observed" | "concealed" | "hidden";
    treatAs: "observed" | "concaled" | "hidden";
    mode: "upgrade" | "downgrade" | "override";
    affects?: "origin" | "self";
}

export const isChoiceSet = (ruleElement: RuleElementSource): ruleElement is ChoiceSetRuleElement["_source"] =>
    ruleElement.key === "ChoiceSet";
export const isTokenMark = (ruleElement: RuleElementSource): ruleElement is TokenMarkRuleElement["_source"] =>
    ruleElement.key === "TokenMark";
export const isRollOption = (ruleElement: RuleElementSource): ruleElement is RollOptionRuleElement["_source"] =>
    ruleElement.key === "RollOption";
