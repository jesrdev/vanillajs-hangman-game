//--DOM elements
const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageWord = document.getElementById("final-message-word");

const figureParts = document.querySelectorAll(".figure-part");

//--Functions
//Get random word from API
let selectedWord = "";
const getRandomWord = async () => {
  let response = await fetch(
    "https://random-word-api.herokuapp.com/word?number=1&swear=0"
  );
  let jsonResponse = await response.json();

  selectedWord = jsonResponse[0];
  displayWord();
};

getRandomWord();

const correctLetters = [];
const wrongLetters = [];

//Show the word, only the letters that are on correct letters array, with respective span
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
            <span class="letter">${
              correctLetters.includes(letter) ? letter : ""
            }</span>
            `
      )
      .join("")}
    `;

  const innerWord = wordEl.innerText.replace(/\n/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You guessed the word!!";
    finalMessageWord.innerHTML = "";
    popup.style.display = "flex";
  }
}

function updateWrongLettersEl() {
  //Display wrong letters
  wrongLettersEl.innerHTML = `
    <p>Wrong</p>
    ${wrongLetters.map(
      (letter) => `
      <span>${letter}</span>
      `
    )}
    `;

  //Display hangman bodyparts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  //Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "You lost :(";
    finalMessageWord.innerHTML = `The correct word was <span>${selectedWord}</span>`;
    popup.style.display = "flex";
  }
}

function showNotification() {
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

//--Event Listeners

//detect letter pressed
window.addEventListener("keydown", (e) => {
  //console.log(e.keyCode);
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      //If letter is in correct word and not already in the correct letters array
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

//Restart game
playAgainBtn.addEventListener("click", () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  getRandomWord();

  updateWrongLettersEl();

  popup.style.display = "none";
});
