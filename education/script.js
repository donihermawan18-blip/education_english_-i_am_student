/* ============================================================
   I AM A STUDENT — Interactive English Learning
   SMPN 4 SOBANG — 2026–2027
============================================================ */

/* ============================================================
   1. YOUTUBE LINKS — replace with your real video URLs
============================================================ */
const youtubeLinks = {
  greeting:     "https://youtu.be/tJHQoUXbWx8?si=C7b0-tXHya5AEbJo",
  introduction: "https://youtu.be/LbGSgYLd7H8?si=aROmR_IgwTirsTI5",
  speaking:     "https://youtu.be/aqhEaOyM_gw?si=ATFVQi0yMm4JRkE4"
};

/* ============================================================
   2. LOCAL STORAGE KEYS
============================================================ */
const LS = {
  best:       "ias_bestScore",
  progress:   "ias_progress",
  goals:      "ias_goalsDone",
  vocab:      "ias_vocabOpened",
  flash:      "ias_flashOpened",
  reflection: "ias_reflection"
};

/* ============================================================
   3. HELPER FUNCTIONS
============================================================ */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2200);
}

function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}
function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) { return fallback; }
}

/* ---------- Progress state ---------- */
const progressState = loadLS(LS.progress, {
  greeting: false,
  introduction: false,
  vocabulary: false,
  speaking: false,
  pairwork: false,
  guided: false,
  production: false,
  game: false,
  quiz: false,
  reflection: false
});

function updateProgress() {
  const keys = Object.keys(progressState);
  const done = keys.filter(k => progressState[k]).length;
  const pct = Math.round((done / keys.length) * 100);

  $("#globalProgressFill").style.width = pct + "%";
  $("#globalProgressValue").textContent = pct + "%";
  $("#globalProgressBar").setAttribute("aria-valuenow", pct);
  $("#heroProgressFill").style.width = pct + "%";
  $("#heroProgressValue").textContent = pct + "%";

  let hint = "Let’s begin your first activity! 🚀";
  if (pct >= 100) hint = "Amazing! You finished everything! 🏆";
  else if (pct >= 70) hint = "Great job! Almost there! 👏";
  else if (pct >= 40) hint = "Keep going, you’re doing well! 💪";
  else if (pct > 0)   hint = "Good start! Continue learning. 📚";
  $("#heroProgressHint").textContent = hint;

  saveLS(LS.progress, progressState);
}

function markDone(key) {
  if (!progressState[key]) {
    progressState[key] = true;
    updateProgress();
  }
}

/* ============================================================
   4. NAVBAR / MOBILE MENU / SMOOTH SCROLL
============================================================ */
const hamburger = $("#hamburger");
const navLinks  = $("#navLinks");

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open);
});

$$(".nav-link").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* Active nav link on scroll */
const sections = ["home","goals","material","video","practice","game","quiz","reflection"];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      $$(".nav-link").forEach(l => l.classList.toggle("active",
        l.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(id => { const el = document.getElementById(id); if (el) navObserver.observe(el); });

/* ============================================================
   5. REVEAL ON SCROLL
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(el => revealObserver.observe(el));

/* ============================================================
   6. WEB SPEECH API (LISTEN BUTTONS)
============================================================ */
const speech = window.speechSynthesis;

function speak(text, lang = "en-US") {
  if (!speech) { toast("Sorry, your browser doesn’t support audio."); return; }
  speech.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  u.pitch = 1;

  const voices = speech.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith("en"));
  if (enVoice) u.voice = enVoice;

  speech.speak(u);
}

if (speech) speech.onvoiceschanged = () => {};

/* Bind all elements with data-speak */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-speak]");
  if (!el) return;
  speak(el.dataset.speak);

  if (el.dataset.activity) markDone(el.dataset.activity);
});

/* ============================================================
   7. HERO BUTTONS
============================================================ */
$("#startLearningBtn").addEventListener("click", () => {
  document.getElementById("goals").scrollIntoView({ behavior: "smooth" });
  toast("Welcome! Let’s start learning 🚀");
});

