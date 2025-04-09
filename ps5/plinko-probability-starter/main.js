// Import chroma.js library for color manipulation
import chroma from 'chroma-js';
import { getBinomialProbability } from './utils.js';

const BALL_RADIUS = 10;
const PEG_RADIUS = 4;
const X_MOVEMENT = 30;
const Y_MOVEMENT = 30;
const GRAPH_HEIGHT = 300;
const PADDING = 20;
const DELAY_BETWEEN_PEGS = 1000;
const DELAY_WHEN_DROP = 1000;

const svg = document.querySelector('svg');
const numBallsInput = document.querySelector('#num-balls');
const rightwardProbInput = document.querySelector('#rightward-prob');
const levelsInput = document.querySelector('#num-levels');
const speedInput = document.querySelector('#speed');
const dropButton = document.querySelector('#do-drop');

let isDropping = false;
const pegs = [];
const actualBars = [];
const expectedBars = [];

function disableInputs(disabled) {
    [numBallsInput, rightwardProbInput, levelsInput, speedInput, dropButton].forEach(input => {
        input.disabled = disabled;
    });
}

function clearSVG() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    pegs.length = 0;
    actualBars.length = 0;
    expectedBars.length = 0;
}

function getGraphicLocation(col, row) {
    return {
        x: PADDING + col * (X_MOVEMENT / 2),
        y: PADDING + row * Y_MOVEMENT
    };
}

function createCircle(cx, cy, r, strokeColor, parent) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);

    // If this is a peg (determined by radius), don't show outline
    if (r === PEG_RADIUS) {
        circle.setAttribute('fill', chroma(strokeColor).hex());
        circle.setAttribute('stroke', 'none');
    } else {
        // For balls
        circle.setAttribute('fill', chroma(strokeColor).alpha(0.3).hex());
        circle.setAttribute('stroke', strokeColor);
        circle.setAttribute('stroke-width', 2);
    }
    circle.setAttribute('stroke-width', 2);
    parent.appendChild(circle);
    return circle;
}

function createRect(x, y, width, height, fill, stroke, parent) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    parent.appendChild(rect);
    return rect;
}

function redrawBoard() {
    clearSVG();
    const numLevels = parseInt(levelsInput.value);
    const probRight = parseFloat(rightwardProbInput.value);
    const mode = Math.round((numLevels - 1) * probRight);
    const maxProb = getBinomialProbability(numLevels - 1, mode, probRight);
    const BAR_SCALE = GRAPH_HEIGHT * 0.5 / maxProb;

    const width = (numLevels - 1) * X_MOVEMENT + 2 * PADDING;
    const height = (numLevels - 1) * Y_MOVEMENT + GRAPH_HEIGHT + 2 * PADDING;
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    for (let row = 0; row < numLevels; row++) {
        const pegRow = [];
        for (let i = numLevels - row - 1; i <= numLevels + row - 1; i += 2) {
            const { x, y } = getGraphicLocation(i, row);
            const peg = createCircle(x, y, PEG_RADIUS, '#888', svg);
            if (row > 0) peg.style.display = 'none';
            peg.dataset.hit = '0';
            pegRow[i] = peg;
        }
        pegs[row] = pegRow;
    }

    for (let i = 0; i < 2 * numLevels - 1; i += 2) {
        const { x, y } = getGraphicLocation(i, numLevels - 1);
        const barY = y + PEG_RADIUS + 2;
        const actualBar = createRect(x - X_MOVEMENT / 2, barY, X_MOVEMENT, 0, '#2F65A7', 'none', svg);
        actualBars.push(actualBar);
        const p = getBinomialProbability(numLevels - 1, i / 2, probRight);
        const expectedHeight = p * BAR_SCALE;
        const expectedBar = createRect(x - X_MOVEMENT / 2, barY, X_MOVEMENT, expectedHeight, 'rgba(0,0,0,0.1)', '#2F65A7', svg);
        expectedBars.push(expectedBar);
    }
    svg.hitCounts = new Array(2 * numLevels - 1).fill(0);
    svg.BAR_SCALE = BAR_SCALE;
}

