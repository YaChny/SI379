import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import "./App.css"; 

export default function App() {
  // Hold the randomly generated target color
  const [target, setTarget] = useState({ r: 0, g: 0, b: 0 });

  // For the user's RGB guess
  const [r, setR] = useState(0); 
  const [g, setG] = useState(0); 
  const [b, setB] = useState(0); 

  // Feedback state to show guess result and cheating mode toggle
  // Distance message
  const [feedback, setFeedback] = useState(null); 
  // Show user's guess color box
  const [cheating, setCheating] = useState(false); 
  // Toggle to display the correct RGB value
  const [showAnswer, setShowAnswer] = useState(false); 

  // Generate a new random RGB target color
  const generateNewTarget = () => {
    setTarget({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    });
    // Reset values and feedback
    setFeedback(null);
    setR(0);
    setG(0);
    setB(0);
    setShowAnswer(false);
  };
  
  // Run once on component mount
  useEffect(() => {
    generateNewTarget();
  }, []);

  // Calculate distance between user's guess and target color
  const colorDistance = () => {
    return Math.sqrt(
      Math.pow(r - target.r, 2) +
      Math.pow(g - target.g, 2) +
      Math.pow(b - target.b, 2)
    );
  };

  // When user clicks Guess, show distance feedback
  const handleGuess = () => {
    const distance = colorDistance();
    setFeedback(`Your guess was ${Math.round(distance)} units away!`);
    setShowAnswer(true);
  };

  return (
    <div className="container">
      {/* Title and cheat mode toggle */}
      <div className="header">
        <h1>RGB Guesser</h1>
        <label>
          <input
            type="checkbox"
            checked={cheating}
            onChange={() => setCheating(!cheating)}
          />
          Cheating mode
        </label>
      </div>

      {/* Target color box */}
      <div
        className="color-box target"
        style={{ backgroundColor: `rgb(${target.r}, ${target.g}, ${target.b})` }}
      ></div>

      {/* Display correct RGB code after guessing */}
      {showAnswer && (
        <p className="answer">Correct RGB: ({target.r}, {target.g}, {target.b})</p>
      )}

      {/* Display user guess if cheating mode is on */}
      {cheating && (
        <div
          className="color-box guess"
          style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
        >
          Your Guess
        </div>
      )}

      {/* RGB sliders with color-coded labels */}
      <div className="sliders">
        <div className="slider-group red">
          <label className="slider-label">Red</label>
          <Slider label="Red" value={r} onChange={setR} />
        </div>
        <div className="slider-group green">
          <label className="slider-label">Green</label>
          <Slider label="Green" value={g} onChange={setG} />
        </div>
        <div className="slider-group blue">
          <label className="slider-label">Blue</label>
          <Slider label="Blue" value={b} onChange={setB} />
        </div>
      </div>

      {/* Action buttons */}
      <button className="btn primary" onClick={handleGuess}>Guess</button>
      <button className="btn secondary" onClick={generateNewTarget}>Try a New Color</button>

      {/* Feedback message */}
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}
