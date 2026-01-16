export function binaryInsert<T>(array: T[], insertValue: T, comparator: (a: T, b: T) => number) {
    if (array.length === 0 || comparator(array[0], insertValue) >= 0) {
        array.splice(0, 0, insertValue);
        return array;
    } else if (array.length > 0 && comparator(array[array.length - 1], insertValue) <= 0) {
        array.splice(array.length, 0, insertValue);
        return array;
    }
    let left = 0;
    let right = array.length;
    let leftLast = 0;
    let rightLast = right;
    while (left < right) {
        const inPos = Math.floor((right + left) / 2);
        const compared = comparator(array[inPos], insertValue);
        if (compared < 0) {
            left = inPos;
        } else if (compared > 0) {
            right = inPos;
        } else {
            right = inPos;
            left = inPos;
        }
        if (leftLast === left && rightLast === right) {
            break;
        }
        leftLast = left;
        rightLast = right;
    }
    array.splice(right, 0, insertValue);
    return array;
}