function updatePegColor(peg) {
    peg.style.display = 'inline';
    const count = parseInt(peg.dataset.hit);
    const colorScale = chroma.scale(['#3366ff', '#000066']).domain([0, 20]);
    peg.setAttribute('fill', colorScale(count).hex());
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function easeInQuad(t) {
    return t * t;
}

async function animateBall(ball, fromX, toX, fromY, toY, duration) {
    const startTime = Date.now();
    return new Promise(resolve => {
        function step() {
            const t = Math.min((Date.now() - startTime) / duration, 1);
            const easedT = easeOutQuad(t);
            const x = fromX + (toX - fromX) * easedT;
            const y = fromY + (toY - fromY) * easedT;
            ball.setAttribute('cx', x);
            ball.setAttribute('cy', y);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        }
        step();
    });
}

async function animateDrop(ball, bar, targetHeight, duration) {
    const y0 = parseFloat(ball.getAttribute('cy'));
    const y1 = y0 + 20;
    const h0 = parseFloat(bar.getAttribute('height'));
    const h1 = targetHeight;
    const startTime = Date.now();

    return new Promise(resolve => {
        function step() {
            const t = Math.min((Date.now() - startTime) / duration, 1);
            const easedY = easeOutQuad(t);
            const easedH = easeInQuad(t);
            const newY = y0 + (y1 - y0) * easedY;
            const newOpacity = 1 - t;
            const newHeight = h0 + (h1 - h0) * easedH;
            ball.setAttribute('cy', newY);
            ball.setAttribute('opacity', newOpacity);
            bar.setAttribute('height', newHeight);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                ball.remove();
                resolve();
            }
        }
        step();
    });
}

async function dropSingleBall(numLevels, probRight, ballColor, numBalls) {
    let col = numLevels - 1;
    let row = 0;
    const { x, y } = getGraphicLocation(col, row);
    const ball = createCircle(x, y, BALL_RADIUS, ballColor, svg);

    for (let i = 0; i < numLevels - 1; i++) {
        row++;
        col += Math.random() < probRight ? 1 : -1;
        const { x: nx, y: ny } = getGraphicLocation(col, row);
        await animateBall(ball, parseFloat(ball.getAttribute('cx')), nx, parseFloat(ball.getAttribute('cy')), ny, DELAY_BETWEEN_PEGS / parseFloat(speedInput.value));
        const peg = pegs[row][col];
        if (peg) {
            peg.dataset.hit = parseInt(peg.dataset.hit) + 1;
            updatePegColor(peg);
        }
    }

    const barIndex = Math.floor(col / 2);
    svg.hitCounts[barIndex]++;
    const height = svg.BAR_SCALE * svg.hitCounts[barIndex] / numBalls;
    await animateDrop(ball, actualBars[barIndex], height, DELAY_WHEN_DROP / parseFloat(speedInput.value));
}

async function dropBalls() {
    if (isDropping) return;
    isDropping = true;
    disableInputs(true);

    const numBalls = parseInt(numBallsInput.value);
    const numLevels = parseInt(levelsInput.value);
    const probRight = parseFloat(rightwardProbInput.value);

    const allDrops = [];

    for (let i = 0; i < numBalls; i++) {
        const color = chroma.random().hex();
        const dropPromise = dropSingleBall(numLevels, probRight, color, numBalls);
        allDrops.push(dropPromise);
        await new Promise(r => setTimeout(r, 50)); // allow staggered starts
    }

    await Promise.all(allDrops); // wait for all balls to finish
    isDropping = false;
    disableInputs(false);
}

dropButton.addEventListener('click', e => {
    redrawBoard();
    e.preventDefault();
    if (!isDropping) {
        dropBalls();
    }
});

[numBallsInput, rightwardProbInput, levelsInput, speedInput].forEach(input => {
    input.addEventListener('input', () => {
        if (!isDropping) redrawBoard();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    redrawBoard();
});
