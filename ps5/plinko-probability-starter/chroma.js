// Import chroma.js library for color manipulation
import chroma from 'chroma-js';

// Select input elements
const numBallsInput = document.querySelector('#num-balls');
const rightwardProbInput = document.querySelector('#rightward-prob');
const levelsInput = document.querySelector('#num-levels');
const speedInput = document.querySelector('#speed');
const dropButton = document.querySelector('#do-drop');
const svg = document.querySelector('svg');

// Custom easing functions
function easeOutQuad(t) {
    return t * (2 - t);
}

function easeInQuad(t) {
    return t * t;
}

// Function to generate a random ball color using chroma.js
function getRandomBallColor() {
    return chroma.random().darken(Math.random() * 2 - 1).saturate(Math.random() * 2 - 1).hex();
}

// Disable inputs while balls are falling
function disableInputs(disabled) {
    numBallsInput.disabled = disabled;
    rightwardProbInput.disabled = disabled;
    levelsInput.disabled = disabled;
    speedInput.disabled = disabled;
    dropButton.disabled = disabled;
}

// Function to animate the ball movement
async function animateBall(ball, fromX, toX, fromY, toY, duration) {
    const startTime = Date.now();
    return new Promise(resolve => {
        function step() {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const easedT = easeOutQuad(t);
            const currentX = fromX + (toX - fromX) * easedT;
            const currentY = fromY + (toY - fromY) * easedT;
            ball.setAttribute('cx', currentX);
            ball.setAttribute('cy', currentY);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        }
        step();
    });
}

// Animate drop into slot
async function animateDrop(ball, duration) {
    const startY = parseFloat(ball.getAttribute('cy'));
    const endY = startY + 20;
    const startTime = Date.now();
    return new Promise(resolve => {
        function step() {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const easedT = easeInQuad(t);
            const currentY = startY + (endY - startY) * easedT;
            const opacity = 1 - t;
            ball.setAttribute('cy', currentY);
            ball.setAttribute('opacity', opacity);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                setTimeout(() => {
                    ball.remove();
                    resolve();
                }, 200);
            }
        }
        step();
    });
}

// Clear SVG content
function clearBoard() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
}

// Redraw board with pegs and bins
function redrawBoard() {
    clearBoard();
    const levels = parseInt(levelsInput.value);
    const pegs = [];

    for (let row = 0; row < levels; row++) {
        const pegRow = [];
        for (let col = 0; col <= row; col++) {
            const cx = 200 + (col - row / 2) * 30;
            const cy = 50 + row * 30;
            const peg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            peg.setAttribute('cx', cx);
            peg.setAttribute('cy', cy);
            peg.setAttribute('r', 4);
            peg.setAttribute('fill', '#ccc');
            peg.classList.add('peg');
            svg.appendChild(peg);
            pegRow.push({ cx, cy });
        }
        pegs.push(pegRow);
    }
    svg.pegs = pegs;
}

// Drop all balls
let isDropping = false;
async function dropBalls() {
    if (isDropping) return;
    isDropping = true;
    disableInputs(true);

    const numBalls = Math.max(1, Math.min(parseInt(numBallsInput.value), 50000));
    const probRight = Math.max(0, Math.min(parseFloat(rightwardProbInput.value), 1));
    const levels = parseInt(levelsInput.value);
    const speedFactor = parseFloat(speedInput.value);
    const pegs = svg.pegs;

    for (let i = 0; i < numBalls; i++) {
        let col = 0.5;
        const ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ball.setAttribute('r', 6);
        ball.setAttribute('fill', getRandomBallColor());
        ball.setAttribute('opacity', 1);
        svg.appendChild(ball);

        let x = 200;
        let y = 20;
        ball.setAttribute('cx', x);
        ball.setAttribute('cy', y);

        for (let level = 0; level < pegs.length; level++) {
            const rowPegs = pegs[level];
            col += (Math.random() < probRight) ? 0.5 : -0.5;
            const targetPeg = rowPegs[Math.round(col)];
            const toX = targetPeg.cx;
            const toY = targetPeg.cy - 10;
            await animateBall(ball, x, toX, y, toY, 200 / speedFactor);
            x = toX;
            y = toY;
        }

        await animateDrop(ball, 300 / speedFactor);
        await new Promise(r => setTimeout(r, 30));
    }

    disableInputs(false);
    isDropping = false;
    redrawBoard();
}

// Bind button
dropButton.addEventListener('click', (e) => {
    e.preventDefault();
    dropBalls();
});

// Redraw when any input changes and not dropping
[numBallsInput, rightwardProbInput, levelsInput, speedInput].forEach(input => {
    input.addEventListener('input', () => {
        if (!isDropping) redrawBoard();
    });
});

// Initialize board on page load
document.addEventListener('DOMContentLoaded', () => {
    redrawBoard();
});
