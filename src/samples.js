import sampleData from './data/samples.json';

// Per-sample captured state: simple boolean toggle
const SAMPLES_CAPTURED_KEY = 'samples-captured';

function getCapturedSet() {
    try {
        const raw = JSON.parse(localStorage.getItem(SAMPLES_CAPTURED_KEY) || '[]');
        if (Array.isArray(raw)) return new Set(raw.map(String));
        return new Set();
    } catch {
        return new Set();
    }
}

function setSampleCaptured(sampleId, captured) {
    const capturedSet = getCapturedSet();
    if (captured) {
        capturedSet.add(String(sampleId));
    } else {
        capturedSet.delete(String(sampleId));
    }
    localStorage.setItem(SAMPLES_CAPTURED_KEY, JSON.stringify([...capturedSet]));
    return capturedSet;
}

// A sample is captured when its id is in the captured set
function isCaptured(sampleId) {
    return getCapturedSet().has(String(sampleId));
}

export { isCaptured as getSampleState, setSampleCaptured as setSampleState, isCaptured };

const popup = document.getElementById('samples-popup');
const samplesButton = document.getElementById('samples-button');
const closeSamplesButton = document.getElementById('close-samples');
const listElement = document.getElementById('samples-list');
const tabsContainer = document.getElementById('samples-tabs');
const searchInput = document.getElementById('samples-search');
const searchClear = document.getElementById('samples-search-clear');
const progressText = document.getElementById('samples-progress-text');
const progressPercent = document.getElementById('samples-progress-percent');
const progressFill = document.getElementById('samples-progress-fill');

let activeTab = 'all';
let searchQuery = '';

const CATEGORY_LABELS = {
    hologram: 'Hologram',
    'cave-painting': 'Cave Painting'
};

// External hook (set by main.js) to centre the map on a sample's location
let locateHandler = null;
let onExternalStateChange = null;
export function setLocateHandler(fn) {
    locateHandler = fn;
}

// Called by the samples browser when a sample's state changes, so open
// location popups can refresh their sample rows
export function setSampleStateListener(fn) {
    onExternalStateChange = fn;
}

function findSampleLocation(sampleId) {
    for (const sample of sampleData.samples) {
        if (sample.id === sampleId) return sample;
    }
    return null;
}

function updateProgress() {
    const total = sampleData.counts.total;
    const count = sampleData.samples.filter(s => isCaptured(s.id)).length;
    const pct = total ? Math.round((count / total) * 100) : 0;
    progressText.textContent = `${count} / ${total} captured`;
    progressPercent.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;
}

function render() {
    listElement.innerHTML = '';

    const query = searchQuery.toLowerCase();
    let visible = sampleData.samples.filter(s => {
        if (query) {
            const inText = s.id.includes(query) ||
                s.name.toLowerCase().includes(query) ||
                s.location.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query);
            if (!inText) return false;
        }
        if (activeTab === 'captured' && !isCaptured(s.id)) return false;
        if (activeTab === 'missing' && isCaptured(s.id)) return false;
        if (activeTab === 'hologram' && s.category !== 'hologram') return false;
        if (activeTab === 'cave-painting' && s.category !== 'cave-painting') return false;
        return true;
    });

    if (!visible.length) {
        listElement.innerHTML = '<div class="samples-empty">No samples match</div>';
        return;
    }

    const list = document.createElement('div');
    list.className = 'samples-grid';

    visible.forEach(s => {
        const captured = isCaptured(s.id);
        const item = document.createElement('div');
        item.className = 'sample-item' + (captured ? ' captured' : '');
        item.dataset.sampleId = s.id;

        const exactTag = s.exactCoordinates
            ? '<span class="sample-exact" title="Exact sample coordinates">◎ exact</span>'
            : '';
        item.innerHTML = `
            <button class="sample-capture-btn" data-sample-id="${s.id}" data-captured="${captured}" title="${captured ? 'Captured' : 'Not captured'}">${captured ? '✔' : '☐'}</button>
            <div class="sample-item-info">
                <div class="sample-item-name">
                    <span class="sample-item-id">${s.id}</span>
                    <span class="sample-item-title">${s.name}</span>
                    ${exactTag}
                </div>
                <div class="sample-item-loc">${s.location} · ${s.longitude}, ${s.latitude}</div>
                <div class="sample-item-note">${s.note}</div>
            </div>
            <button class="sample-locate-btn" title="Show on map">📍</button>
        `;

        list.appendChild(item);
    });

    listElement.appendChild(list);

    // Capture toggles: flip the boolean and re-render
    list.querySelectorAll('.sample-capture-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.sampleId;
            const nowCaptured = !isCaptured(id);
            setSampleCaptured(id, nowCaptured);
            btn.dataset.captured = nowCaptured;
            btn.title = nowCaptured ? 'Captured' : 'Not captured';
            btn.textContent = nowCaptured ? '✔' : '☐';
            btn.closest('.sample-item').classList.toggle('captured', nowCaptured);
            if (onExternalStateChange) onExternalStateChange(id, nowCaptured);
            updateProgress();
        });
    });

    // Locate buttons
    list.querySelectorAll('.sample-locate-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.sample-item');
            const id = item.dataset.sampleId;
            if (locateHandler) {
                popup.classList.remove('active');
                locateHandler(id);
            }
        });
    });
}

function refresh() {
    updateProgress();
    render();
}

// Open/close handling (mirrors settings popup behaviour)
samplesButton.addEventListener('click', () => {
    popup.classList.add('active');
    refresh();
    gtag('event', 'samples_open');
});

closeSamplesButton.addEventListener('click', () => {
    popup.classList.remove('active');
    gtag('event', 'samples_close', { method: 'button' });
});

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.remove('active');
        gtag('event', 'samples_close', { method: 'outside_click' });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
        popup.classList.remove('active');
        gtag('event', 'samples_close', { method: 'escape_key' });
    }
});

tabsContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.samples-tab');
    if (!tab) return;
    tabsContainer.querySelectorAll('.samples-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.tab;
    render();
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    searchClear.style.display = searchQuery ? 'block' : 'none';
    render();
});

searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    render();
    searchInput.focus();
});