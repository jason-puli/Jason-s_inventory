// Asset library (bundled placeholders)
const assets = {
    animals: [
        { id: 'cat', name: 'Cat', image: 'assets/images/animals/cat.png', audio: 'cat.mp3' },
        { id: 'dog', name: 'Dog', image: 'assets/images/animals/dog.png', audio: 'dog.mp3' },
        { id: 'elephant', name: 'Elephant', image: 'assets/images/animals/elephant.png', audio: 'elephant.mp3' },
        { id: 'lion', name: 'Lion', image: 'assets/images/animals/lion.png', audio: 'lion.mp3' },
        { id: 'monkey', name: 'Monkey', image: 'assets/images/animals/monkey.png', audio: 'monkey.mp3' },
        { id: 'rabbit', name: 'Rabbit', image: 'assets/images/animals/rabbit.png', audio: 'rabbit.mp3' },
        { id: 'tiger', name: 'Tiger', image: 'assets/images/animals/tiger.png', audio: 'tiger.mp3' },
        { id: 'zebra', name: 'Zebra', image: 'assets/images/animals/zebra.png', audio: 'zebra.mp3' },
        { id: 'giraffe', name: 'Giraffe', image: 'assets/images/animals/giraffe.png', audio: 'giraffe.mp3' }
    ],
    fruits: [
        { id: 'apple', name: 'Apple', image: 'assets/images/fruits/apple.png', audio: 'apple.mp3' },
        { id: 'banana', name: 'Banana', image: 'assets/images/fruits/banana.png', audio: 'banana.mp3' },
        { id: 'orange', name: 'Orange', image: 'assets/images/fruits/orange.png', audio: 'orange.mp3' },
        { id: 'grape', name: 'Grape', image: 'assets/images/fruits/grapes.png', audio: 'grape.mp3' },
        { id: 'strawberry', name: 'Strawberry', image: 'assets/images/fruits/strawberry.png', audio: 'strawberry.mp3' },
        { id: 'watermelon', name: 'Watermelon', image: 'assets/images/fruits/watermelon.png', audio: 'watermelon.mp3' },
        { id: 'pineapple', name: 'Pineapple', image: 'assets/images/fruits/pineapple.png', audio: 'pineapple.mp3' },
        { id: 'kiwi', name: 'Kiwi', image: 'assets/images/fruits/kiwi.png', audio: 'kiwi.mp3' },
        { id: 'mango', name: 'Mango', image: 'assets/images/fruits/mango.png', audio: 'mango.mp3' }
    ],
    vegetables: [
        { id: 'carrot', name: 'Carrot', image:'assets/images/vegetables/Carrot.png', audio: 'carrot.mp3' },
        { id: 'broccoli', name: 'Broccoli', image: 'assets/images/vegetables/Broccoli.png', audio: 'broccoli.mp3' },
        { id: 'tomato', name: 'Tomato', image: 'assets/images/vegetables/Tomato.png', audio: 'tomato.mp3' },
        { id: 'potato', name: 'Potato', image: 'assets/images/vegetables/potato.png', audio: 'potato.mp3' },
        { id: 'corn', name: 'Corn', image: 'assets/images/vegetables/corn.png', audio: 'corn.mp3' },
        { id: 'eggplant', name: 'Eggplant', image: 'assets/images/vegetables/Eggplant.png', audio: 'eggplant.mp3' },
        { id: 'pepper', name: 'Pepper', image: 'assets/images/vegetables/pepper.png', audio: 'pepper.mp3' },
        { id: 'cucumber', name: 'Cucumber', image: 'assets/images/vegetables/cucumber.png', audio: 'cucumber.mp3' },
        { id: 'onion', name: 'Onion', image: 'assets/images/vegetables/onion.png', audio: 'onion.mp3' }
    ]
};

// State management
let settings = {
    language: 'en-US',
    audioOn: true,
    difficulty: 'medium'
};

let currentCategory = 'animals';
let round = null;
let highScores = {};
let hintsRemaining = 3;
let localLogs = [];

// DOM elements
const categoryPills = document.querySelectorAll('.category-pill');
const imagesContainer = document.getElementById('images-container');
const namesContainer = document.getElementById('names-container');
const newRoundBtn = document.getElementById('new-round-btn');
const hintBtn = document.getElementById('hint-btn');
const replayBtn = document.getElementById('replay-btn');
const scoreDisplay = document.getElementById('score');
const progressFill = document.getElementById('progress-fill');
const highScoreDisplay = document.getElementById('high-score');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeBtn = document.querySelector('.close');
const languageSelect = document.getElementById('language-select');
const audioToggle = document.getElementById('audio-toggle');
const difficultySelect = document.getElementById('difficulty-select');
// const logsContainer = document.getElementById('logs-container');
const startPrompt = document.getElementById('start-prompt');

