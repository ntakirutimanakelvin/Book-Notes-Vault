const PREFIX = 'vault:';

export function load(key, fallback) {
    try {
        const text = localStorage.getItem(PREFIX + key);
        return text ? JSON.parse(text) : fallback;
    }   catch (err) {
        console.error('Could not load', key, err);
        return fallback;
    }
}

export function save(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
}