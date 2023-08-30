// soundService.js
const sounds = [
  new Audio('sound1.mp3'),
  new Audio('sound2.mp3'),
  // ... Add more sounds as necessary
];

const playSound = (index) => {
  if (sounds[index]) {
    sounds[index].play();
  }
};

export default {
  playSound,
};