// Initialize app
function init() {
    loadSettings();
    loadHighScores();
    // loadLogs();
    setupEventListeners();
    updateUI();
    // logEvent('app_started', 'App initialized');
}

// Event listeners
function setupEventListeners() {
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => selectCategory(pill.dataset.category));
    });

    newRoundBtn.addEventListener('click', startNewRound);
    hintBtn.addEventListener('click', useHint);
    replayBtn.addEventListener('click', replayRound);

    settingsBtn.addEventListener('click', openSettings);
    closeBtn.addEventListener('click', closeSettings);
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });

    languageSelect.addEventListener('change', updateSettings);
    audioToggle.addEventListener('change', updateSettings);
    difficultySelect.addEventListener('change', updateSettings);
}

// Category selection
function selectCategory(category) {
    currentCategory = category;
    categoryPills.forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === category);
    });
    logEvent('category_selected', `Category changed to ${category}`);
}

// Round generation
function startNewRound() {
    const difficultyMap = { easy: 3, medium: 6, hard: 9 };
    const numItems = difficultyMap[settings.difficulty];

    let items;
    if (currentCategory === 'mixed') {
        // Randomly select items from all categories for each new round
        const allItems = [...assets.animals, ...assets.fruits, ...assets.vegetables];
        items = shuffleArray([...allItems]).slice(0, numItems);
    } else {
        items = assets[currentCategory].slice(0, numItems);
    }

    round = {
        items: items.map(item => ({ ...item, matched: false })),
        nameOrder: shuffleArray([...items]),
        score: 0,
        total: numItems
    };

    hintsRemaining = 3; // Reset hints per round
    renderRound();
    updateUI();
    logEvent('round_started', `New round started with ${numItems} items in ${currentCategory}`);
}

// Render round
function renderRound() {
    imagesContainer.innerHTML = '';
    namesContainer.innerHTML = '';

    round.items.forEach(item => {
        const imageCard = createImageCard(item);
        imagesContainer.appendChild(imageCard);
    });

    round.nameOrder.forEach(item => {
        const nameTile = createNameTile(item);
        namesContainer.appendChild(nameTile);
    });

    startPrompt.style.display = 'none';
}

