import { state, addRecord, updateRecord, deleteRecord, replaceAll, setCap, setMpp, setUnit, formatSize } from './state.js';
import { validateRecord, validateImport, validateMpp } from './validators.js';
import { compileRegex } from'./search.js';
import { renderRows, renderStats, showErrors, say } from './ui.js';

const $ = id =>document.getElementById(id);
const FIELDS  = ['title', 'author', 'pages', 'tag', 'dateAdded'];

function refresh() {
    const flags = $('case-toggle').checked ? 'i' : '';
    const pattern = $('search').value;
    const re = compileRegex(pattern, flags);
    const show ={ unit: state.unit, format: formatSize };

    if (pattern && !re) say('search-status', 'That pattern is not a valid regex.');
    else if (re) say('search-status', 'Regex search is on.');
    else say('search-status', '');

    let list = state.records.filter(r =>
        !re || re.test(`${r.title} ${r.author} ${r.tag} ${formatSize(r.pages)} ${r.dateAdded}`));

    const sorters = {
        'date-desc': (a, b) => b.dateAdded.localeCompare(a.dateAdded),
        'date-asc': (a, b) => a.dateAdded.localeCompare(b.dateAdded),
        'title-asc': (a, b) => a.title.localeCompare(b.title),
        'title-desc': (a, b) => b.title.localeCompare(a.title),
        'pages-asc': (a, b) => a.pages - b.pages,
        'pages-desc': (a, b) => b.pages - a.pages
    };
    list.sort(sorters[$('sort').value]);

    renderRows(list, re, show);
    renderStats(state.records, state.cap, show);
}

function resetForm() {
    $('book-form').reset();
    $('edit-id').value = '';
    $('form-title').textContent = 'Add book';
    $('cancel-btn').hidden = true;
    showErrors({});
}

$('book-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = {};
    FIELDS.forEach(f => { data[f] = $(f).value; });

    const errors =validateRecord(data);
    showErrors(errors);
    if (Object.keys(errors).length > 0) {
        say('form-status', 'Please fix the errors above.');
        return;
    }

    data.pages = parseInt(data.pages, 10);
    const id = $('edit-id').value;
    if (id) updateRecord(id, data); else addRecord(data);

    say('form-status', id ? 'Book updated.' : 'Book added.');
    resetForm();
    refresh();
});

$('cancel-btn').addEventListener('click', resetForm);

$('rows').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.action ==='delete') {
        if (confirm('Delete this book?')) {
            deleteRecord(id);
            refresh();
        }
    } 
    else if (btn.dataset.action ==='edit') {
        const rec = state.records.find(r => r.id === id);
        FIELDS.forEach(f => { $(f).value =rec[f]; });
        $('edit-id').value= rec.id;
        $('form-title').textContent = 'Edit book';
        $('cancel-btn').hidden = false;
        $('title').focus();
    }
});

['search', 'case-toggle', 'sort'].forEach(id => $(id).addEventListener('input', refresh));

$('show-unit').addEventListener('change', () => {
    setUnit($('show-unit').value);
    refresh();
})

$('save-settings').addEventListener('click', () => {
    const capText = $('cap').value.trim() || '0';
    if (!/^(0|[1-9]\d*)$/.test(capText)) {
        say('settings-status', 'Cap must be a whole number of pages, like 5000.');
        return;
    }
    const mppProblem = validateMpp($('mpp').value.trim());
    if (mppProblem) { say('settings-status', mppProblem); return; }

    setCap(parseInt(capText, 10));
    setMpp(parseFloat($('mpp').value));
    say('settings-status', 'Settings saved.');
    refresh();
});

$('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.records, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vault-data.json';
    link.click();
    URL.revokeObjectURL(link.href);
});

$('import-file').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const data = JSON.parse(await file.text());
        const problem = validateImport(data);
        if (problem) { say('settings-status', 'Import failed: ' + problem); return; }

        replaceAll(data);
        say('settings-status', `Imported ${data.length} records.`);
        refresh();
    } catch {
        say('settings-status', 'Import failed: file is not valid JSON.');
    }
});

$('seed-btn').addEventListener('click', async () => {
    try {
        const res =await fetch('seed.json');
        replaceAll(await res.json());
        say('settings-status', 'Sample data loaded.');
        refresh();
    } catch {
        say('settings-status', 'Could not load seed.json (run ith a local server).');
    }
});

$('cap').value = state.cap || '';
$('mpp').value = state.mpp;
$('show-unit').value = state.unit;
refresh();
