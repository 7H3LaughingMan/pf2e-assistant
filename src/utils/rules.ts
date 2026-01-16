import { ChoiceSetRuleElement, RollOptionRuleElement, RuleElementSource, TokenMarkRuleElement } from "foundry-pf2e";

export const isChoiceSet = (ruleElement: RuleElementSource): ruleElement is ChoiceSetRuleElement["_source"] =>
    ruleElement.key === "ChoiceSet";
export const isTokenMark = (ruleElement: RuleElementSource): ruleElement is TokenMarkRuleElement["_source"] =>
    ruleElement.key === "TokenMark";
export const isRollOption = (ruleElement: RuleElementSource): ruleElement is RollOptionRuleElement["_source"] =>
    ruleElement.key === "RollOption";
