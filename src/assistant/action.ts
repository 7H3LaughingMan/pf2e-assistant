import { PredicateStatement } from "@7h3laughingman/pf2e-types";
import { Data, Trigger } from "./data.ts";
import { Reroll } from "./reroll.ts";

export interface Action {
    trigger: Trigger;
    predicate: PredicateStatement[];
    selectors?: string[];
    process(data: Data): Promise<Reroll | void>;
}