// Create image card
function createImageCard(item) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.dataset.id = item.id;
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
    `;
    card.addEventListener('click', () => selectItem(card, 'image'));
    card.setAttribute('aria-label', `Image of ${item.name}`);
    return card;
}

// Create name tile
function createNameTile(item) {
    const tile = document.createElement('div');
    tile.className = 'name-tile';
    tile.dataset.id = item.id;
    tile.textContent = item.name;
    tile.addEventListener('click', () => selectItem(tile, 'name'));
    tile.setAttribute('aria-label', `Name: ${item.name}`);
    return tile;
}

// Selection logic
let selectedImage = null;
let selectedName = null;

function selectItem(element, type) {
    if (element.classList.contains('matched')) return;

    if (type === 'name') {
        playAudio(element.dataset.id);
    }

    if (type === 'image') {
        if (selectedImage) selectedImage.classList.remove('selected');
        selectedImage = element;
        selectedImage.classList.add('selected');
    } else {
        if (selectedName) selectedName.classList.remove('selected');
        selectedName = element;
        selectedName.classList.add('selected');
    }

    if (selectedImage && selectedName) {
        checkMatch();
    }
}

// Check match
function checkMatch() {
    const imageId = selectedImage.dataset.id;
    const nameId = selectedName.dataset.id;

    if (imageId === nameId) {
        // Correct match
        selectedImage.classList.add('matched', 'correct');
        selectedName.classList.add('matched', 'correct');
        round.score++;
        playSound('correct');
        logEvent('match_correct', `Matched ${imageId}`);
    } else {
        // Incorrect match
        selectedImage.classList.add('incorrect');
        selectedName.classList.add('incorrect');
        playSound('incorrect');
        logEvent('match_incorrect', `Attempted to match ${imageId} with ${nameId}`);
        setTimeout(() => {
            selectedImage.classList.remove('incorrect');
            selectedName.classList.remove('incorrect');
        }, 500);
    }

    selectedImage.classList.remove('selected');
    selectedName.classList.remove('selected');
    selectedImage = null;
    selectedName = null;

    updateUI();

    if (round.score === round.total) {
        roundComplete();
    }
}

// Round complete
function roundComplete() {
    const key = `${currentCategory}_${settings.difficulty}`;
    if (!highScores[key] || round.score > highScores[key]) {
        highScores[key] = round.score;
        saveHighScores();
        updateHighScoreDisplay();
    }
    logEvent('round_complete', `Round completed with score ${round.score}/${round.total}`);
    // Show completion message (could be enhanced with confetti animation)
    setTimeout(() => alert(`Round complete! Score: ${round.score}/${round.total}`), 500);
}

// Hint functionality
function useHint() {
    if (hintsRemaining > 0 && round) {
        const unmatched = round.items.filter(item => !item.matched);
        if (unmatched.length > 0) {
            const randomItem = unmatched[Math.floor(Math.random() * unmatched.length)];
            const imageCard = document.querySelector(`.image-card[data-id="${randomItem.id}"]`);
            const nameTile = document.querySelector(`.name-tile[data-id="${randomItem.id}"]`);

            imageCard.style.animation = 'pulse 2s';
            nameTile.style.animation = 'pulse 2s';
            playAudio(randomItem.id);

            setTimeout(() => {
                imageCard.style.animation = '';
                nameTile.style.animation = '';
            }, 2000);

            hintsRemaining--;
            logEvent('hint_used', `Hint used for ${randomItem.id}`);
        }
    }
}

// Replay round
function replayRound() {
    if (round) {
        round.score = 0;
        round.items.forEach(item => item.matched = false);
        round.nameOrder = shuffleArray([...round.items]);
        renderRound();
        updateUI();
        logEvent('round_replayed', 'Round replayed');
    }
}

// Audio functionality
function playAudio(itemId) {
    if (!settings.audioOn) return;
    // In a real app, this would play the actual audio file
    // For now, we'll use speech synthesis
    const utterance = new SpeechSynthesisUtterance(itemId);
    utterance.lang = settings.language;
    speechSynthesis.speak(utterance);
}

function playSound(type) {
    if (!settings.audioOn) return;
    // Use speech synthesis for sound effects
    if (type === 'correct') {
        const utterance = new SpeechSynthesisUtterance('Correct!');
        utterance.lang = settings.language;
        utterance.rate = 1.2; // Slightly faster for celebration
        utterance.pitch = 1.5; // Higher pitch for celebration
        speechSynthesis.speak(utterance);
    } else if (type === 'incorrect') {
        const utterance = new SpeechSynthesisUtterance('Try again');
        utterance.lang = settings.language;
        utterance.rate = 0.8; // Slower for gentle feedback
        speechSynthesis.speak(utterance);
    }
}

// Settings
function openSettings() {
    languageSelect.value = settings.language;
    audioToggle.checked = settings.audioOn;
    difficultySelect.value = settings.difficulty;
    updateLogsDisplay();
    settingsModal.style.display = 'block';
}

function closeSettings() {
    settingsModal.style.display = 'none';
}

function updateSettings() {
    settings.language = languageSelect.value;
    settings.audioOn = audioToggle.checked;
    settings.difficulty = difficultySelect.value;
    saveSettings();
    logEvent('settings_updated', `Settings updated: ${JSON.stringify(settings)}`);
}

// UI updates
function updateUI() {
    if (round) {
        scoreDisplay.textContent = `Score: ${round.score}/${round.total}`;
        progressFill.style.width = `${(round.score / round.total) * 100}%`;
    } else {
        scoreDisplay.textContent = 'Score: 0/0';
        progressFill.style.width = '0%';
    }
    updateHighScoreDisplay();
}

function updateHighScoreDisplay() {
    const key = `${currentCategory}_${settings.difficulty}`;
    const highScore = highScores[key] || '--';
    highScoreDisplay.textContent = `High Score: ${highScore}`;
}

function updateLogsDisplay() {
    logsContainer.innerHTML = localLogs.map(log => 
        `<div>${new Date(log.timestamp).toLocaleString()}: ${log.eventType} - ${log.details}</div>`
    ).join('');
}

// Persistence
function saveSettings() {
    localStorage.setItem('kidsMatchingSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('kidsMatchingSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }
}

function saveHighScores() {
    localStorage.setItem('kidsMatchingHighScores', JSON.stringify(highScores));
}

function loadHighScores() {
    const saved = localStorage.getItem('kidsMatchingHighScores');
    if (saved) {
        highScores = JSON.parse(saved);
    }
}

function saveLogs() {
    localStorage.setItem('kidsMatchingLogs', JSON.stringify(localLogs));
}

function loadLogs() {
    const saved = localStorage.getItem('kidsMatchingLogs');
    if (saved) {
        localLogs = JSON.parse(saved);
    }
}

function logEvent(eventType, details) {
    localLogs.push({
        timestamp: Date.now(),
        eventType,
        details
    });
    // Keep only last 100 logs
    if (localLogs.length > 100) {
        localLogs = localLogs.slice(-100);
    }
    saveLogs();
}

// Utility functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

