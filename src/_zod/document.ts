import * as R from "remeda";
import * as z from "zod";

export function zDocument<T extends foundry.documents.abstract.ClientDocument>(
    type: CONST.DocumentType
): z.ZodCustom<T, T> {
    return z.custom<T>(
        (value) =>
            R.isIncludedIn(type, CONST.ALL_DOCUMENT_TYPES) &&
            R.isNonNullish(value) &&
            value instanceof getDocumentClass(type)
    );
}

export function zDocumentUUID<T extends foundry.utils.DocumentUUID>(
    type: CONST.DocumentType,
    embedded?: boolean
): z.ZodCustom<T, T> {
    return z.custom<T>((value) => {
        const resolvedUUID = R.isString(value) ? foundry.utils.parseUuid(value) : null;

        if (!resolvedUUID) return false;
        if (type && resolvedUUID.type !== type) return false;
        if (resolvedUUID.type && !R.isIncludedIn(resolvedUUID.type, CONST.ALL_DOCUMENT_TYPES)) return false;
        if (embedded === true && !resolvedUUID.embedded.length) return false;
        if (embedded === false && resolvedUUID.embedded.length) return false;
        if (!resolvedUUID.id || !foundry.data.validators.isValidId(resolvedUUID.id)) return false;

        return true;
    });
}

export function zDocumentCodec<
    I extends foundry.utils.DocumentUUID,
    O extends foundry.documents.abstract.ClientDocument
>(type: CONST.DocumentType): z.ZodCodec<z.ZodCustom<I, I>, z.ZodCustom<O, O>> {
    const document = zDocument<O>(type);
    const documentUUID = zDocumentUUID<I>(type);

    return z.codec(documentUUID, document, {
        decode: (value) => foundry.utils.fromUuid(value) as Promise<O>,
        encode: (value) => value.uuid as I
    });
}
