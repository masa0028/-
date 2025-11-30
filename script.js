const screenTitle  = document.getElementById("screen-title");
const screenStage1 = document.getElementById("screen-stage1");
const screenStage2 = document.getElementById("screen-stage2");
const screenStage3 = document.getElementById("screen-stage3");
const screenClear  = document.getElementById("screen-clear");
const hud          = document.getElementById("hud");
const stageNumber  = document.getElementById("stage-number");

document.getElementById("btn-start").addEventListener("click", () => {
  showScreen("stage1");
});

function showScreen(stage) {
  [screenTitle, screenStage1, screenStage2, screenStage3, screenClear].forEach(s => {
    s.classList.remove("active");
  });
  hud.classList.remove("active");

  switch (stage) {
    case "stage1":
      screenStage1.classList.add("active");
      hud.classList.add("active");
      stageNumber.textContent = "1";
      break;
    case "stage2":
      screenStage2.classList.add("active");
      hud.classList.add("active");
      stageNumber.textContent = "2";
      break;
    case "stage3":
      screenStage3.classList.add("active");
      hud.classList.add("active");
      stageNumber.textContent = "3";
      break;
    case "clear":
      screenClear.classList.add("active");
      break;
    default:
      screenTitle.classList.add("active");
  }
}

const quizData = [
  {
    q: "この遺跡が眠る場所として最もふさわしいのは？",
    choices: ["砂漠の奥地", "都会の地下", "海の上", "宇宙空間"],
    answer: 0
  },
  {
    q: "オラクルが守っているものは？",
    choices: ["金銀財宝だけ", "人の記憶", "知恵と試練の宝", "時間そのもの"],
    answer: 2
  },
  {
    q: "遺跡に入る者に必要なものは？",
    choices: ["力だけ", "運だけ", "コネだけ", "勇気と好奇心"],
    answer: 3
  }
];

let currentQuiz = 0;

const quizQuestion = document.getElementById("quiz-question");
const quizChoicesContainer = document.getElementById("quiz-choices");
const quizProgress = document.getElementById("quiz-progress");

function renderQuiz() {
  const data = quizData[currentQuiz];
  quizQuestion.textContent = data.q;
  quizChoicesContainer.innerHTML = "";
  data.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "btn choice";
    btn.addEventListener("click", () => handleQuizAnswer(idx));
    quizChoicesContainer.appendChild(btn);
  });
  quizProgress.textContent = `問題 ${currentQuiz + 1} / ${quizData.length}`;
}

function handleQuizAnswer(index) {
  const correct = quizData[currentQuiz].answer === index;
  if (!correct) {
    quizProgress.textContent = "オラクル「もう一度考えてみよ…」";
    return;
  }
  currentQuiz++;
  if (currentQuiz < quizData.length) {
    renderQuiz();
  } else {
    showScreen("stage2");
  }
}

renderQuiz();

const puzzleChoices = document.querySelectorAll("#puzzle-choices .choice");
const puzzleMessage = document.getElementById("puzzle-message");

puzzleChoices.forEach(btn => {
  btn.addEventListener("click", () => {
    const isCorrect = btn.dataset.correct === "true";
    if (isCorrect) {
      puzzleMessage.textContent = "石版が光り、奥への道が開かれた！";
      setTimeout(() => {
        showScreen("stage3");
      }, 800);
    } else {
      puzzleMessage.textContent = "ルーンは沈黙したままだ…。別の記号を試してみよう。";
    }
  });
});

const oracleInput = document.getElementById("oracle-input");
const oracleBtn = document.getElementById("btn-oracle");
const oracleMessage = document.getElementById("oracle-message");

const KEYWORDS = ["希望", "きぼう", "hope"];

oracleBtn.addEventListener("click", checkOracleAnswer);

oracleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkOracleAnswer();
});

function checkOracleAnswer() {
  const value = oracleInput.value.trim().toLowerCase();
  if (!value) return;

  const isCorrect = KEYWORDS.some(k => k.toLowerCase() === value);
  if (isCorrect) {
    oracleMessage.textContent = "オラクル「その言葉…確かに受け取った。」";
    setTimeout(() => {
      showScreen("clear");
    }, 1000);
  } else {
    oracleMessage.textContent = "オラクル「その答えでは扉は開かぬ。お前の心をもう一度見つめよ。」";
  }
}

document.getElementById("btn-restart").addEventListener("click", () => {
  currentQuiz = 0;
  renderQuiz();
  oracleInput.value = "";
  oracleMessage.textContent = "";
  puzzleMessage.textContent = "";
  showScreen("stage1");
});
