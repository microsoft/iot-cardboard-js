export function getIndentation(level: number, hasChildren: boolean) {
    const indentedLevels = level - 1;
    let indentation = 32 * indentedLevels;
    if (hasChildren) {
        indentation -= 36; // remove the space for it's own chevron
    }

    return indentation;
}
