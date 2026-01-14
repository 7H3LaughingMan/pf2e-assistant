import { ChoiceSetSource, RuleElementSource } from "foundry-pf2e";

export interface TokenMarkSource extends RuleElementSource {
    uuid?: JSONValue;
}

export interface RollOptionSource extends RuleElementSource {
    domain?: JSONValue;
    option?: JSONValue;
    toggleable?: JSONValue;
    suboptions?: JSONValue;
    value?: JSONValue;
    selection?: JSONValue;
    disabledIf?: JSONValue;
    disabledValue?: JSONValue;
    count?: JSONValue;
    removeAfterRoll?: JSONValue;
}

export const isChoiceSet = (ruleElement: RuleElementSource): ruleElement is ChoiceSetSource =>
    ruleElement.key === "ChoiceSet";
export const isTokenMark = (ruleElement: RuleElementSource): ruleElement is TokenMarkSource =>
    ruleElement.key === "TokenMark";
export const isRollOption = (ruleElement: RuleElementSource): ruleElement is RollOptionSource =>
    ruleElement.key === "RollOption";