$("#watchIntroBtn").addEventListener("click", () => {
  $("#introModal").classList.add("open");
});

$("#closeModalBtn").addEventListener("click", () => $("#introModal").classList.remove("open"));
$("#modalCancel").addEventListener("click", () => $("#introModal").classList.remove("open"));
$("#introModal").addEventListener("click", (e) => {
  if (e.target.id === "introModal") e.target.classList.remove("open");
});

$("#modalOpenVideo").addEventListener("click", () => {
  window.open(youtubeLinks.introduction, "_blank", "noopener");
  $("#introModal").classList.remove("open");
});

/* ============================================================
   8. GOAL CARDS
============================================================ */
const goalsDone = loadLS(LS.goals, []);
function refreshGoalCards() {
  $$(".goal-card").forEach(card => {
    const id = card.dataset.goal;
    if (goalsDone.includes(id)) {
      card.classList.add("marked");
      card.setAttribute("aria-pressed", "true");
    } else {
      card.classList.remove("marked");
      card.setAttribute("aria-pressed", "false");
    }
  });
  const pct = Math.round((goalsDone.length / 4) * 100);
  $("#goalsProgressValue").textContent = pct + "%";
  $("#goalsProgressFill").style.width = pct + "%";
  $("#goalsNote").textContent = `${goalsDone.length} of 4 goal cards marked as learned.`;
}

$$(".goal-card").forEach(card => {
  const toggle = () => {
    const id = card.dataset.goal;
    const i = goalsDone.indexOf(id);
    if (i === -1) {
      goalsDone.push(id);
      toast("Great! Goal " + id + " marked as learned ✅");
    } else {
      goalsDone.splice(i, 1);
    }
    saveLS(LS.goals, goalsDone);
    refreshGoalCards();
  };
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
});
refreshGoalCards();

/* ============================================================
   9. VOCABULARY
============================================================ */
const vocabulary = [
  { word: "Hello",  emoji: "👋", meaning: "Halo",   example: "“Hello, my name is Rina.”" },
  { word: "Hi",     emoji: "🙋", meaning: "Hai",    example: "“Hi! How are you?”" },
  { word: "Name",   emoji: "🏷️", meaning: "Nama",   example: "“My name is Andi.”" },
  { word: "Student",emoji: "🎒", meaning: "Siswa",  example: "“I am a student.”" },
  { word: "Boy",    emoji: "👦", meaning: "Laki-laki", example: "“He is a boy.”" },
  { word: "Girl",   emoji: "👧", meaning: "Perempuan", example: "“She is a girl.”" },
  { word: "Hobby",  emoji: "⚽", meaning: "Hobi",   example: "“My hobby is reading.”" },
  { word: "School", emoji: "🏫", meaning: "Sekolah",example: "“I go to school every day.”" }
];

const openedVocab = loadLS(LS.vocab, []);
const vocabGrid = $("#vocabGrid");

vocabulary.forEach((v, i) => {
  const card = document.createElement("div");
  card.className = "vocab-card" + (openedVocab.includes(i) ? " opened" : "");
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "Vocabulary: " + v.word);
  card.innerHTML = `
    <span class="vocab-emoji">${v.emoji}</span>
    <div class="vocab-word">${v.word}</div>
    <div class="vocab-meaning">${openedVocab.includes(i) ? v.meaning : "Tap to see meaning"}</div>
    <div class="vocab-example">${openedVocab.includes(i) ? v.example : ""}</div>
    <button class="btn-icon" aria-label="Listen to ${v.word}">
      <i class="fa-solid fa-volume-high"></i>
    </button>
  `;
  const open = (e) => {
    if (e.target.closest(".btn-icon")) return;
    if (card.classList.contains("opened")) return;
    card.classList.add("opened");
    card.querySelector(".vocab-meaning").textContent = v.meaning;
    card.querySelector(".vocab-example").textContent = v.example;
    if (!openedVocab.includes(i)) {
      openedVocab.push(i);
      saveLS(LS.vocab, openedVocab);
      updateVocabCounter();
      if (openedVocab.length >= vocabulary.length) markDone("vocabulary");
    }
  };
  card.addEventListener("click", open);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); }
  });
  card.querySelector(".btn-icon").addEventListener("click", (e) => {
    e.stopPropagation();
    speak(v.word);
  });
  vocabGrid.appendChild(card);
});

