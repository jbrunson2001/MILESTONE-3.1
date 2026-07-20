
"use strict";

const quizForm = document.getElementById("quizForm");
const resultsBox = document.getElementById("results");
const q5Error = document.getElementById("q5Error");

function selectedRadio(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
}

function selectedCheckboxes(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map((item) => item.value)
        .sort();
}

function arraysMatch(first, second) {
    if (first.length !== second.length) {
        return false;
    }

    return first.every((value, index) => value === second[index]);
}

function resultCard(number, isCorrect, earned, correctAnswer) {
    const resultClass = isCorrect ? "correct-result" : "incorrect-result";
    const textClass = isCorrect ? "correct-text" : "incorrect-text";
    const resultWord = isCorrect ? "Correct" : "Incorrect";
    const symbol = isCorrect ? "✓" : "✗";

    return `
        <div class="result-item ${resultClass}">
            <p><span class="${textClass}">${symbol} Question ${number}: ${resultWord}</span></p>
            <p><strong>Question score:</strong> ${earned}/20</p>
            <p><strong>Correct answer:</strong> ${correctAnswer}</p>
        </div>`;
}

function gradeQuiz(event) {
    event.preventDefault();

    if (!quizForm.reportValidity()) {
        return;
    }

    const q5Answers = selectedCheckboxes("q5");
    if (q5Answers.length === 0) {
        q5Error.textContent = "Please select at least one answer for Question 5.";
        document.querySelector('input[name="q5"]').focus();
        return;
    }
    q5Error.textContent = "";

    let score = 0;
    let details = "";

    const q1Correct = document.getElementById("q1").value.trim().toLowerCase() === "gecko";
    if (q1Correct) score += 20;
    details += resultCard(1, q1Correct, q1Correct ? 20 : 0, "Gecko");

    const q2Correct = selectedRadio("q2") === "WebKit";
    if (q2Correct) score += 20;
    details += resultCard(2, q2Correct, q2Correct ? 20 : 0, "WebKit");

    const q3Correct = selectedRadio("q3") === "HTML";
    if (q3Correct) score += 20;
    details += resultCard(3, q3Correct, q3Correct ? 20 : 0, "HTML");

    const q4Correct = selectedRadio("q4") === "Compatibility";
    if (q4Correct) score += 20;
    details += resultCard(4, q4Correct, q4Correct ? 20 : 0, "They improve compatibility across browsers and devices.");

    const correctQ5 = ["Blink", "Gecko", "WebKit"];
    const q5Correct = arraysMatch(q5Answers, correctQ5);
    if (q5Correct) score += 20;
    details += resultCard(5, q5Correct, q5Correct ? 20 : 0, "Blink, Gecko, and WebKit");

    const passed = score >= 70;
    const overall = passed ? "PASS" : "FAIL";
    const overallClass = passed ? "pass" : "fail";

    resultsBox.className = `quiz-results ${overallClass}`;
    resultsBox.innerHTML = `
        <h3>Quiz Results</h3>
        <p><strong>Overall result:</strong> ${overall}</p>
        <p><strong>Total score:</strong> ${score}/100</p>
        ${details}`;
    resultsBox.hidden = false;
    resultsBox.focus();
    resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearQuiz() {
    q5Error.textContent = "";
    resultsBox.hidden = true;
    resultsBox.className = "quiz-results";
    resultsBox.innerHTML = "";

   
    window.setTimeout(() => document.getElementById("q1").focus(), 0);
}

quizForm.addEventListener("submit", gradeQuiz);
quizForm.addEventListener("reset", clearQuiz);
