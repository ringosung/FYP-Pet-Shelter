const questions =[
    {
        question:"I want to adopt a pet so I can:",
        answers:[
            {text:"Come home to an adorable cuddly companion",correct:true},
            {text:"Have a buddy who I can take everywhere!",correct:true},
            {text:"Help save a life",correct:true},
        ]
    }
    ,
    {
        question:"My favourite pastime is:",
        answers:[
            {text:"Hanging out at home and watching TV",correct:true},
            {text:"Chasing my next adventure",correct:true},
            {text:"Meeting my friends",correct:true}
        ]
    },
    {
        question:"What kind of friends do you like?",
        answers:[
            {text:"Loyal pals.",correct:true},
            {text:"Sweet, fun friends.",correct:true},
            {text:"People who make interesting conversation.",correct:true}
        ]
    },


];

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("btn-next");
const speciesQuiz = document.getElementById("speciesQuiz");
const personalityQuiz = document.getElementById("personalityQuiz");
const submitButton = document.getElementById("btn-submit")

let currentQuestionIndex = 0;
let score = 0;
let answer1 = "";

// Start Quiz
function startQuiz()
{
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

// Show Question
function showQuestion()
{
    resetState();
    let currentQuestion= questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo+". "+currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if(answer.correct)
        {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        
    });
}

// Reset State
function resetState()
{
    nextButton.style.display = "none";
    while(answerButton.firstChild)
    {
        answerButton.removeChild(answerButton.firstChild);
    }
}

// Select Answer
function selectAnswer(e)
{
    const selectedbtn = e.target;
    const isCorrect = selectedbtn.dataset.correct === "true";
    answer1 = selectedbtn.innerHTML;
    switch(answer1){
        case "Come home to an adorable cuddly companion":
            speciesQuiz.value = "Cat"
            break;
        case "Have a buddy who I can take everywhere!":
            speciesQuiz.value = "Dog"
            break;
        case "Hanging out at home and watching TV":
            personalityQuiz.value = "Introverted"
            break;
        case "Meeting my friends":
            personalityQuiz.value = "Sociable"
            break;
        case "Loyal pals.":
            personalityQuiz.value = "Loyal"
            break;
        case "People who make interesting conversation.":
            personalityQuiz.value = "Talkative"
            break;
        
    }

    
    selectedbtn.classList.add("correct");
    Array.from(answerButton.children).forEach(button => {
        if(button.dataset.correct === "true")
        {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
    
}

// Show Score
function showScore()
{
    resetState();
    questionElement.innerHTML = answer1;

    
    nextButton.innerHTML = "Restart";
    nextButton.style.display = "none";
    submitButton.style.display = "block";
    
}

// Handle Next Button
function handleNextButton()
{
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length)
    {
        showQuestion();
    }
    else{
        showScore();
        
    }
}

nextButton.addEventListener("click",() => {
    if(currentQuestionIndex < questions.length )
    {
        handleNextButton();
    }
    else{
        startQuiz();
    }
});

startQuiz();