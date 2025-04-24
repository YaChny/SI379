# MoodBoard 🎭

**MoodBoard** is an interactive emotion-driven visual experience built with **React**, **p5.js**, and **ml5.js**.  
It uses real-time facial expression detection (FaceMesh) to create an immersive, dynamic background based on your mood.

## 💡 Features

- 🎥 Live webcam face tracking using `ml5.js` FaceMesh
- 😄 Emotion detection based on mouth width-to-height ratio
- 🌈 Animated background with emojis that change based on your emotion
- 🎛️ Controls for:
  - Animation speed
  - Emoji theme (Classic, Faces, Party, Weather)

## 🧠 How Emotion Detection Works

The app uses FaceMesh points from `ml5.js` to calculate the mouth ratio:
```
mouthRatio = lips.width / lips.height
```
- A ratio above 2.5 or below 1.6 is interpreted as **"happy"**
- Otherwise, it's **"sad"**

## 📦 Technologies Used

- [React](https://reactjs.org/)
- [p5.js](https://p5js.org/) (for animation and canvas)
- [ml5.js](https://ml5js.org/) (for face detection)
- [FaceMesh](https://learn.ml5js.org/#/reference/facemesh)

## 🚀 Getting Started

1. Clone this repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add this to `public/index.html`:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
   <script src="https://unpkg.com/ml5@1/dist/ml5.min.js"></script>
   ```
4. Run the app:
   ```bash
   npm start
   ```

## 🎨 Emoji Themes

| Theme    | Happy Emoji | Sad Emoji |
|----------|-------------|-----------|
| Classic  | 💖          | 💧        |
| Faces    | 😄          | 😢        |
| Party    | 🥳          | 😞        |
| Weather  | 🌞          | 🌧        |

## 📁 File Overview

- `MoodCanvas.js`: Main component with canvas rendering and emotion logic
- `EmotionContext.js`: Global state for emotion
- `README.md`: Project overview

## ✨ Credits

Created by Zichen Zang as a final project for **SI379 (W25)** at the University of Michigan.
