const loader = document.getElementById("loader");
const quizContainer = document.getElementById("quiz-container");
const startBtn = document.getElementById("start-btn");
const resultBtn = document.getElementById("result-btn");
const newBtn = document.getElementById("new-btn");
const resultContainer = document.getElementById("result-container");
const categorySelect = document.getElementById("trivia_category");
const difficultySelect = document.getElementById("trivia_difficulty");

let correctAnswers = [];
let scores = 0;

startBtn.addEventListener("click", startQuiz);
resultBtn.addEventListener("click", checkScores);
newBtn.addEventListener("click", newQuiz);

function startQuiz() {
  const category = categorySelect.value === "any" ? "" : categorySelect.value;
  const difficulty =
    difficultySelect.value === "any" ? "" : difficultySelect.value;

  fetch(
    `https://opentdb.com/api.php?amount=5&category=${category}&difficulty=${difficulty}&type=multiple`
  )
    .then((res) => res.json())
    .then((data) => {
      // remove loader after data is fetched
      resultBtn.classList.remove("hidden");
      loader.style.display = "none";
      const questionEl = data.results.map((question, questionIndex) => {
        const options = [
          ...question.incorrect_answers,
          question.correct_answer,
        ].sort(() => Math.random() - 0.5);
        const optionsEl = options.map(
          (option) => `
          <input type="radio" id="op-${option}" onchange="checkAnswer(this)" name="question${questionIndex}" value="${option}" />
          <label for="op-${option}">${option}</label>`
        );

        return `
          <p key=${questionIndex} class="question">${question.question}</p>
          <div key=${questionIndex} class="options">${optionsEl.join("")}</div>
        `;
      });

      quizContainer.innerHTML += questionEl.join("");
      correctAnswers = data.results.map((question) => question.correct_answer);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.log(error);
    });

  document.getElementById("main-page").classList.remove("hidden");
  document.getElementById("header").classList.add("hidden");
}

function checkAnswer(selectedOption) {
  const questionIndex = parseInt(selectedOption.name.slice(8));
  const selectedAnswer = selectedOption.value;
  const correctAnswer = correctAnswers[questionIndex];

  if (selectedAnswer === correctAnswer) {
    scores++;
  }
}

function checkScores() {
  resultBtn.classList.add("hidden");
  newBtn.classList.remove("hidden");
  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = `<p>You have got ${scores} correct answers</p>`;

  const radioInputs = document.querySelectorAll('input[type="radio"]');
  radioInputs.forEach((input) => {
    const questionIndex = parseInt(input.name.slice(8));
    const correctAnswer = correctAnswers[questionIndex];
    const labelQuery = `label[for="op-${correctAnswer}"]`;

    input.disabled = true;
    const label = document.querySelector(labelQuery);

    if (input.checked) {
      if (input.value === correctAnswer) {
        scores++;
        label.classList.add("green");
      } else {
        document
          .querySelector(`label[for="op-${input.value}"]`)
          .classList.add("red");
        label.classList.add("green");
      }
    } else {
      if (input.value === correctAnswer) {
        label.classList.add("green");
      }
    }
  });
}

function newQuiz() {
  window.location.reload();
}
