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
    updateDashboard();
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
}

function reset() {
    state.weights = [];
    state.angle = 0;
    updateDashboard();
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

plank.addEventListener('click', function(e) {
    const plankRect = plank.getBoundingClientRect();
    const plankCenter = plankRect.width / 2;
    const clickX = e.clientX - plankRect.left;
    const position = clickX - plankCenter;
    addWeight(position);
});

resetBtn.addEventListener('click', reset);