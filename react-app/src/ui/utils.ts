export function redirect(hashPath: string) {
    const hash = `#${hashPath}`;
    if (window.parent) {
        window.parent.location.hash = hash;
    } else {
        window.location.hash = hash;
    }
}