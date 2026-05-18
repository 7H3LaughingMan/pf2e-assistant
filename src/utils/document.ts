import * as R from "remeda";

import Document = foundry.abstract.Document;

export function isDocumentType<T extends Document>(value: unknown, documentName: T["documentName"]): value is T {
    return R.isNonNullish(value) && value instanceof Document && value.documentName === documentName;
}