function updateVocabCounter() {
  $("#vocabCounter").textContent = `${openedVocab.length} / ${vocabulary.length} words explored`;
}
updateVocabCounter();
if (openedVocab.length >= vocabulary.length) markDone("vocabulary");

/* ============================================================
   10. FLASHCARDS
============================================================ */
const openedFlash = loadLS(LS.flash, []);
const flashcards = $$(".flashcard");

flashcards.forEach((card, i) => {
  if (openedFlash.includes(i)) card.classList.add("flipped");
  const flip = () => {
    card.classList.toggle("flipped");
    if (card.classList.contains("flipped") && !openedFlash.includes(i)) {
      openedFlash.push(i);
      saveLS(LS.flash, openedFlash);
      updateFlashCounter();
    }
  };
  card.addEventListener("click", flip);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
});
function updateFlashCounter() {
  $("#flashCounter").textContent = `${openedFlash.length} / 3 flashcards opened`;
}
updateFlashCounter();

/* ============================================================
   11. VIDEO BUTTONS
============================================================ */
$$("[data-video]").forEach(btn => {
  btn.addEventListener("click", () => {
    const url = youtubeLinks[btn.dataset.video] || "https://www.youtube.com/";
    window.open(url, "_blank", "noopener");
    toast("Opening YouTube… 🎬");
  });
});

/* ============================================================
   12. SPEAKING PRACTICE — DIALOGUES
============================================================ */
const dialogues = [
  [
    { who: "STUDENT A", text: "Hello! What’s your name?", side: "a" },
    { who: "STUDENT B", text: "Hello! My name is Rina. What’s your name?", side: "b" },
    { who: "STUDENT A", text: "My name is Andi. Are you a student?", side: "a" },
    { who: "STUDENT B", text: "Yes, I am. I am a student.", side: "b" }
  ],
  [
    { who: "STUDENT A", text: "Good morning! How are you?", side: "a" },
    { who: "STUDENT B", text: "Good morning! I am fine, thank you.", side: "b" },
    { who: "STUDENT A", text: "What is your hobby?", side: "a" },
    { who: "STUDENT B", text: "My hobby is reading.", side: "b" }
  ],
  [
    { who: "STUDENT A", text: "Hi! Are you a new student?", side: "a" },
    { who: "STUDENT B", text: "Hi! Yes, I am. My name is Sinta.", side: "b" },
    { who: "STUDENT A", text: "Where are you from?", side: "a" },
    { who: "STUDENT B", text: "I am from Sobang.", side: "b" }
  ]
];
let currentDialogue = 0;

function renderDialogue() {
  const stage = $("#dialogueStage");
  const d = dialogues[currentDialogue];
  stage.innerHTML = d.map(line => `
    <div class="bubble ${line.side}">
      <div class="bubble-avatar">${line.side === "a" ? "🧑" : "👧"}</div>
      <div class="bubble-body">
        <span class="bubble-who">${line.who}</span>
        <p class="bubble-text">${line.text}</p>
      </div>
    </div>
  `).join("");
  $("#dialogueTitle").textContent = "Dialogue " + (currentDialogue + 1) + " / " + dialogues.length;
}

renderDialogue();

$("#listenDialogueBtn").addEventListener("click", () => {
  const text = dialogues[currentDialogue].map(l => l.text).join(" ");
  speak(text);
  markDone("speaking");
});

$("#repeatDialogueBtn").addEventListener("click", () => {
  renderDialogue();
  toast("Dialogue replayed 🔁");
});

$("#nextDialogueBtn").addEventListener("click", () => {
  currentDialogue = (currentDialogue + 1) % dialogues.length;
  renderDialogue();
  markDone("speaking");
});

