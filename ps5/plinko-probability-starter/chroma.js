// Import chroma.js library for color manipulation
import chroma from 'chroma-js';

// Select input elements for number of balls and rightward probability
const numBallsInput = document.querySelector('#num-balls');
const rightwardProbInput = document.querySelector('#rightward-prob');

// To generate a random ball color using chroma.js
function getRandomBallColor() {
    // Generate a random color, darken and saturate it randomly, then return its hex value
    return chroma.random().darken(Math.random() * 2 - 1).saturate(Math.random() * 2 - 1).hex();
}

// To update peg color based on hit count using a color scale
function updatePegColor(peg, hitCount, maxHits) {
    // Create a color scale from white to red, mapping hit counts to maxHits
    const colorScale = chroma.scale(['white', 'red']).domain([0, maxHits]);
    // Set the peg color according to the hit count
    peg.setAttribute('fill', colorScale(hitCount).hex());
}

// Custom easing function for a smooth deceleration effect
function easeOutQuad(t) {
    return t * (2 - t);
}

// Custom easing function for a smooth acceleration effect
function easeInQuad(t) {
    return t * t;
}

// To redraw the board (placeholder for now, assume existing implementation)
function redrawBoard() {
    console.log('Redrawing board with new settings...');
}

// Disable inputs while balls are falling
function disableInputs(disabled) {
    numBallsInput.disabled = disabled;
    rightwardProbInput.disabled = disabled;
}

// Event listeners to redraw board when inputs change
numBallsInput.addEventListener('input', redrawBoard);
rightwardProbInput.addEventListener('input', redrawBoard);

// To animate the ball movement with easing
async function animateBall(ball, fromX, toX, fromY, toY, duration) {
    // Record the animation start time
    const startTime = Date.now(); 
    return new Promise(resolve => {
        function step() {
            // Calculate elapsed time
            const elapsed = Date.now() - startTime; 
            // Normalize elapsed time to [0, 1]
            const t = Math.min(elapsed / duration, 1); 
            // Apply ease-out easing
            const easedT = easeOutQuad(t); 

            // Calculate current X and Y positions
            const currentX = fromX + (toX - fromX) * easedT;
            const currentY = fromY + (toY - fromY) * easedT;

            // Update ball's position
            ball.setAttribute('cx', currentX);
            ball.setAttribute('cy', currentY);

            // Continue animation until completion
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                // Resolve the promise when animation is complete
                resolve(); 
            }
        }
        // Start animation
        step(); 
    });
}

// To animate the ball dropping with opacity change and downward movement
async function animateDrop(ball, duration) {
    // Get the ball's starting Y position
    const startY = parseFloat(ball.getAttribute('cy')); 
    // Calculate the final Y position after dropping
    const endY = startY + 20; 
    // Record the animation start time
    const startTime = Date.now(); 
    return new Promise(resolve => {
        function step() {
            // Calculate elapsed time
            const elapsed = Date.now() - startTime; 
            // Normalize elapsed time to [0, 1]
            const t = Math.min(elapsed / duration, 1); 
            // Apply ease-in easing
            const easedT = easeInQuad(t); 

            // Calculate current Y position and opacity
            const currentY = startY + (endY - startY) * easedT;
            const opacity = 1 - t;

            // Update ball's position and opacity
            ball.setAttribute('cy', currentY);
            ball.setAttribute('opacity', opacity);

            // Continue animation until completion
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                // Remove the ball after animation completes
                ball.remove(); 
                // Resolve the promise when animation is complete
                resolve(); 
            }
        }
        // Start animation
        step(); 
    });
}

// Apply the changes to the existing code structure when the document loads
document.addEventListener('DOMContentLoaded', () => {
    const balls = document.querySelectorAll('circle');
    balls.forEach(ball => {
        ball.setAttribute('fill', getRandomBallColor());
    });

    const pegs = document.querySelectorAll('circle.peg');
    let maxHits = Math.max(...Array.from(pegs).map(peg => parseInt(peg.getAttribute('data-hits')) || 0));
    pegs.forEach(peg => {
        const hitCount = parseInt(peg.getAttribute('data-hits')) || 0;
        updatePegColor(peg, hitCount, maxHits);
    });

    // Example usage: Animate the first ball for demonstration purposes
    // Disable inputs while balls are falling
    disableInputs(true); 
    animateBall(balls[0], 100, 200, 100, 300, 1000).then(() => {
        animateDrop(balls[0], 500).then(() => {
            // Re-enable inputs after balls have fallen
            disableInputs(false); 
        });
    });
});