import { RuleElementSource } from "@7h3laughingman/pf2e-types";

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
