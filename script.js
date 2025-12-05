const plank = document.getElementById('plank');
const dropZone = document.getElementById('drop-zone');
const seesawContainer = document.querySelector('.seesaw');
const pivot = document.querySelector('.seesaw__pivot');
const leftTotalEl = document.getElementById('left-total');
const rightTotalEl = document.getElementById('right-total');
const angleDisplayEl = document.getElementById('angle-display');
const resetBtn = document.getElementById('reset-btn');
const lastWeightEl = document.getElementById('last-weight');

const state = {
    weights: [],
    angle: 0,
    nextWeight: Math.floor(Math.random() * 10) + 1
};

let previewEl = null;
let projectionLine = null;
let positionLabel = null;

function getWeightSize(weight) {
    return 24 + (weight - 1) * 2;
}

function generateNextWeight() {
    state.nextWeight = Math.floor(Math.random() * 10) + 1;
    updatePreview();
}

function addWeight(position) {
    const weight = state.nextWeight;
    const size = getWeightSize(weight);

    // Plank top: 60px, weight bottom 10px above plank bottom (70px)
    // Weight top = 60 - size (plank bottom - 10 - size = 70 - 10 - size = 60 - size)
    const endTop = 60 - size + 10; // +10 küçük ayarlama

    const fallingWeight = document.createElement('div');
    fallingWeight.className = 'seesaw__weight seesaw__weight--falling';
    fallingWeight.textContent = weight;
    fallingWeight.style.left = `calc(50% + ${position}px)`;
    fallingWeight.style.width = `${size}px`;
    fallingWeight.style.height = `${size}px`;
    fallingWeight.style.setProperty('--end-top', `${endTop}px`);
    seesawContainer.appendChild(fallingWeight);

    const side = position < 0 ? 'L' : 'R';
    lastWeightEl.textContent = `${weight}kg @ ${Math.round(position)}px (${side})`;

    generateNextWeight();

    setTimeout(() => {
        fallingWeight.remove();
        state.weights.push({ weight, position });
        calculateAngle();
        updateWeights();
        updateDashboard();
        saveState();
    }, 600);
}

function updateWeights() {
    const existingWeights = plank.querySelectorAll('.seesaw__weight:not(.seesaw__weight--preview)');
    existingWeights.forEach(el => el.remove());

    state.weights.forEach(w => {
        const size = getWeightSize(w.weight);
        const weightEl = document.createElement('div');
        weightEl.className = 'seesaw__weight';
        weightEl.textContent = w.weight;
        weightEl.style.left = `calc(50% + ${w.position}px)`;
        weightEl.style.width = `${size}px`;
        weightEl.style.height = `${size}px`;
        plank.appendChild(weightEl);
    });
}

function removeWeight(index) {
    state.weights.splice(index, 1);
    updateDashboard();
}

function updateDashboard() {
    const leftTotal = state.weights
        .filter(w => w.position < 0)
        .reduce((acc, w) => acc + w.weight, 0);

    const rightTotal = state.weights
        .filter(w => w.position > 0)
        .reduce((acc, w) => acc + w.weight, 0);

    leftTotalEl.textContent = leftTotal;
    rightTotalEl.textContent = rightTotal;
    angleDisplayEl.textContent = state.angle;

    plank.style.transform = `rotate(${state.angle}deg)`;
}

function reset() {
    state.weights = [];
    state.angle = 0;
    updateWeights();
    updateDashboard();
    saveState();
}

function calculateAngle() {
    const leftTorque = state.weights
        .filter(w => w.position < 0)
        .reduce((acc, w) => acc + (w.weight * Math.abs(w.position)), 0);

    const rightTorque = state.weights
        .filter(w => w.position > 0)
        .reduce((acc, w) => acc + (w.weight * w.position), 0);

    state.angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
    state.angle = Math.round(state.angle);
}

function saveState() {
    localStorage.setItem('seesawState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('seesawState');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.weights && Array.isArray(parsed.weights)) {
            state.weights = parsed.weights;
            state.angle = parsed.angle || 0;
            updateWeights();
            updateDashboard();
        }
    }
}

function renderScale() {
    const tickPositions = [-250, -200, -150, -100, -50, 0, 50, 100, 150, 200, 250];

    tickPositions.forEach(pos => {
        const tick = document.createElement('div');
        tick.className = pos === 0 ? 'seesaw__tick seesaw__tick--center' : 'seesaw__tick';
        tick.style.left = `calc(50% + ${pos}px)`;
        plank.appendChild(tick);

        const label = document.createElement('div');
        label.className = 'seesaw__tick-label';
        label.textContent = pos;
        label.style.left = `calc(50% + ${pos}px)`;
        plank.appendChild(label);
    });
}

dropZone.addEventListener('click', function(e) {
    const zoneRect = dropZone.getBoundingClientRect();
    const zoneCenter = zoneRect.width / 2;
    const clickX = e.clientX - zoneRect.left;
    const position = clickX - zoneCenter;
    addWeight(position);
});

plank.addEventListener('click', function(e) {
    const plankRect = plank.getBoundingClientRect();
    const plankCenter = plankRect.width / 2;
    const clickX = e.clientX - plankRect.left;
    const position = clickX - plankCenter;
    addWeight(position);
});

resetBtn.addEventListener('click', reset);

function createPreview() {
    previewEl = document.createElement('div');
    previewEl.className = 'seesaw__weight seesaw__weight--preview';
    dropZone.appendChild(previewEl);

    projectionLine = document.createElement('div');
    projectionLine.className = 'seesaw__projection-line';
    dropZone.appendChild(projectionLine);

    positionLabel = document.createElement('div');
    positionLabel.className = 'seesaw__position-label';
    dropZone.appendChild(positionLabel);

    updatePreview();
}

function updatePreview() {
    if (!previewEl) return;
    const size = getWeightSize(state.nextWeight);
    previewEl.textContent = state.nextWeight;
    previewEl.style.width = `${size}px`;
    previewEl.style.height = `${size}px`;
}

function showPreview(x, y, position) {
    if (!previewEl) return;

    const size = getWeightSize(state.nextWeight);
    const previewY = y + 25;
    const zoneHeight = dropZone.offsetHeight;
    const lineHeight = zoneHeight - previewY - (size / 2);

    previewEl.style.left = `${x}px`;
    previewEl.style.top = `${previewY}px`;
    previewEl.style.display = 'flex';

    projectionLine.style.left = `${x}px`;
    projectionLine.style.top = `${previewY + (size / 2)}px`;
    projectionLine.style.height = `${lineHeight}px`;
    projectionLine.style.display = 'block';

    const side = position < 0 ? 'L' : position > 0 ? 'R' : '•';
    positionLabel.textContent = `${position} (${side})`;
    positionLabel.style.left = `${x + 20}px`;
    positionLabel.style.top = `${zoneHeight - 30}px`;
    positionLabel.style.display = 'block';
}

function hidePreview() {
    if (!previewEl) return;
    previewEl.style.display = 'none';
    projectionLine.style.display = 'none';
    positionLabel.style.display = 'none';
}

dropZone.addEventListener('mousemove', function(e) {
    const zoneRect = dropZone.getBoundingClientRect();
    const zoneCenter = zoneRect.width / 2;
    const mouseX = e.clientX - zoneRect.left;
    const mouseY = e.clientY - zoneRect.top;
    const position = Math.round(mouseX - zoneCenter);

    showPreview(mouseX, mouseY, position);
});

dropZone.addEventListener('mouseleave', function() {
    hidePreview();
});

renderScale();
createPreview();
loadState();