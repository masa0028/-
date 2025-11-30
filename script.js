// 画面要素
const screenTitle  = document.getElementById("screen-title");
const screenStage1 = document.getElementById("screen-stage1");
const screenStage2 = document.getElementById("screen-stage2");
const screenStage3 = document.getElementById("screen-stage3");
const screenClear  = document.getElementById("screen-clear");
const hud          = document.getElementById("hud");
const stageNumber  = document.getElementById("stage-number");

// BGM
const bgmTitle  = document.getElementById("bgm-title");
const bgmStage1 = document.getElementById("bgm-stage1");
const bgmStage2 = document.getElementById("bgm-stage2");
const bgmStage3 = document.getElementById("bgm-stage3");
const allBgms   = [bgmTitle, bgmStage1, bgmStage2, bgmStage3];

function playBgm(name) {
  allBgms.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  let target = null;
  if (name === "title")  target = bgmTitle;
  if (name === "stage1") target = bgmStage1;
  if (name === "stage2") target = bgmStage2;
  if (name === "stage3") target = bgmStage3;
  if (target) {
    target.play().catch(() => {
      console.log("autoplay blocked");
    });
  }
}

// 画面切り替え
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
      playBgm("stage1");
      break;
    case "stage2":
      screenStage2.classList.add("active");
      hud.classList.add("active");
      stageNumber.textContent = "2";
      playBgm("stage2");
      break;
    case "stage3":
      screenStage3.classList.add("active");
      hud.classList.add("active");
      stageNumber.textContent = "3";
      playBgm("stage3");
      break;
    case "clear":
      screenClear.classList.add("active");
      break;
    default:
      screenTitle.classList.add("active");
      playBgm("title");
  }
}

document.getElementById("btn-start").addEventListener("click", () => {
  showScreen("stage1");
});

/* ステージ1：クイズ＋ヒント */
const quizData = [
  {
    q: "この遺跡が眠る場所として最もふさわしいのは？",
    choices: ["砂漠の奥地", "都会の地下", "海の上", "宇宙空間"],
    answer: 0,
    hint: "インディジョーンズ的な冒険の舞台と言えば…？"
  },
  {
    q: "オラクルが守っているものは？",
    choices: ["金銀財宝だけ", "人の記憶", "知恵と試練の宝", "時間そのもの"],
    answer: 2,
    hint: "このゲームは“宝探し”だけど、テーマはそれ以上に…？"
  },
  {
    q: "遺跡に入る者に必要なものは？",
    choices: ["力だけ", "運だけ", "コネだけ", "勇気と好奇心"],
    answer: 3,
    hint: "冒険者らしい“心のあり方”を思い浮かべてみて。"
  }
];

let currentQuiz = 0;
const quizQuestion = document.getElementById("quiz-question");
const quizChoicesContainer = document.getElementById("quiz-choices");
const quizProgress = document.getElementById("quiz-progress");
const quizHintText = document.getElementById("quiz-hint");
const quizHintBtn  = document.getElementById("btn-quiz-hint");

function renderQuiz() {
  const data = quizData[currentQuiz];
  quizQuestion.textContent = data.q;
  quizChoicesContainer.innerHTML = "";
  quizHintText.textContent = "";
  quizProgress.textContent = `問題 ${currentQuiz + 1} / ${quizData.length}`;
  data.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "btn choice";
    btn.addEventListener("click", () => handleQuizAnswer(idx));
    quizChoicesContainer.appendChild(btn);
  });
}

function handleQuizAnswer(index) {
  const data = quizData[currentQuiz];
  const correct = data.answer === index;
  if (!correct) {
    quizProgress.textContent = "オラクル「ふむ…まだ門は開かぬようだ。」";
    return;
  }
  currentQuiz++;
  if (currentQuiz < quizData.length) {
    renderQuiz();
  } else {
    showScreen("stage2");
  }
}

quizHintBtn.addEventListener("click", () => {
  const data = quizData[currentQuiz];
  quizHintText.textContent = "ヒント： " + data.hint;
});

renderQuiz();

/* ステージ2：謎解き＋ヒント */
const puzzleChoices = document.querySelectorAll("#puzzle-choices .choice");
const puzzleMessage = document.getElementById("puzzle-message");
const puzzleHintText = document.getElementById("puzzle-hint");
const puzzleHintBtn  = document.getElementById("btn-puzzle-hint");

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

puzzleHintBtn.addEventListener("click", () => {
  puzzleHintText.textContent = "ヒント：△と◯が「交互」に並んでいることに注目してみよう。";
});

/* ステージ3：AIミッション＋ヒント */
const oracleInput   = document.getElementById("oracle-input");
const oracleBtn     = document.getElementById("btn-oracle");
const oracleMessage = document.getElementById("oracle-message");
const oracleHint    = document.getElementById("oracle-hint");
const oracleHintBtn = document.getElementById("btn-oracle-hint");
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
    oracleMessage.textContent = "オラクル「その答えでは扉は開かぬ。心の奥をもう一度見つめよ。」";
  }
}

oracleHintBtn.addEventListener("click", () => {
  if (!oracleHint.textContent) {
    oracleHint.textContent = "ヒント①：前を向く気持ち、前に進もうとする“気持ち”を表す二文字の漢字。";
  } else {
    oracleHint.textContent = "ヒント②：答えは『希望』。ひらがなでもOKだ。";
  }
});

/* クリア画面 */
document.getElementById("btn-restart").addEventListener("click", () => {
  currentQuiz = 0;
  renderQuiz();
  oracleInput.value = "";
  oracleMessage.textContent = "";
  puzzleMessage.textContent = "";
  puzzleHintText.textContent = "";
  quizHintText.textContent = "";
  oracleHint.textContent = "";
  showScreen("stage1");
});
