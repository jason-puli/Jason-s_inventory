# Kids Matching App

A simple, child-friendly matching game where kids match images to their written names and hear pronunciations.

## Features

- **Categories**: Animals, Fruits, Vegetables, Mixed
- **Difficulty Levels**: Easy (3 pairs), Medium (6 pairs), Hard (9 pairs)
- **Audio Pronunciation**: Tap any image or name to hear it spoken
- **Hints**: Get help with one-tap hints
- **Scoring**: Per-round scoring with high score tracking
- **Settings**: Language selection, audio toggle, difficulty adjustment
- **Local Persistence**: High scores and settings saved locally
- **Accessibility**: Large touch targets, screen reader support

## How to Run

1. Open `index.html` in a modern web browser
2. The app runs entirely in the browser with no server required

## Assets

The app uses emoji placeholders for images. For production use, replace with actual image files and audio files in the following structure:

```
assets/
├── images/
│   ├── animals/
│   │   ├── cat.png
│   │   ├── dog.png
│   │   └── ...
│   ├── fruits/
│   └── vegetables/
└── audio/
    ├── en-US/
    │   ├── animals/
    │   │   ├── cat.mp3
    │   │   ├── dog.mp3
    │   │   └── ...
    │   ├── fruits/
    │   └── vegetables/
    └── [other languages]/
```

Update the `assets` object in `script.js` to reference the actual file paths.

## Browser Support

- Modern browsers with ES6 support
- Speech Synthesis API for audio (fallback to console logs if not supported)

## Development

- `index.html`: Main HTML structure
- `style.css`: Responsive styling with child-friendly design
- `script.js`: Game logic and state management

## License

This project is open source and available under the MIT License.