/* ============================================================
   13. PAIR WORK
============================================================ */
const pairA = [
  "What is your name?",
  "Are you a student?",
  "What is your hobby?"
];
const pairB = [
  "My name is Rina.",
  "Yes, I am. I am a student.",
  "My hobby is reading."
];

let swapped = false;
function renderPair() {
  const aList = $("#pairListA");
  const bList = $("#pairListB");
  aList.innerHTML = (swapped ? pairB : pairA).map(t => `<li>${t}</li>`).join("");
  bList.innerHTML = (swapped ? pairA : pairB).map(t => `<li>${t}</li>`).join("");
}
renderPair();

$("#swapRolesBtn").addEventListener("click", () => {
  swapped = !swapped;
  renderPair();
  toast("Roles swapped! 🔄");
});

$("#pairDoneBtn").addEventListener("click", () => {
  markDone("pairwork");
  toast("Great pair work! ✅");
});

/* ============================================================
   14. GUIDED PRACTICE (LKPD)
============================================================ */
$("#lkpdForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name    = $("#lkpdName").value.trim();
  const birth   = $("#lkpdBirth").value.trim();
  const origin  = $("#lkpdOrigin").value.trim();
  const hobby   = $("#lkpdHobby").value.trim();

  $("#lkpdPlaceholder").classList.add("hidden");
  const card = $("#lkpdCard");
  card.classList.remove("hidden");
  $("#lkpdCardName").textContent = name;

  const lines = [
    "Hello!",
    `My name is ${name}.`,
    `I was born in ${birth}.`,
    `I am from ${origin}.`,
    `My hobby is ${hobby}.`,
    "I am a student."
  ];
  $("#lkpdCardLines").innerHTML = lines.map(l => `<li>${l}</li>`).join("");

  $("#lkpdListenBtn").onclick = () => speak(lines.join(" "));
  markDone("guided");
  toast("Your introduction is ready! 🎉");
});

/* ============================================================
   15. INDIVIDUAL PRODUCTION
============================================================ */
$("#prodForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name   = $("#prodName").value.trim();
  const birth  = $("#prodBirth").value.trim();
  const origin = $("#prodOrigin").value.trim();
  const hobby  = $("#prodHobby").value.trim();

  $("#prodPlaceholder").classList.add("hidden");
  const card = $("#prodCard");
  card.classList.remove("hidden");

  $("#prodCardTitle").textContent = "Hello, everyone!";
  const lines = [
    name,
    birth,
    origin,
    hobby,
    "I am a student."
  ];
  $("#prodCardLines").innerHTML = lines.map(l => `<li>${l}</li>`).join("");

  $("#prodListenBtn").onclick = () => speak(lines.join(" "));
  markDone("production");
  toast("Presentation card created! 🎤");
});

/* ============================================================
   16. PASS THE BALL GAME
============================================================ */
const challenges = [
  "Introduce yourself!",
  "Tell us your name and hobby!",
  "Say a greeting!",
  "Tell us where you are from!",
  "Say: “I am a student.”",
  "Ask your friend: “What is your name?”",
  "Say: “Good morning! How are you?”",
  "Tell us your hobby!"
];

const ball = $("#ball");
const arena = $("#gameArena");
const startBtn = $("#startGameBtn");
const stopBtn  = $("#stopGameBtn");
const challengeBox = $("#challengeBox");
const challengeText = $("#challengeText");

let gameInterval = null;
let isRunning = false;

function moveBall() {
  const maxX = arena.clientWidth - 60;
  const maxY = arena.clientHeight - 60;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  ball.style.left = x + "px";
  ball.style.top  = y + "px";
}

function startGame() {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  challengeBox.classList.add("hidden");
  $("#arenaHint").textContent = "🎵 Music is playing… the ball is moving!";
  moveBall();
  gameInterval = setInterval(moveBall, 700);
  markDone("game");
}

function stopGame() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(gameInterval);
  startBtn.disabled = false;
  stopBtn.disabled = true;
  $("#arenaHint").textContent = "🛑 Music stopped! Look at the challenge below.";

  const random = challenges[Math.floor(Math.random() * challenges.length)];
  challengeText.textContent = random;
  challengeBox.classList.remove("hidden");

  $("#challengeListenBtn").onclick = () => speak(random);
}

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);

