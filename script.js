const plank = document.getElementById('plank');
const pivot = document.querySelector('.seesaw__pivot');
const leftTotalEl = document.getElementById('left-total');
const rightTotalEl = document.getElementById('right-total');
const angleDisplayEl = document.getElementById('angle-display');
const resetBtn = document.getElementById('reset-btn');

const state = {
    weights: [],
    angle: 0
};

function addWeight(position) {
    const weight = Math.floor(Math.random() * 10) + 1;
    state.weights.push({ weight, position });
    calculateAngle();
    updateWeights();
    updateDashboard();
    saveState();
}

function updateWeights() {
    const existingWeights = plank.querySelectorAll('.seesaw__weight');
    existingWeights.forEach(el => el.remove());

    state.weights.forEach(w => {
        const weightEl = document.createElement('div');
        weightEl.className = 'seesaw__weight';
        weightEl.textContent = w.weight;
        weightEl.style.left = `calc(50% + ${w.position}px)`;
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

plank.addEventListener('click', function(e) {
    const plankRect = plank.getBoundingClientRect();
    const plankCenter = plankRect.width / 2;
    const clickX = e.clientX - plankRect.left;
    const position = clickX - plankCenter;
    addWeight(position);
});

resetBtn.addEventListener('click', reset);

loadState();