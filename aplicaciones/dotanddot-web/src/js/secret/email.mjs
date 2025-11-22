export function maskEmail(email, showStart = 5, showEnd = 5) {
    if (typeof email !== 'string') return '';
    const trimmed = email.trim();
    const atIndex = trimmed.indexOf('@');
    if (atIndex <= 0) return trimmed;

    const local = trimmed.slice(0, atIndex);
    const domain = trimmed.slice(atIndex + 1);
    if (local.length <= showStart + showEnd) {
        return `${local}@${domain}`;
    }

    const start = local.slice(0, showStart);
    const end = local.slice(local.length - showEnd);
    const middle = '*'.repeat(local.length - showStart - showEnd);

    return `${start}${middle}${end}@${domain}`;
}