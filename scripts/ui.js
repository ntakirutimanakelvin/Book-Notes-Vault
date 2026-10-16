import { highlight } from './search.js';

const $ = id => document.getElementById(id);

export function renderRows(records, re, show) {
    const body = $('rows');
    $('size-head').textContent = 'Size (' + show.unit + ')';
    if (records.length === 0) {
        body.innerHTML = '<tr><td>No books to show.</td></tr>';
        return;
    }
    body.innerHTML = records.map(r => `
        <tr>
        <td data-label="Title">${highlight(r.title, re)}</td>
        <td data-label="Author">${highlight(r.author, re)}</td>
        <td data-label="Tag">${highlight(r.tag, re)}</td>
        <td data-label="Size">${highlight(show.format(r.pages), re)}</td>
        <td data-label="Date added">${highlight(r.dateAdded, re)}</td>
        <td data-label="Actions">
          <button type="button" data-action="edit" data-id="${r.id}">Edit</button>
          <button type="button" class="danger" data-action="delete" data-id="${r.id}">Delete</button>
          </td>
        </tr>`).join('');
}

export function renderStats(records, cap, show) {
    const totalPages = records.reduce((sum, r) => sum + r.pages, 0);

    const byTag ={};
    records.forEach(r => { byTag[r.tag] = (byTag[r.tag] || 0) + 1;});
    const top =Object.entries(byTag).sort((a,b) => b[1] -a[1])[0];

    $('stat-count').textContent = records.length;
    $('stat-total').textContent = show.format(totalPages) + ' ' + show.unit;
    $('stat-top').textContent = top ? top[0] : '-';

    renderCap(totalPages, cap);
    renderTrend(records);
}

function renderCap(total, cap) {
    const msg = $('cap-message');
    if (!cap) {
        msg.textContent = 'No page cap set.';
        msg.className = '';
        msg.setAttribute('aria-live', 'polite');
    } else if (total > cap) {
        msg.textContent = `Over the cap by ${total - cap} pages.`;
        msg.className = 'over';
        msg.setAttribute('aria-live', 'assertive');
    } else {
        msg.textContent = `${cap - total} pages left under your cap.`;
        msg.className = 'ok';
        msg.setAttribute('aria-live', 'polite');
    }
}

function renderTrend(records) {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10))
    }
    const totals = days.map(day =>
        records.filter(r => r.dateAdded === day).reduce((s, r) => s + r.pages,0)
    );
    const max = Math.max(...totals,1);

    $('trend').innerHTML =totals.map((t, i) =>
    `<div class="bar" style="height:${(t / max) * 100}%" title="${days[i]}:${t} pages"></div>`
).join('');
}

export function showErrors(errors) {
    ['title', 'author', 'pages', 'tag', 'dateAdded'].forEach(field => {
        $(field + '-error').textContent = errors[field] || '';
        $(field).setAttribute('aria-invalid', errors[field] ? 'true' : 'false');
    });

}

export function say(id, text) {
    $(id).textContent = text;
}
