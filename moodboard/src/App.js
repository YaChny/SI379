import React from 'react';
import MoodCanvas from './MoodCanvas';
import { EmotionProvider } from './EmotionContext';

function App() {
  return (
    <EmotionProvider>
      <div className="App">
        <h1>MoodBoard 🎭</h1>
        <MoodCanvas />
      </div>
    </EmotionProvider>
  );
}

export default App;
