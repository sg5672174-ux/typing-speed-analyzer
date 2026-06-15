let paragraphs = {
    easy: [
        "I like to play games.",
        "This is a simple typing test.",
        "Typing is fun and easy."
    ],
    medium: [
        "Typing is an important skill for students.",
        "Practice daily to improve your typing speed.",
        "Always try to type without looking at the keyboard."
    ],
    hard: [
        "Typing performance analyzer helps users evaluate speed and accuracy efficiently.",
        "Consistent practice enhances both typing speed and reduces the chances of errors significantly.",
        "Developing strong typing skills is essential in modern digital communication and productivity."
    ]
};

let startTime;
let isTypingStarted = false;
let timerInterval; 

window.onload = function () {

    let input = document.getElementById("typingInput");

    if (input) {
        input.addEventListener("input", function () {
            if (!isTypingStarted) {
                startTime = new Date().getTime();
                isTypingStarted = true;
                timerInterval = setInterval(updateTimer, 1000);
            }
        });
    }

    setParagraph();

    displayLeaderboard();

    let name = localStorage.getItem("userName");
    let welcome = document.getElementById("welcome");
    if (name && welcome) {
        welcome.innerHTML = "Welcome " + name + " 👋";
    }
};

function startTest() {
    let name = document.getElementById("username").value;

    if (name === "") {
        alert("Please enter your name");
        return;
    }

    let oldName = localStorage.getItem("userName");

    if (oldName && oldName !== name) {
        localStorage.removeItem("scores");
    }

    localStorage.setItem("userName", name);

    window.location.href = "test.html";
}

function submitTest() {

    if (!isTypingStarted) {
        alert("Please start typing first!");
        return;
    }

    clearInterval(timerInterval);

    let endTime = new Date().getTime();
    let timeTaken = (endTime - startTime) / 1000;

    let originalText = document.getElementById("sentence").innerText;
    let userText = document.getElementById("typingInput").value;

    let correct = 0;

    for (let i = 0; i < originalText.length; i++) {
        if (userText[i] === originalText[i]) {
            correct++;
        }
    }

    let accuracy = (correct / originalText.length) * 100;

    if (accuracy > 100) {
        accuracy = 100;
    }

    let wordsTyped = userText.trim().split(" ").length;

    let timeInMinutes = timeTaken / 60;

    let wpm = 0;

    if (timeInMinutes > 0) {
        wpm = wordsTyped / timeInMinutes;
    }

    let mistakes = originalText.length - correct;
    document.getElementById("timeResult").innerHTML =
        "Time: " + timeTaken.toFixed(2) + " sec";

    document.getElementById("accuracyResult").innerHTML =
        "Accuracy: " + accuracy.toFixed(2) + "% | Mistakes: " + mistakes;

    document.getElementById("wpmResult").innerHTML =
        "WPM: " + wpm.toFixed(2);

    document.getElementById("resultBox").style.display = "flex";

    saveScore(wpm, accuracy);

    displayLeaderboard();
}

function closeResult() {
    document.getElementById("resultBox").style.display = "none";
}

function updateTimer() {
    let currentTime = new Date().getTime();
    let timePassed = Math.floor((currentTime - startTime) / 1000);

    let timer = document.getElementById("timer");
    if (timer) {
        timer.innerHTML = "Time: " + timePassed + " sec";
    }
}

function setParagraph() {

    let level = document.getElementById("level").value;

    let selectedArray = paragraphs[level];

    let randomIndex = Math.floor(Math.random() * selectedArray.length);

    let randomText = selectedArray[randomIndex];

    document.getElementById("sentence").innerText = randomText;

    document.getElementById("typingInput").value = "";

    isTypingStarted = false;
    clearInterval(timerInterval);

    let timer = document.getElementById("timer");
    if (timer) {
        timer.innerHTML = "Time: 0 sec";
    }
}

function restartTest() {

    clearInterval(timerInterval);

    isTypingStarted = false;
    startTime = null;

    let input = document.getElementById("typingInput");
    if (input) {
        input.value = "";
    }

    let timer = document.getElementById("timer");
    if (timer) {
        timer.innerHTML = "Time: 0 sec";
    }

    setParagraph();

    let result = document.getElementById("resultBox");
    if (result) {
        result.style.display = "none";
    }
}

function displayLeaderboard() {

    let list = document.getElementById("leaderboard");

    if (!list) return;

    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    list.innerHTML = "";

    scores.forEach((item, index) => {

        let li = document.createElement("li");

        li.textContent =
            `${index + 1}. ${item.name} | Accuracy: ${item.accuracy.toFixed(2)}% | WPM: ${item.wpm.toFixed(2)}`;

        if(index === 0){
            li.classList.add("top-score");
        }

        list.appendChild(li);
    });
}

function saveScore(wpm, accuracy) {

    let name = localStorage.getItem("userName") || "Guest";

    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    scores.push({
        name: name,
        wpm: wpm,
        accuracy: accuracy
    });

    scores.sort((a, b) => {

        if (b.accuracy === a.accuracy) {
            return b.wpm - a.wpm;
        }

        return b.accuracy - a.accuracy;
    });

    scores = scores.slice(0, 5);

    localStorage.setItem("scores", JSON.stringify(scores));
}