/* ============================================================
   17. QUIZ
============================================================ */
const quizData = [
  {
    q: "What do you say when you meet someone in the morning?",
    options: ["Good night", "Good morning", "Goodbye", "See you"],
    correct: 1,
    explain: "‘Good morning’ is used from morning until around 12 p.m."
  },
  {
    q: "How do you introduce yourself?",
    options: ["My name is Rina.", "Good morning.", "Goodbye.", "Thank you."],
    correct: 0,
    explain: "We introduce ourselves by saying our name: ‘My name is…’"
  },
  {
    q: "“Are you a student?” — the correct answer is…",
    options: ["My name is Budi.", "Yes, I am.", "Good afternoon.", "I am from Sobang."],
    correct: 1,
    explain: "‘Are you…?’ is a yes/no question, so the answer is ‘Yes, I am.’"
  },
  {
    q: "“What is your name?” — the correct answer is…",
    options: ["My name is Andi.", "I am fine.", "Good night.", "Thank you."],
    correct: 0,
    explain: "The question asks your name, so answer with your name."
  },
  {
    q: "Which one is a greeting?",
    options: ["Student", "Hobby", "Hello", "Name"],
    correct: 2,
    explain: "‘Hello’ is a greeting."
  },
  {
    q: "What is the meaning of “Student”?",
    options: ["Guru", "Siswa", "Sekolah", "Teman"],
    correct: 1,
    explain: "‘Student’ in Indonesian means ‘Siswa’."
  },
  {
    q: "“My hobby is reading.” — What does “hobby” mean?",
    options: ["Nama", "Hobi", "Sekolah", "Siswa"],
    correct: 1,
    explain: "‘Hobby’ in Indonesian means ‘Hobi’."
  },
  {
    q: "Complete the sentence: “Hello, ___ name is Rina.”",
    options: ["I", "My", "Me", "Am"],
    correct: 1,
    explain: "We use ‘My’ before a noun: my name."
  },
  {
    q: "Complete: “I ___ a student.”",
    options: ["is", "are", "am", "be"],
    correct: 2,
    explain: "The correct verb for ‘I’ is ‘am’."
  },
  {
    q: "“What is your hobby?” — the correct answer is…",
    options: ["I am a student.", "My name is Rina.", "My hobby is reading.", "Good morning."],
    correct: 2,
    explain: "The question asks your hobby, so answer with your hobby."
  }
];

let qIndex = 0;
let score = 0;
let correctCount = 0;
let incorrectCount = 0;
let selected = false;
let quizStartTime = 0;
let timerInterval = null;

const bestScore = loadLS(LS.best, 0);
$("#bestScoreStart").textContent = bestScore;
$("#bestScoreResult").textContent = bestScore;

function startQuiz() {
  qIndex = 0; score = 0; correctCount = 0; incorrectCount = 0;
  $("#quizStart").classList.add("hidden");
  $("#quizResult").classList.add("hidden");
  $("#quizPlay").classList.remove("hidden");
  quizStartTime = Date.now();
  startTimer();
  renderQuestion();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const s = Math.floor((Date.now() - quizStartTime) / 1000);
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    $("#quizTimer").innerHTML = `<i class="fa-regular fa-clock"></i> ${m}:${ss}`;
  }, 1000);
}

function renderQuestion() {
  selected = false;
  const q = quizData[qIndex];
  $("#questionCounter").textContent = `Question ${qIndex + 1} of ${quizData.length}`;
  $("#quizScoreLive").textContent = `Score: ${score}`;
  $("#quizProgressFill").style.width = ((qIndex) / quizData.length) * 100 + "%";
  $("#questionText").textContent = q.q;
  $("#quizFeedback").classList.add("hidden");
  $("#nextQuestionBtn").classList.add("hidden");

  const opts = $("#quizOptions");
  opts.innerHTML = "";
  const keys = ["A","B","C","D"];
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="option-key">${keys[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => selectAnswer(i, btn));
    opts.appendChild(btn);
  });
}

