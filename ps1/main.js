let score = 0;

// Write code that *every second*, picks a random unwhacked hole (use getRandomUnwhackedHoleId)
// and adds the "needs-whack" class
const interval = setInterval(() => {
    // Get ID of a random empty hole
    if (getRandomUnwhackedHoleId()){
        //adds the class
        document.getElementById(getRandomUnwhackedHoleId()).classList.add("needs-whack");
    }
}, 1000);

for(const id of getAllHoleIds()) {
    // Write code that adds a "click" listener to the element with this id
    const hole = document.getElementById(id);
    hole.addEventListener("click", () => {
    //     When the user clicks on it, *if* the element has class "needs-whack" then:
        if (hole.classList.contains("needs-whack")) {
            //          1. Remove the "needs-whack" class
            hole.classList.remove("needs-whack");
            //          2. Add the "animating-whack" class *for 500 milliseconds*
            hole.classList.add("animating-whack");
            setTimeout(() => {
                hole.classList.remove("animating-whack");
            }, 500);
            //          3. Increment the score by 1 (and update the score display)
            score += 1;
            document.getElementById("score").textContent = `Score: ${score}`;
            //          4. If the score is 45 or higher, stop the game (by clearing the interval)
            if (score >= 45) {
                clearInterval(interval);
            }
        }
    });
}

/**
 * @returns a random ID of a hole that is "idle" (doesn't currently contain a mole/buckeye). If there are none, returns null
 */
function getRandomUnwhackedHoleId() {
    const inactiveHoles = document.querySelectorAll('.hole:not(.needs-whack)');  // Selects elements that have class "hole" but **not** "needs-whack"

    if(inactiveHoles.length === 0) {
        return null;
    } else {
        const randomIndex = Math.floor(Math.random() * inactiveHoles.length);
        return inactiveHoles[randomIndex].getAttribute('id');
    }
}

/**
 * @returns a list of IDs (as strings) for each hole DOM element
 */
function getAllHoleIds() {
    const allHoles = document.querySelectorAll('.hole'); 
    const ids = [];
    for(const hole of allHoles) {
        ids.push(hole.getAttribute('id'));
    }
    return ids;
}