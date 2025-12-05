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
    updateDashboard();
}
