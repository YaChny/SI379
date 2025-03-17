// Import chroma.js library for color manipulation
import chroma from 'chroma-js';

// Function to generate a random ball color using chroma.js
function getRandomBallColor() {
    // Generate a random color, darken and saturate it randomly, then return its hex value
    return chroma.random().darken(Math.random() * 2 - 1).saturate(Math.random() * 2 - 1).hex();
}

// Function to update peg color based on hit count using a color scale
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

// Function to animate the ball movement with easing
async function animateBall(ball, fromX, toX, fromY, toY, duration) {
    const startTime = Date.now(); // Record the animation start time
    return new Promise(resolve => {
        function step() {
            const elapsed = Date.now() - startTime; // Calculate elapsed time
            const t = Math.min(elapsed / duration, 1); // Normalize elapsed time to [0, 1]
            const easedT = easeOutQuad(t); // Apply ease-out easing

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
                resolve(); // Resolve the promise when animation is complete
            }
        }
        step(); // Start animation
    });
}

// Function to animate the ball dropping with opacity change and downward movement
async function animateDrop(ball, duration) {
    const startY = parseFloat(ball.getAttribute('cy')); // Get the ball's starting Y position
    const endY = startY + 20; // Calculate the final Y position after dropping
    const startTime = Date.now(); // Record the animation start time
    return new Promise(resolve => {
        function step() {
            const elapsed = Date.now() - startTime; // Calculate elapsed time
            const t = Math.min(elapsed / duration, 1); // Normalize elapsed time to [0, 1]
            const easedT = easeInQuad(t); // Apply ease-in easing

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
                ball.remove(); // Remove the ball after animation completes
                resolve(); // Resolve the promise when animation is complete
            }
        }
        step(); // Start animation
    });
}

// Apply the changes to the existing code structure when the document loads
document.addEventListener('DOMContentLoaded', () => {
    // Select all balls and assign each a random color
    const balls = document.querySelectorAll('circle');
    balls.forEach(ball => {
        ball.setAttribute('fill', getRandomBallColor());
    });

    // Select all pegs and update their color based on hit counts
    const pegs = document.querySelectorAll('circle.peg');
    let maxHits = Math.max(...Array.from(pegs).map(peg => parseInt(peg.getAttribute('data-hits')) || 0));
    pegs.forEach(peg => {
        const hitCount = parseInt(peg.getAttribute('data-hits')) || 0;
        updatePegColor(peg, hitCount, maxHits);
    });

    // Example usage: Animate the first ball for demonstration purposes
    animateBall(balls[0], 100, 200, 100, 300, 1000).then(() => {
        animateDrop(balls[0], 500); // Drop the ball after movement
    });
});