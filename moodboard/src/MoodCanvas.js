import React, { useEffect, useRef, useState } from 'react';
import { useEmotion } from './EmotionContext';

const MoodCanvas = () => {
  const canvasRef = useRef();
  const { emotion, setEmotion } = useEmotion();
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const sketch = (p) => {
      let video;
      let faceMesh;
      let faces = [];
      let canvasW = window.innerWidth;
      let canvasH = window.innerHeight;

      p.setup = () => {
        p.createCanvas(canvasW, canvasH);
        video = p.createCapture(p.VIDEO);
        video.size(640, 480);
        video.hide();

        faceMesh = window.ml5.faceMesh(video, () => {
          console.log("FaceMesh loaded via p5");
          faceMesh.detectStart(video.elt, (results) => {
            faces = results;
          });
        });
      };

      p.draw = () => {
        // Background animation affected by speed
        if (emotion === "happy") {
          p.background(255, 230, 240);
          p.fill(255, 0, 100, 100);
          for (let i = 0; i < 10 * speed; i++) {
            p.ellipse(p.random(canvasW), p.random(canvasH), p.random(30, 60));
          }
        } else if (emotion === "sad") {
          p.background(180, 200, 255);
          p.fill(0, 100, 200, 80);
          for (let i = 0; i < 5 * speed; i++) {
            p.ellipse(p.random(canvasW), p.random(canvasH), p.random(40, 80), p.random(40, 60));
          }
        } else {
          p.background(240);
        }

        p.image(video, canvasW / 2 - 320, canvasH / 2 - 240, 640, 480);

        if (faces.length > 0 && faces[0].lips) {
          const lips = faces[0].lips;
          const mouthRatio = lips.width / lips.height;
          const isHappy = mouthRatio > 2.5 || mouthRatio < 1.6;
          setEmotion(isHappy ? "happy" : "sad");

          p.noFill();
          p.stroke(255, 0, 0);
          p.strokeWeight(2);
          p.rect(canvasW / 2 - 320 + lips.x, canvasH / 2 - 240 + lips.y, lips.width, lips.height);
        }

        p.noStroke();
        p.fill(0);
        p.textSize(24);
        p.textAlign(p.CENTER, p.TOP);
        p.text(`Emotion: ${emotion}`, canvasW / 2, canvasH / 2 + 250);
      };

      p.windowResized = () => {
        canvasW = window.innerWidth;
        canvasH = window.innerHeight;
        p.resizeCanvas(canvasW, canvasH);
      };
    };

    const myp5 = new window.p5(sketch, canvasRef.current);
    return () => myp5.remove();
  }, [emotion, setEmotion, speed]);

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, background: "#ffffffcc", padding: "8px", borderRadius: "8px" }}>
        <label>
          Animation Speed: {speed.toFixed(1)}
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={{ width: "150px", marginLeft: "10px" }}
          />
        </label>
      </div>
      <div ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}></div>
    </>
  );
};

export default MoodCanvas;