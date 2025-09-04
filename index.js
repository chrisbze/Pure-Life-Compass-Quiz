// Pure Life Compass Quiz - Emergency Single File Deployment
// Complete quiz application in one file for Railway

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for Railway
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health Check
app.get('/api/health-check', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Pure Life Compass Quiz API is running!'
  });
});

// Quiz Questions
app.get('/api/questions', (req, res) => {
  const quizData = {
    title: "Pure Life Compass Quiz",
    description: "Discover your path to fulfillment and purpose",
    questions: [
      {
        id: "q1",
        text: "When facing a major life decision, what guides you most?",
        type: "multiple_choice",
        options: [
          { value: "a", text: "My heart and intuition" },
          { value: "b", text: "Logical analysis and facts" },
          { value: "c", text: "What others have done successfully" },
          { value: "d", text: "The potential for growth and learning" }
        ]
      },
      {
        id: "q2",
        text: "What energizes you most in your daily life?",
        type: "multiple_choice",
        options: [
          { value: "a", text: "Creating something new and meaningful" },
          { value: "b", text: "Solving complex problems efficiently" },
          { value: "c", text: "Helping others achieve their goals" },
          { value: "d", text: "Leading and inspiring a team" }
        ]
      },
      {
        id: "q3",
        text: "When you imagine your ideal future, you see yourself:",
        type: "multiple_choice",
        options: [
          { value: "a", text: "Living authentically and pursuing your passions" },
          { value: "b", text: "Building something substantial and lasting" },
          { value: "c", text: "Making steady progress toward clear goals" },
          { value: "d", text: "Influencing positive change in the world" }
        ]
      }
    ],
    personalInfo: [
      {
        id: "name",
        label: "Your Name",
        type: "text",
        required: true
      },
      {
        id: "email",
        label: "Email Address", 
        type: "email",
        required: true
      }
    ]
  };
  
  res.json(quizData);
});

// Submit Quiz
app.post('/api/submit-quiz', async (req, res) => {
  try {
    const { responses, name, email } = req.body;
    
    // Simple scoring algorithm
    const scoring = { a: 0, b: 0, c: 0, d: 0 };
    Object.values(responses).forEach(answer => {
      if (scoring.hasOwnProperty(answer)) {
        scoring[answer]++;
      }
    });
    
    // Determine result type
    const maxScore = Math.max(...Object.values(scoring));
    const resultType = Object.keys(scoring).find(key => scoring[key] === maxScore);
    
    const results = {
      a: { type: 'Dreamer', description: 'You are guided by vision and creativity!' },
      b: { type: 'Builder', description: 'You are driven by logic and systematic progress!' },
      c: { type: 'Driver', description: 'You are motivated by achievement and results!' },
      d: { type: 'Leader', description: 'You are inspired by growth and influence!' }
    };
    
    const result = {
      success: true,
      result: results[resultType],
      personalizedMessage: `Thank you ${name}! Your Pure Life Compass points toward being a ${results[resultType].type}.`,
      nextSteps: [
        'Check your email for your detailed results',
        'Join our community of like-minded individuals', 
        'Schedule a free consultation to dive deeper'
      ]
    };
    
    // Log for testing (in production, this would go to GHL)
    console.log('Quiz Submission:', { name, email, responses, result: results[resultType] });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process quiz submission' 
    });
  }
});

