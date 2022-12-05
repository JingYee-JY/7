const startButton = document.querySelector(".startButton")
const start = document.querySelector(".start")
const game = document.querySelector(".game")
const gameContainer = document.querySelector(".game-container");
// const playAgain = document.querySelector(".playAgain")
const final = document.querySelector(".final");

let startGame;
let firstCard;
let secondCard;

var owl = $(".owl-carousel");

//Items array
const items = [
  { name: "card1", image: "./images/card1.png" },
  { name: "card2", image: "./images/card2.png" },
  { name: "card3", image: "./images/card3.png" },
];

document.addEventListener('dblclick', function (event) {
  event.preventDefault();
}, { passive: false });

startButton.addEventListener("click", () => {
  start.classList.add("hide")
  game.classList.remove("hide")
  startGame = false
  initializer();
})

// playAgain.addEventListener("click", () => {
//     final.classList.add("hide")
//     game.classList.remove("hide")
//     initializer();
// })

//Pick random objects from the items array
const generateRandom = (size = 2) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * 3) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 2) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * 3; i++) {
    gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">
          <img src="./images/card-back.png" class="card-logo"/>
          </div>
          <div class="card-after">
          <img src="${cardValues[i].image}" class="card-image"/></div>
       </div>
       `;
  }

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched") && startGame == true && !card.classList.contains("flipped")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              startGame = false
              let delay = setTimeout(() => {
                final.classList.remove("hide")
                game.classList.add("hide")
                owl.owlCarousel({
                  loop: true,
                  margin: 10,
                  nav: false,
                  arrows: false,
                  autoplay: false,
                  autoplayTimeout: 10000,
                  autoplayHoverPause: true,
                  responsive: {
                    0: {
                      items: 1
                    },
                    600: {
                      items: 1
                    },
                    1000: {
                      items: 1
                    }
                  }
                })
              }, 900);
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
  opening()
};

function opening() {
  let Opendelay = setTimeout(() => {
    cards.forEach((card) => {
      card.classList.add("flipped");
    })
  }, 200);
  let Closedelay = setTimeout(() => {
    closing()
  }, 2000);
}

function closing() {
  cards.forEach((card) => {
    card.classList.remove("flipped");
  })
  let delay = setTimeout(() => {
    startGame = true
    firstCard = null
    secondCard = null
  }, 500);
}

//Initialize values and func calls
const initializer = () => {
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

owl.on('dragged.owl.carousel', function (event) {
  owl.trigger('stop.owl.autoplay');
});