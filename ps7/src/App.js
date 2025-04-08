import React, { useState, useEffect } from "react";
import Slider from "./Slider";

export default function App() {
  // Hold the randomly generated target color
  const [target, setTarget] = useState({ r: 0, g: 0, b: 0 });

  // For the user's RGB guess
  const [r, setR] = useState(0); // Red value
  const [g, setG] = useState(0); // Green value
  const [b, setB] = useState(0); // Blue value

  // Feedback state to show guess result and cheating mode toggle
  const [feedback, setFeedback] = useState(null); // Distance message
  const [cheating, setCheating] = useState(false); // Show user's guess color box

  // Generate a random RGB target color
  useEffect(() => {
    setTarget({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    });
  }, []);

  // Calculate distance between user's guess and target color
  const colorDistance = () => {
    return Math.sqrt(
      Math.pow(r - target.r, 2) +
      Math.pow(g - target.g, 2) +
      Math.pow(b - target.b, 2)
    );
  };

  // When "Guess" button is clicked
  const handleGuess = () => {
    const distance = colorDistance();
    setFeedback(`Your guess was ${Math.round(distance)} units away!`); // Show result
  };

  return (
    <div className="container" style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      {/* Heading */}
      <h1>🎨 RGB Color Guesser</h1> 

      {/* Target color box */}
      <div style={{
        width: "100%",
        height: "100px",
        backgroundColor: `rgb(${target.r}, ${target.g}, ${target.b})`,
        border: "2px solid #000",
        marginBottom: "1rem"
      }}></div>

      {/* Cheating mode toggle */}
      <label>
        <input
          type="checkbox"
          checked={cheating}
          onChange={() => setCheating(!cheating)}
        />
        Cheating Mode
      </label>

      {/* Preview user's guess color if cheating mode is enabled */}
      {cheating && (
        <div style={{
          width: "100%",
          height: "100px",
          backgroundColor: `rgb(${r}, ${g}, ${b})`,
          border: "2px dashed #333",
          marginBottom: "1rem",
          marginTop: "1rem"
        }}></div>
      )}

      {/* Sliders for red, green, and blue */}
      <Slider label="Red" value={r} onChange={setR} />
      <Slider label="Green" value={g} onChange={setG} />
      <Slider label="Blue" value={b} onChange={setB} />

      {/* Guess button */}
      <button onClick={handleGuess} style={{ marginTop: "1rem" }}>Guess</button>

      {/* Feedback message */}
      {feedback && <p style={{ marginTop: "1rem" }}>{feedback}</p>}
    </div>
  );
}