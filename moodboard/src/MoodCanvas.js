// Import React hooks
import React, { useEffect, useRef, useState } from 'react'; 
// Import shared emotion context
import { useEmotion } from './EmotionContext'; 

const MoodCanvas = () => {
  // Ref to the canvas container div
  const canvasRef = useRef(); 
  // Get and set emotion from context
  const { emotion, setEmotion } = useEmotion(); 
  // State for controlling animation speed
  const [speed, setSpeed] = useState(1); 
  // State for selecting emoji theme
  const [theme, setTheme] = useState("classic"); 

  useEffect(() => {
    const sketch = (p) => {
      // Webcam capture object
      let video; 
      // FaceMesh model instance
      let faceMesh; 
      // Array to hold detected face data
      let faces = []; 
      let canvasW = window.innerWidth;
      let canvasH = window.innerHeight;

      // Emoji mappings for each theme
      const emojiMap = {
        classic: { happy: "💖", sad: "💧" },
        faces: { happy: "😄", sad: "😢" },
        party: { happy: "🥳", sad: "😞" },
        weather: { happy: "🌞", sad: "🌧" }
      };

      // Setup p5 canvas, webcam, and load FaceMesh
      p.setup = () => {
        // Full screen canvas
        p.createCanvas(canvasW, canvasH); 
        // Capture webcam
        video = p.createCapture(p.VIDEO); 
        video.size(640, 480);
        // Hide default video element
        video.hide(); 

        // Load FaceMesh and start prediction loop
        faceMesh = window.ml5.faceMesh(video, () => {
          console.log("FaceMesh loaded via p5");
          faceMesh.detectStart(video.elt, (results) => {
            // Update face predictions
            faces = results; 
          });
        });
      };

      // Main draw loop
      p.draw = () => {
        // Background and emoji animation based on emotion
        if (emotion === "happy") {
          // Light pink
          p.background(255, 230, 240); 
          p.fill(255, 0, 100, 100);
          for (let i = 0; i < 10 * speed; i++) {
            const size = p.random(48, 99);
            p.textSize(size);
            p.text(emojiMap[theme].happy, p.random(canvasW), p.random(canvasH));
          }
        } else if (emotion === "sad") {
          // Light blue
          p.background(180, 200, 255); 
          p.fill(0, 100, 200, 80);
          for (let i = 0; i < 5 * speed; i++) {
            const size = p.random(36, 77);
            p.textSize(size);
            p.text(emojiMap[theme].sad, p.random(canvasW), p.random(canvasH));
          }
        } else {
          // Neutral background
          p.background(240); 
        }

        // Display webcam video
        p.image(video, canvasW / 2 - 320, canvasH / 2 - 240, 640, 480);

        // Draw bounding box and detect emotion
        if (faces.length > 0 && faces[0].lips) {
          const lips = faces[0].lips;
          const mouthRatio = lips.width / lips.height;
          const isHappy = mouthRatio > 2.5 || mouthRatio < 1.6;
          setEmotion(isHappy ? "happy" : "sad");

          p.noFill();
          // Red stroke for lips box
          p.stroke(255, 0, 0); 
          p.strokeWeight(2);
          p.rect(canvasW / 2 - 320 + lips.x, canvasH / 2 - 240 + lips.y, lips.width, lips.height);
        }

        // Display current emotion as text
        p.noStroke();
        p.fill(0);
        p.textSize(24);
        p.textAlign(p.CENTER, p.TOP);
        p.text(`Emotion: ${emotion}`, canvasW / 2, canvasH / 2 + 250);
      };

      // Resize canvas when window size changes
      p.windowResized = () => {
        canvasW = window.innerWidth;
        canvasH = window.innerHeight;
        p.resizeCanvas(canvasW, canvasH);
      };
    };

    // Initialize p5 with our sketch
    const myp5 = new window.p5(sketch, canvasRef.current);
    // Cleanup on component unmount
    return () => myp5.remove(); 
    // Re-run effect on speed/theme changes
  }, [emotion, setEmotion, speed, theme]); 

  // Render UI and canvas container
  return (
    <>
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 10,
        background: "#ffffffcc", padding: "10px", borderRadius: "8px"
      }}>
        {/* Speed Slider */}
        <label>
          Animation Speed: {speed.toFixed(1)}
          <input
            type="range"
            min="0.2" max="3" step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={{ width: "150px", marginLeft: "10px" }}
          />
        </label>
        <br />
        {/* Theme Dropdown */}
        <label>
          Theme:&nbsp;
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="classic">Classic</option>
            <option value="faces">Faces</option>
            <option value="party">Party</option>
            <option value="weather">Weather</option>
          </select>
        </label>
      </div>
      {/* Canvas Mount Point */}
      <div ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}></div>
    </>
  );
};

export default MoodCanvas;