// Serve the quiz HTML
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pure Life Compass Quiz</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .quiz-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            color: #4a5568;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #718096;
            font-size: 1.2em;
        }
        
        .question {
            margin-bottom: 30px;
            display: none;
        }
        
        .question.active {
            display: block;
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .question h3 {
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 1.3em;
        }
        
        .option {
            margin-bottom: 15px;
        }
        
        .option label {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f7fafc;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .option label:hover {
            background: #e2e8f0;
            transform: translateX(5px);
        }
        
        .option input[type="radio"] {
            margin-right: 15px;
            transform: scale(1.2);
        }
        
        .personal-info {
            display: none;
            margin-bottom: 30px;
        }
        
        .personal-info.active {
            display: block;
            animation: fadeIn 0.5s ease-in;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2d3748;
            font-weight: 600;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .buttons {
            text-align: center;
            margin-top: 30px;
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-size: 1.1em;
            cursor: pointer;
            margin: 0 10px;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .btn-secondary {
            background: #718096;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .result {
            display: none;
            text-align: center;
        }
        
        .result.active {
            display: block;
            animation: fadeIn 0.5s ease-in;
        }
        
        .result h2 {
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 2em;
        }
        
        .result-type {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            display: none;
        }
        
        .loading.active {
            display: block;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="quiz-card">
            <div class="header">
                <h1>🧭 Pure Life Compass Quiz</h1>
                <p>Discover your path to fulfillment and purpose</p>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            
            <form id="quizForm">
                <div id="questionsContainer"></div>
                
                <div class="personal-info" id="personalInfo">
                    <h3>Almost done! Tell us about yourself:</h3>
                    <div class="form-group">
                        <label for="name">Your Name *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                </div>
                
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p>Calculating your Pure Life Compass...</p>
                </div>
                
                <div class="result" id="result">
                    <h2>🎉 Your Results Are In!</h2>
                    <div class="result-type" id="resultType"></div>
                    <div id="resultMessage"></div>
                    <div id="nextSteps"></div>
                </div>
                
                <div class="buttons">
                    <button type="button" class="btn btn-secondary" id="prevBtn" onclick="previousQuestion()" style="display: none;">Previous</button>
                    <button type="button" class="btn" id="nextBtn" onclick="nextQuestion()">Start Quiz</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let currentQuestion = -1;
        let questions = [];
        let responses = {};
        
        // Load quiz questions
        async function loadQuiz() {
            try {
                const response = await fetch('/api/questions');
                const data = await response.json();
                questions = data.questions;
                renderQuestions();
                updateProgress();
            } catch (error) {
                console.error('Failed to load quiz:', error);
            }
        }
        
        function renderQuestions() {
            const container = document.getElementById('questionsContainer');
            container.innerHTML = '';
            
            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
                questionDiv.id = 'question' + index;
                
                let optionsHTML = '';
                question.options.forEach(option => {
                    optionsHTML += \`
                        <div class="option">
                            <label>
                                <input type="radio" name="\${question.id}" value="\${option.value}" onchange="selectAnswer('\${question.id}', '\${option.value}')">
                                <span>\${option.text}</span>
                            </label>
                        </div>
                    \`;
                });
                
                questionDiv.innerHTML = \`
                    <h3>Question \${index + 1} of \${questions.length}</h3>
                    <p>\${question.text}</p>
                    <div class="options">
                        \${optionsHTML}
                    </div>
                \`;
                
                container.appendChild(questionDiv);
            });
        }
        
        function selectAnswer(questionId, value) {
            responses[questionId] = value;
            
            // Enable next button
            const nextBtn = document.getElementById('nextBtn');
            nextBtn.disabled = false;
        }
        
        function nextQuestion() {
            if (currentQuestion === -1) {
                // Starting quiz
                currentQuestion = 0;
                showQuestion(currentQuestion);
                document.getElementById('nextBtn').textContent = 'Next Question';
                document.getElementById('prevBtn').style.display = 'inline-block';
                return;
            }
            
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                // Show personal info
                showPersonalInfo();
            }
            
            updateProgress();
            updateButtons();
        }
        
        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
                updateProgress();
                updateButtons();
            }
        }
        
        function showQuestion(index) {
            // Hide all questions
            document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
            document.getElementById('personalInfo').classList.remove('active');
            
            // Show current question
            document.getElementById('question' + index).classList.add('active');
        }
        
        function showPersonalInfo() {
            // Hide all questions
            document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
            
            // Show personal info
            document.getElementById('personalInfo').classList.add('active');
            document.getElementById('nextBtn').textContent = 'Get My Results';
            document.getElementById('nextBtn').onclick = submitQuiz;
        }
        
        async function submitQuiz() {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if (!name || !email) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Show loading
            document.getElementById('personalInfo').classList.remove('active');
            document.getElementById('loading').classList.add('active');
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('prevBtn').style.display = 'none';
            
            try {
                const response = await fetch('/api/submit-quiz', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        responses,
                        name,
                        email
                    })
                });
                
                const result = await response.json();
                
                setTimeout(() => {
                    showResults(result);
                }, 2000);
                
            } catch (error) {
                console.error('Failed to submit quiz:', error);
                alert('Failed to submit quiz. Please try again.');
            }
        }
        
        function showResults(result) {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('result').classList.add('active');
            
            document.getElementById('resultType').innerHTML = \`
                <h3>\${result.result.type}</h3>
                <p>\${result.result.description}</p>
            \`;
            
            document.getElementById('resultMessage').innerHTML = \`
                <p>\${result.personalizedMessage}</p>
            \`;
            
            let nextStepsHTML = '<h4>Your Next Steps:</h4><ul>';
            result.nextSteps.forEach(step => {
                nextStepsHTML += \`<li>\${step}</li>\`;
            });
            nextStepsHTML += '</ul>';
            
            document.getElementById('nextSteps').innerHTML = nextStepsHTML;
        }
        
        function updateProgress() {
            const progress = currentQuestion === -1 ? 0 : ((currentQuestion + 1) / questions.length) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }
        
        function updateButtons() {
            const nextBtn = document.getElementById('nextBtn');
            const prevBtn = document.getElementById('prevBtn');
            
            // Check if current question is answered
            if (currentQuestion >= 0 && currentQuestion < questions.length) {
                const questionId = questions[currentQuestion].id;
                nextBtn.disabled = !responses[questionId];
            } else {
                nextBtn.disabled = false;
            }
            
            prevBtn.disabled = currentQuestion <= 0;
        }
        
        // Initialize
        loadQuiz();
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Pure Life Compass Quiz is running on port \${PORT}!\`);
  console.log(\`🌐 Visit: http://localhost:\${PORT}\`);
});