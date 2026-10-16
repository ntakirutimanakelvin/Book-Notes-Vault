
import { load, save } from './storage.js';

export const state = {
    records: load('records', []),
    cap: load('cap', 0),
    mpp: load('mpp', 2),
    unit: load('unit', 'pages')
};

export function addRecord(data) {
    const now = new Date().toISOString();
    state.records.push({ id: 'rec_' + Date.now(), ...data, createdAt: now, updatedAt: now});
    save('records', state.records);
}

export function updateRecord(id, data) {
    const rec = state.records.find(r => r.id === id);
    if (!rec) return;
    Object.assign(rec, data, { updatedAt: new Date().toISOString() });
    save('records', state.records);
}

export function deleteRecord(id) {
    state.records = state.records.filter(r => r.id !== id);
    save('records', state.records);
}

export function replaceAll(list) {
    state.records = list;
    save('records', state.records);
}

export function setCap(number) {
    state.cap = number;
    save('cap', number);
}

export function setMpp(number) {
    state.mpp = number;
    save('mpp', number);
}

export function setUnit(unit) {
    state.unit = unit;
    save('unit', unit);
}

export function convert(pages) {
    if (state.unit === 'minutes') return pages * state.mpp;
    if (state.unit === 'hours') return (pages * state.mpp) / 60;
    return pages;
}

export function formatSize(pages) {
    const n = convert(pages);
    if (state.unit === 'pages') return String(n);
    return n.toFixed(state.unit === 'hours' ? 1 : 0);
}