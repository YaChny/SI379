document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "https://the-trivia-api.com/api/questions?limit=10";

    // Select question and score elements
    const questionBox = document.getElementById("questions");
    const scoreDisplay = document.getElementById("score");

    // Set up and initialize score values
    let score = 0;
    let attemptCount = 0;

    // To shuffle an array
    function shuffleArray(array) {
        const shuffledArray = array.slice(); // Copy the array
    
        // Shuffle the copy of the array using https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
        for (let i = shuffledArray.length - 1; i > 0; i--) { // For each index,
            const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements i and j
        }
        return shuffledArray; // Return the shuffled copy
    }

    // async function fetchWithCache(url, options = {}, cacheDuration = 1000 * 60 * 60) {
    //     function getResponseObject(data) {
    //         return new Response(new Blob([JSON.stringify(data)]));
    //     }

    //     const cachedData = localStorage.getItem(url);
    //     if (cachedData) {
    //         const { timestamp, data } = JSON.parse(cachedData);
    //         if (Date.now() - timestamp < cacheDuration) {
    //             return Promise.resolve(getResponseObject(data));
    //         } else {
    //             localStorage.removeItem(url);
    //         }
    //     }

    //     return fetch(url, options)
    //         .then(response => response.json())
    //         .then(data => {
    //             localStorage.setItem(url, JSON.stringify({ timestamp: Date.now(), data }));
    //             return getResponseObject(data);
    //         });
    // }

    // To fetch questions from API
    async function fetchQuestions() {
        try {
            // Fetch questions from API
            const response = await fetch(API_URL);
            // Parse JSON response
            const questions = await response.json();
            // Display the questions on the page
            displayQuestions(questions);
        } catch (error) {
            // Log errors to console
            console.error("Error fetching questions:", error);
            // Display error message
            questionBox.innerHTML = "Failed to load questions. Please try again.";
        }
    }

    // To display questions and answers
    function displayQuestions(questions) {
        // Clear any existing questions
        questionBox.innerHTML = "";
        questions.forEach((questionData, index) => {
            // Create a container for the question
            const questionElement = document.createElement("div");
            // Add CSS class to the question element
            questionElement.classList.add("question");

            // Create a paragraph for the question prompt
            const prompt = document.createElement("p");
            // Set question text
            prompt.textContent = questionData.question;
            // Add prompt to the question element
            questionElement.appendChild(prompt);

            // Combine and shuffle the correct and incorrect answers
            const answers = shuffleArray([...questionData.incorrectAnswers, questionData.correctAnswer]);
            answers.forEach(answer => {
                // Create button for each answer
                const button = document.createElement("button");
                // Set button text
                button.textContent = answer;
                // Set click event
                button.onclick = () => handleAnswer(button, answer, questionData.correctAnswer, index);
                // Add the button to the question element
                questionElement.appendChild(button);
            });

            // Append question element to the container
            questionBox.appendChild(questionElement);
        });
    }

    // To handle answer selection
    function handleAnswer(button, selectedAnswer, correctAnswer, index) {
        // Get all buttons in the question block
        const buttons = button.parentElement.querySelectorAll("button");
        // Disable all buttons to prevent re-selection
        buttons.forEach(btn => btn.disabled = true);
        // Increase attempted questions count
        attemptCount++;


        if (selectedAnswer === correctAnswer) {
            // Increase score if correct
            score++;
            // Highlight correct answer in green
            button.style.backgroundColor = "green";
        } else {
            // Highlight incorrect answer in red
            button.style.backgroundColor = "red";
            buttons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    // Highlight correct answer in green
                    btn.style.backgroundColor = "green";
                }
            });
        }
        // Update the displayed score
        updateScore();
    }

    // To update and display the score
    function updateScore() {
        // Update score text
        scoreDisplay.textContent = `Score: ${score}/${attemptCount}`;
    }

    // Fetch and display questions on page load
    fetchQuestions();
});
