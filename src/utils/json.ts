export function tryParse(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
}
