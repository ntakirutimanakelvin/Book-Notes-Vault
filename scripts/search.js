
export function compileRegex(input, flags = 'i') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch {
        return null;
    }
}

export function escapeHtml(text) {
    return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function highlight(text, re) {
    text = String(text);
    if (!re) return escapeHtml(text);
    const globalRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    let result = '';
    let last = 0;
    for (const m of text.matchAll(globalRe)) {
        if (m[0] === '') continue;
        result += escapeHtml(text.slice(last, m.index)) + '<mark>' + escapeHtml(m[0]) + '</mark>';
        last = m.index + m[0].length;
    }
    return result + escapeHtml(text.slice(last));
}