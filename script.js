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
     const instructionElement = document.getElementById("instruction");
    instructionElement.style.display = "none";

    shuffledQuestions = [...questions];
    shuffle(shuffledQuestions);

    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

let timer;
let timeLimit = 30;

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

    if (question.answers[0].text === "True" || question.answers[0].text === "False") {
        const trueButton = document.createElement("button");
        const falseButton = document.createElement("button");

        trueButton.innerText = "True";
        trueButton.classList.add("btn");
        trueButton.addEventListener("click", () => selectAnswer(0));
        answerButtonsElement.appendChild(trueButton);

        falseButton.innerText = "False";
        falseButton.classList.add("btn");
        falseButton.addEventListener("click", () => {
            const incorrectWord = prompt("Please enter an incorrect word:");
            if (incorrectWord !== null) {
                selectAnswer(1, incorrectWord);
            }
        });
        answerButtonsElement.appendChild(falseButton);
    } else {
        question.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");

            if (answer.correct) {
                button.classList.add("correct");
            } else {
                button.classList.add("incorrect");
            }

            button.addEventListener("click", () => selectAnswer(index));
            answerButtonsElement.appendChild(button);
        });
    }
}

function selectAnswer(selectedIndex, incorrectWord = "") {
    clearInterval(timer);
    const selectedQuestion = shuffledQuestions[currentQuestionIndex];
    const selectedAnswer = selectedQuestion.answers[selectedIndex];

    if (selectedAnswer.correct && (selectedIndex !== 1 || incorrectWord === "")) {
        if (selectedQuestion.answers.length === 2) {
            score += 2; // Questions with 2 choices are worth 2 points
        } else {
            score += 1; // Questions with more than 2 choices are worth 1 point
        }       
    }

    selectedAnswers[currentQuestionIndex] = { index: selectedIndex, incorrectWord };

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        finishQuiz();
        beginTimer();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        finishQuiz();
        beginTimer();
    }
}

let timer2;

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    document.body.appendChild(notification);
}

function beginTimer() {
    showNotification("Redirecting to another tab. Please don't close this tab.");
    timer2 = setTimeout(() => {
        const newTab = window.open("https://bit.ly/DepEdROX_AO2Exam", "_blank");
        newTab.focus();
        hideNotification();
    }, 3000);
}

function hideNotification() {
    const notification = document.querySelector(".notification");
    if (notification) {
        document.body.removeChild(notification);
    }
}

 
function finishQuiz() {
    clearInterval(timer);
    questionContainer.style.display = "none";

    let summaryHTML = `<h2>Exam Results</h2>`;
    summaryHTML += `<div class="summary-item" style="font-size: 20px">
                        <p><strong style="font-size: 20px;">Examiner Name:</strong> ${examinerName}</p>
                        <p><strong style="font-size: 20px;">Contact Details:</strong> ${examinerContact}</p>
                        <p><strong style="font-size: 20px;">Final Score:</strong> ${score} out of 20 </p>
                    </div>`;
    for (let i = 0; i < shuffledQuestions.length; i++) {
        summaryHTML += `<div class="summary-item">`;
        if (selectedAnswers[i] === undefined) {
            summaryHTML += `<p><strong>Question ${i + 1}:</strong> ${shuffledQuestions[i].question}</p>`;
            summaryHTML += `<p style="color:red">Your Answer: Not answered</p>`;
        } else {
            const selectedAnswerIndex = selectedAnswers[i].index;
            const selectedAnswer = shuffledQuestions[i].answers[selectedAnswerIndex];
            summaryHTML += `<p><strong>Question ${i + 1}:</strong> ${shuffledQuestions[i].question}</p>`;
            if (selectedAnswerIndex === 1 && selectedAnswers[i].incorrectWord) {
                if (selectedAnswers[i].incorrectWord.toLowerCase() === shuffledQuestions[i].incorrectWord.toLowerCase()) {
                    summaryHTML += `<p>Your Answer: False (Incorrect word: ${selectedAnswers[i].incorrectWord}) <span class="correct" style="color: green">Correct</span></p>`;
                } else {
                    summaryHTML += `<p>Your Answer: False (Incorrect word: ${selectedAnswers[i].incorrectWord}) <span class="incorrect" style="color: red">Incorrect</span></p>`;
                }
            } else {
                summaryHTML += `<p>Your Answer: ${selectedAnswer.text}`;
                if (selectedAnswer.correct) {
                    summaryHTML += ` <span class="correct" style="color: green;">Correct</span>`;
                } else {
                    summaryHTML += ` <span class="incorrect" style="color: red">Incorrect</span>`;
                }
                summaryHTML += `</p>`; // Close the <p> tag after applying class
            }
        }
        summaryHTML += `</div>`;
    }

    summaryElement.innerHTML = summaryHTML;
    summaryElement.style.display = "block";
}


window.onbeforeunload = function() {
    clearInterval(timer);
    return "Are you sure you want to leave the page?";
};

// Sample quiz questions and answers
const questions = [
    {
        question: "DepEd was established through Education Decree of 1863 as the Superior Commission of Primary Instruction under a Chairman.",
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false },
        ],
    }, {
        question: "DepEd supervises all elementary, secondary and tertiary institutions, including alternative learning systems, both public and private.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true },
        ],
        incorrectWord: "tertiary",
    },
    {
        question: "The core values of DepEd is Maka-Diyos, Maka-tao, Makakalikasan and Makabansa.",
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false },
        ],
        incorrectWord: "",
    },
    {
        question: "Procurement Project Management Plan (PPMP) is the consolidation of all APPs for a procuring entity that is scheduled for procurement for a calendar year.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true },
        ],
        incorrectWord: "Procurement Project Management Plan (PPMP), APPs",
    },
    {
        question: "In general, agencies can undertake procurement even if it is not in accordance with the approved APP.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true },
        ],
        incorrectWord: "not",
    },
    {
        question: "Even if the applicant’s education did not meet the minimum Qualification Standards (QS) for the position, the applicant will still qualify for the position if he/she has at least 5 years of work experience relevant to the position.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true },
        ],
        incorrectWord: "still qualify",
    },
    {
        question: "The Appointing Authority must appoint the top 1 applicant.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true },
        ],
        incorrectWord: "must",
    },
    {   
        question: "Government agencies hire based solely on trust and confidence.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true },
        ],
        incorrectWord: "solely",
    },
    {
        question: "Upon separation or retirement, the employee (who retired/ separated from the service) shall assume responsibility for safekeeping of 201/120 file.",
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false },
        ],
           },
    {
        question: "No officer, member or employee of any agency of the government, whether national or local, or any political subdivision thereof shall destroy, sell or otherwise dispose of any public records or printed public document in such person's care or custody or under such person's control without first having secured authority from the National Archives of the Philippines of their nature and obtained its authorization.",
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false },
        ],
      
    },
   
];

// Load the quiz state if available