function selectAnswer(i, btn) {
  if (selected) return;
  selected = true;
  const q = quizData[qIndex];
  const allBtns = $$(".option-btn");
  allBtns.forEach(b => b.disabled = true);

  if (i === q.correct) {
    btn.classList.add("correct");
    score += 10;
    correctCount++;
    showFeedback(true, q.explain);
  } else {
    btn.classList.add("wrong");
    allBtns[q.correct].classList.add("correct");
    incorrectCount++;
    showFeedback(false, q.explain);
  }

  $("#quizScoreLive").textContent = `Score: ${score}`;
  $("#nextQuestionBtn").classList.remove("hidden");
}

function showFeedback(ok, explain) {
  const fb = $("#quizFeedback");
  fb.className = "quiz-feedback " + (ok ? "ok" : "bad");
  fb.innerHTML = `<span class="fb-title">${ok ? "✅ Correct!" : "❌ Not quite."}</span>${explain}`;
  fb.classList.remove("hidden");
}

$("#nextQuestionBtn").addEventListener("click", () => {
  qIndex++;
  if (qIndex < quizData.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz() {
  clearInterval(timerInterval);
  $("#quizPlay").classList.add("hidden");
  $("#quizResult").classList.remove("hidden");

  const percent = Math.round((correctCount / quizData.length) * 100);
  $("#scorePercent").textContent = percent;
  $("#scoreRaw").textContent = `${correctCount}/${quizData.length}`;
  $("#correctCount").textContent = correctCount;
  $("#incorrectCount").textContent = incorrectCount;

  /* Score circle gradient */
  const deg = (percent / 100) * 360;
  $("#scoreCircle").style.setProperty("--deg", deg + "deg");
  $("#scoreCircle").style.background =
    `conic-gradient(#2563eb 0deg, #7c3aed ${deg}deg, #e2e8f0 ${deg}deg)`;

  let msg = "";
  if (percent >= 90) msg = "Excellent! You are amazing! 🌟";
  else if (percent >= 80) msg = "Great job! Keep practicing! 👏";
  else if (percent >= 70) msg = "Good work! You can improve more! 💪";
  else msg = "Don’t give up! Let’s study again! 📚";
  $("#performanceMsg").textContent = msg;

  if (percent > bestScore) {
    saveLS(LS.best, percent);
    $("#bestScoreResult").textContent = percent;
    toast("New best score! 🏆");
  }

  markDone("quiz");
}

$("#startQuizBtn").addEventListener("click", startQuiz);
$("#tryAgainBtn").addEventListener("click", startQuiz);
$("#reviewMaterialBtn").addEventListener("click", () => {
  document.getElementById("material").scrollIntoView({ behavior: "smooth" });
});
$("#backHomeBtn").addEventListener("click", () => {
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
});

/* ============================================================
   18. REFLECTION
============================================================ */
const confBtns = $$(".conf-btn");
let selectedConf = 0;
confBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    confBtns.forEach(b => { b.classList.remove("selected"); b.setAttribute("aria-checked","false"); });
    btn.classList.add("selected");
    btn.setAttribute("aria-checked","true");
    selectedConf = parseInt(btn.dataset.level);
  });
});

$("#reflectionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const checks = $$('.check-grid input:checked').map(i => i.value);
  const text = $("#reflectText").value.trim();

  saveLS(LS.reflection, {
    learned: checks,
    confidence: selectedConf,
    practice: text,
    date: new Date().toISOString()
  });

  $("#reflectionThanks").classList.remove("hidden");
  markDone("reflection");
  toast("Thank you for your reflection! 💙");

  setTimeout(() => {
    $("#reflectionThanks").scrollIntoView({ behavior: "smooth", block: "center" });
  }, 200);
});

/* ============================================================
   19. CLOSING BUTTON
============================================================ */
$("#closingHomeBtn").addEventListener("click", () => {
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
});

/* ============================================================
   20. INITIAL PROGRESS
============================================================ */
updateProgress();