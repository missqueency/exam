const examinerInfoElement = document.getElementById("examiner-info");
const nameInput = document.getElementById("name");
const contactInput = document.getElementById("contact");
const startButton = document.getElementById("start-button");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const scoreElement = document.getElementById("score");
const summaryElement = document.getElementById("summary");

let currentQuestionIndex = 0;
let score = 0;
let examinerName = "";
let examinerContact = "";
let shuffledQuestions = [];
let selectedAnswers = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startQuiz() {
    examinerName = nameInput.value.trim();
    examinerContact = contactInput.value.trim();

    if (examinerName === "" || examinerContact === "") {
        alert("Please enter your name and contact details.");
        return;
    }

    examinerInfoElement.style.display = "none";
    questionContainer.style.display = "block";
    summaryElement.style.display = "none";

    nextButton.style.display = "none";
    scoreElement.textContent = score;

    shuffledQuestions = [...questions];
    shuffle(shuffledQuestions);

    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

let timer;
let timeLimit = 5;

function startTimer() {
    let remainingTime = timeLimit;
    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            nextQuestion();
        } else {
            remainingTime--;
            document.getElementById("timer").textContent = remainingTime;
        }
    }, 1000);
}

function showQuestion(question) {
    clearInterval(timer);
    startTimer();

    questionElement.innerText = question.question;
    answerButtonsElement.innerHTML = "";
    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(index));
        answerButtonsElement.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    clearInterval(timer);
    selectedAnswers[currentQuestionIndex] = selectedIndex;

    const selectedAnswer = shuffledQuestions[currentQuestionIndex].answers[selectedIndex];
    if (selectedIndex === -1) {
        selectedAnswer.correct = false; // Mark as incorrect if no answer was selected
    }
    if (selectedAnswer.correct) {
        score++;
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        finishQuiz();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    clearInterval(timer);
    questionContainer.style.display = "none";

    let summaryHTML = `<h2>Quiz Summary</h2>`;
    summaryHTML += `<div class="summary-item">
                        <p><strong>Examiner Name:</strong> ${examinerName}</p>
                        <p><strong>Contact Details:</strong> ${examinerContact}</p>
                        <p><strong>Final Score:</strong> ${score} out of ${shuffledQuestions.length}</p>
                    </div>`;
    for (let i = 0; i < shuffledQuestions.length; i++) {
        summaryHTML += `<div class="summary-item">`;
        summaryHTML += `<p><strong>Question ${i + 1}:</strong> ${shuffledQuestions[i].question}</p>`;
        const selectedAnswerIndex = selectedAnswers[i];
        if (selectedAnswerIndex !== undefined) {
            const selectedAnswer = shuffledQuestions[i].answers[selectedAnswerIndex];
            summaryHTML += `<p>Your Answer: ${selectedAnswer.text}`;
            if (selectedAnswer.correct) {
                summaryHTML += ` <span class="correct">Correct</span></p>`;
            } else {
                summaryHTML += ` <span class="incorrect">Incorrect</span></p>`;
            }
        } else {
            summaryHTML += `<p>Your Answer: Not answered</p>`;
        }
        summaryHTML += `</div>`;
    }

    summaryElement.innerHTML = summaryHTML;
    summaryElement.style.display = "block";

    // Add Print button and generate PDF functionality
    summaryHTML += `<button id="print-button" class="btn">Print Summary</button>`;
    summaryElement.innerHTML = summaryHTML;

    const printButton = document.getElementById("print-button");
       printButton.addEventListener("click", function () {
           generatePDF(summaryElement.innerHTML);
       });
}

window.onbeforeunload = function() {
    clearInterval(timer);
    return "Are you sure you want to leave the page?";
};

// Sample quiz questions and answers
const questions = [
    {
        question: "Who wrote the play 'Romeo and Juliet'?",
        answers: [
            { text: "William Shakespeare", correct: true },
            { text: "Charles Dickens", correct: false },
            { text: "Jane Austen", correct: false },
            { text: "Mark Twain", correct: false },
        ],
    },
    {
        question: "What novel is set in the fictional county of Wessex?",
        answers: [
            { text: "Wuthering Heights", correct: false },
            { text: "Tess of the d'Urbervilles", correct: true },
            { text: "Great Expectations", correct: false },
            { text: "Moby-Dick", correct: false },
        ],
    },
    // Add more questions and answers here
];

// Load the quiz state if available
loadQuizState();
