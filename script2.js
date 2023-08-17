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

    if ((selectedIndex === 1 && incorrectWord !== "") || selectedAnswer.correct) {
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
        const newTab = window.open("file:///D:/deped/index.html", "_blank");
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

    let summaryHTML = `<h2>Quiz Summary</h2>`;
    summaryHTML += `<div class="summary-item">
                        <p><strong>Examiner Name:</strong> ${examinerName}</p>
                        <p><strong>Contact Details:</strong> ${examinerContact}</p>
                        <p><strong>Final Score:</strong> ${score} out of ${shuffledQuestions.length} </p>
                    </div>`;
    for (let i = 0; i < shuffledQuestions.length; i++) {
        summaryHTML += `<div class="summary-item">`;
        const selectedAnswerIndex = selectedAnswers[i].index;
        if (selectedAnswerIndex !== undefined) {
            const selectedAnswer = shuffledQuestions[i].answers[selectedAnswerIndex];
            summaryHTML += `<p><strong>Question ${i + 1}:</strong> ${shuffledQuestions[i].question}</p>`;
            if (selectedAnswerIndex === 1 && selectedAnswers[i].incorrectWord) {
                if (selectedAnswers[i].incorrectWord.toLowerCase() === shuffledQuestions[i].incorrectWord.toLowerCase()) {
                    summaryHTML += `<p>Your Answer: False (Incorrect word: ${selectedAnswers[i].incorrectWord}) <span class="correct">Correct</span></p>`;
                    score++; // Increment the score for correct answer
                } else {
                    summaryHTML += `<p>Your Answer: False (Incorrect word: ${selectedAnswers[i].incorrectWord}) <span class="incorrect">Incorrect</span></p>`;
                }
            } else {
                summaryHTML += `<p>Your Answer: ${selectedAnswer.text}`;
                if (selectedAnswer.correct) {
                    summaryHTML += ` <span class="correct">Correct</span></p>`;
                    score++; // Increment the score for correct answer
                } else {
                    summaryHTML += ` <span class="incorrect">Incorrect</span></p>`;
                }
            }
        } else {
            summaryHTML += `<p>Your Answer: Not answered</p>`;
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
const questions =[
    {
           question: "Which law established the mandate of the Department of Education? It is also known as the Governance of Basic Education Act of 2001?",
           answers: [
               { text: "RA 9515", correct: false },
               { text: "RA 9155", correct: true },
               { text: "RA 9551", correct: false },
               { text: "RA 1955", correct: false },
               { text: "None of the above", correct: false },
           ],
       },
       {
           question: "The Department of Education is formerly known as",
           answers: [
               { text: "Superior Commission of Primary Instruction", correct: false },
               { text: "Ministry of Education, Culture and Sports", correct: false },
               { text: "Department of Education, Culture and Sports", correct: true },
               { text: "All of the choices", correct: false },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "DepEd is a ________________ institution.",
           answers: [
               { text: "learner-centered", correct: false },
               { text: "teacher-centered", correct: false },
               { text: "stakeholders-centered", correct: false },
               { text: "All of the choices", correct: true },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "Which of the following are under the supervision of DepEd?",
           answers: [
               { text: "Public Elementary Schools", correct: true },
               { text: "Public Secondary Schools", correct: true },
               { text: "Private Elementary and Secondary Schools", correct: true },
               { text: "All of the choices", correct: false },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "What is the role of the administrators and staff in DepEd’s mission?",
           answers: [
               { text: "Create a child-friendly, gender-sensitive, safe, and motivating environment", correct: false },
               { text: "Facilitate learning and constantly nurture every learner", correct: false },
               { text: "As stewards of the institution, ensure an enabling and supportive environment for effective learning to happen", correct: false },
               { text: "All of the choices", correct: true },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "The Regional Office is headed by the Regional Director and with how many functional divisions?",
           answers: [
               { text: "6", correct: false },
               { text: "8", correct: false },
               { text: "10", correct: true },
               { text: "3", correct: false },
               { text: "5", correct: false },
           ],
       },
       {
           question: "Based on the approved organizational structure of DepEd Regional Office, which of the following is not under the Administrative Division?",
           answers: [
               { text: "Cash", correct: false },
               { text: "Property and Supply", correct: false },
               { text: "Records", correct: false },
               { text: "Payroll", correct: true },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "Which of the following is considered as an oversight agency to the operations of the Administrative Division?",
           answers: [
               { text: "National Educators' Academy of the Philippines (NEAP)", correct: false },
               { text: "Anti-Red Tape Authority (ARTA)", correct: false },
               { text: "Department of Budget and Management (DBM)", correct: false },
               { text: "Commission on Audit (COA)", correct: true },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "Transactions in the government are classified as follows, EXCEPT:",
           answers: [
               { text: "simple", correct: false },
               { text: "complex", correct: false },
               { text: "complicated", correct: false },
               { text: "highly technical", correct: true },
               { text: "none of the choices", correct: false },
           ],
       },
       {
           question: "This law provides for the modernization, regulation and standardization of the procurement activities of the government and for other purposes.",
           answers: [
               { text: "RA 9485", correct: false },
               { text: "RA 9184", correct: true },
               { text: "RA 9418", correct: false },
               { text: "RA 9845", correct: false },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "The procurement law apply to the procurement of the following:",
           answers: [
               { text: "Goods and services", correct: true },
               { text: "Infrastructure projects", correct: true },
               { text: "Consulting Services", correct: true },
               { text: "All of the choices", correct: false },
               { text: "A and B only", correct: false },
           ],
       },
       {
           question: "This is the document prepared and submitted, annually, for approval by the Head of Office, which serves as basis in the procurement of goods and services for the Fiscal Year.",
           answers: [
               { text: "Annual Procurement Proposal (APP)", correct: false },
               { text: "Agency Procurement Proposal (APP)", correct: false },
               { text: "Agency Procurement Plan (APP)", correct: true },
               { text: "Annual Procurement Plan (APP)", correct: false },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "Agency Heads designate employees to be part of the composition of the Bids and Awards Committee (BAC) which shall be responsible for ensuring that the Procuring Entity abides by the standards set forth by the Procurement Law and its IRR. Which of the following are forbidden to be designated as members of the BAC?",
           answers: [
               { text: "Accountant", correct: false },
               { text: "Personnel of the Accounting Unit", correct: false },
               { text: "Budget Officer", correct: false },
               { text: "All of the choices", correct: true },
               { text: "A & B only", correct: false },
           ],
       },
       {
           question: "This is the default mode of procurement in the government.",
           answers: [
               { text: "Direct Contracting", correct: false },
               { text: "Public Bidding", correct: false },
               { text: "Shopping", correct: false },
               { text: "Small Value Procurement", correct: true },
               { text: "none of the choices", correct: false },
           ],
       },
       {
           question: "This is the form to be used when requesting for an item/goods to be procured and such item is tagged as available in the Procurement Service (PS).",
           answers: [
               { text: "Agency Procurement Request (APR)", correct: false },
               { text: "Procurement Request (PR)", correct: false },
               { text: "Agency Purchase Request (APR)", correct: false },
               { text: "Purchase Request (PR)", correct: true },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "Recruitment in government, such as DepEd, is based on merit and fitness. _______________ is added to the minimum QS requirements to improve accuracy in assessing a candidate’s fitness to a particular job.",
           answers: [
               { text: "Education", correct: false },
               { text: "Training", correct: false },
               { text: "Competencies", correct: true },
               { text: "Experience", correct: false },
               { text: "Eligibility", correct: false },
           ],
       },
       {
           question: "This is the Committee established in each government agency to assist the Appointing Authority in the judicious and objective selection of candidates for appointment to the vacant positions in accordance with the approved Agency Merit Selection Plan (MSP).",
           answers: [
               { text: "Human Resource Merit and Personnel Selection Board (HRMPSB)", correct: false },
               { text: "Human Resource Merit Promotion and Selection Board (HRMPSB)", correct: true },
               { text: "Human Resource Management and Personnel Selection Board (HRMPSB)", correct: false },
               { text: "Human Resource Management and Promotion Selection Board (HRMPSB)", correct: false },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "Who is responsible for the establishment, maintenance and disposal of 201/120 file of each personnel in the agency?",
           answers: [
               { text: "Head of Personnel/ HRMO", correct: false },
               { text: "Head of Records/ Records Officer", correct: true },
               { text: "Employee", correct: false },
               { text: "Head of Agency", correct: false },
               { text: "None of the choices", correct: false },
           ],
       },
       {
           question: "Which documents are required to be submitted by government employees, annually, based on statutory guidelines?",
           answers: [
               { text: "Individual Performance Commitment Review Form (IPCRF)- performance evaluation report", correct: true },
               { text: "Statement of Assets, Liabilities and Networth (SALN)", correct: true },
               { text: "NBI Clearance", correct: false },
               { text: "A and B", correct: false },
               { text: "B and C", correct: false },
           ],
       }, {
        question: "The following are part of the Department’s MATATAG Agenda, except:",
        answers: [
            { text: "making the curriculum relevant to produce competent and job-ready, active and responsible citizens", correct: false },
            { text: "taking steps to accelerate delivery of basic education facilities and services", correct: false },
            { text: "taking good care of learners by promoting learner well-being, inclusive education, and a positive learning environment", correct: false },
            { text: "giving support teachers to teach better", correct: false },
            { text: "none of the choices", correct: true },
        ],
    },
      
     
];


// Load the quiz state if available
