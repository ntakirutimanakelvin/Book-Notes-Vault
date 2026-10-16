export const rules = {
    title: /^\S(?:.*\S)?$/,
    doubleSpaces: /\s{2,}/,
    duplicateWord: /\b(\w+)\s+\1\b/i,
    author: /^[A-Za-z.]+(?:[ '-][A-Za-z.]+)*$/,
    pages: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    rate: /^\d+(\.\d{1,2})?$/
};
export function validateRecord(rec) {
    const errors = {};
    const title = String(rec.title);

    if (!rules.title.test(title)) errors.title = 'No spaces at the start or end, and it cannot be empty.';
    else if (rules.doubleSpaces.test(title)) errors.title = 'Use single spaces between words.';
    else if (rules.duplicateWord.test(title)) errors.title = 'A word is repeated (e.g. "the the).';
    if (!rules.author.test(String(rec.author))) errors.author = 'Letters, dots, spaces, apostrophes and hyphens only.';

    const pages = String(rec.pages);
    if (!rules.pages.test(pages) || !Number.isInteger(parseFloat(pages)) || parseFloat(pages) < 1) {
        errors.pages = 'Use a whole number of pages, 1 or more.';
    }
    if (!rules.tag.test(String(rec.tag))) errors.tag = 'Letters, spaces and hyphens only.';
    if (!rules.date.test(String(rec.dateAdded))) errors.dateAdded = 'Use the format YYYY-MM-DD.';

    return errors;
}
export function validateImport(data) {
    if (!Array.isArray(data)) return 'File must contain a list of records.';
    for (const r of data) {
        if (typeof r!== 'object' || r == null) return 'Every record must be an object.' 
        if (typeof r.id !== 'string') return 'A record is missing its id.';
        if (typeof r.title !== 'string' || r.title === '') return `Record ${r.id}: bad title.`;
        if (typeof r.author !== 'string') return `Record ${r.id}: bad author.`;
        if (!Number.isInteger(r.pages) || r.pages < 1) return `Record ${r.id}: bad paged.`;
        if (!rules.tag.test(String(r.tag))) return `Record ${r.id}: bad tag.`;
        if (!rules.date.test(String(r.dateAdded))) return `Record ${r.id}: bad dateAdded.`;

    }
    return null;
}

export function validateMpp(text) {
    if (!rules.rate.test(text) || parseFloat(text) <= 0) return 'Minutes per page must be a number above 0, like 1.5.';
    return null;
}