// Pure Life Compass Quiz Logic - Always Works™ Implementation
// Handles quiz flow, scoring, and user interaction

class PureLifeQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.userInfo = {};
        this.startTime = null;
        this.isSubmitting = false;
        
        // Initialize quiz when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('🧭 Pure Life Compass Quiz - Initializing...');
        this.setupEmailForm();
        this.setupQuizNavigation();
        this.setupAnswerHandling();
        this.setupDevHelpers();
        console.log('✅ Quiz initialized successfully');
    }
    
    setupEmailForm() {
        const emailForm = document.getElementById('emailForm');
        const startBtn = document.getElementById('startQuizBtn');
        
        if (emailForm && startBtn) {
            emailForm.addEventListener('submit', (e) => this.handleEmailSubmit(e));
            
            // Real-time validation
            const inputs = emailForm.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.validateEmailForm());
            });
        }
    }
    
    validateEmailForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const startBtn = document.getElementById('startQuizBtn');
        
        const isValid = firstName && lastName && this.isValidEmail(email);
        startBtn.disabled = !isValid;
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async handleEmailSubmit(e) {
        e.preventDefault();
        
        if (!this.validateEmailForm()) {
            this.showError('emailError', 'Please fill in all required fields with valid information.');
            return;
        }
        
        // Store user information
        this.userInfo = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || ''
        };
        
        console.log('✅ User info captured:', this.userInfo);
        
        // Start the quiz
        this.startQuiz();
    }
    
    startQuiz() {
        console.log('🚀 Starting quiz...');
        this.startTime = Date.now();
        
        // Hide email capture, show quiz
        document.getElementById('emailCapture').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('quizContainer').classList.add('fade-in');
        
        // Initialize first question
        this.currentQuestion = 0;
        this.loadQuestion();
        this.updateProgress();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    setupQuizNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
    }
    
    setupAnswerHandling() {
        // Event delegation for answer options
        document.addEventListener('click', (e) => {
            if (e.target.closest('.answer-option')) {
                this.selectAnswer(e.target.closest('.answer-option'));
            }
        });
    }
    
    loadQuestion() {
        const question = quizData.questions[this.currentQuestion];
        if (!question) {
            console.error('❌ Question not found:', this.currentQuestion);
            return;
        }
        
        console.log(`📝 Loading question ${this.currentQuestion + 1}:`, question.question);
        
        // Update question content
        document.getElementById('questionSection').textContent = question.sectionDisplay;
        document.getElementById('questionTitle').textContent = question.question;
        
        // Generate answer options
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const option = this.createAnswerOption(answer, index, question.id);
            optionsContainer.appendChild(option);
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Add animation
        optionsContainer.classList.add('slide-in');
    }
    
    createAnswerOption(answer, index, questionId) {
        const option = document.createElement('div');
        option.className = 'answer-option';
        option.setAttribute('data-question', questionId);
        option.setAttribute('data-value', answer.value);
        option.setAttribute('tabindex', '0');
        
        // Check if this answer was previously selected
        if (this.answers[questionId] === answer.value) {
            option.classList.add('selected');
        }
        
        option.innerHTML = `
            <div class="answer-radio"></div>
            <div class="answer-text">${answer.text}</div>
        `;
        
        // Keyboard support
        option.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.selectAnswer(option);
            }
        });
        
        return option;
    }
    
    selectAnswer(optionElement) {
        const questionId = parseInt(optionElement.getAttribute('data-question'));
        const value = parseInt(optionElement.getAttribute('data-value'));
        
        console.log(`✅ Answer selected for question ${questionId}:`, value);
        
        // Remove previous selection
        const allOptions = document.querySelectorAll(`[data-question="${questionId}"]`);
        allOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selection to clicked option
        optionElement.classList.add('selected');
        
        // Store answer
        this.answers[questionId] = value;
        
        // Enable next button
        this.updateNavigationButtons();
        
        // Auto-advance after short delay (optional UX improvement)
        setTimeout(() => {
            if (this.currentQuestion < quizData.questions.length - 1) {
                // Don't auto-advance, let user click Next for control
                // this.nextQuestion();
            }
        }, 500);
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentQ = quizData.questions[this.currentQuestion];
        
        // Previous button
        if (prevBtn) {
            prevBtn.style.display = this.currentQuestion > 0 ? 'block' : 'none';
        }
        
        // Next button
        if (nextBtn && currentQ) {
            const hasAnswer = this.answers[currentQ.id] !== undefined;
            nextBtn.disabled = !hasAnswer;
            
            // Update button text for last question
            if (this.currentQuestion === quizData.questions.length - 1) {
                nextBtn.textContent = hasAnswer ? 'Get My Results' : 'Complete Quiz';
                nextBtn.classList.add('btn-primary');
            } else {
                nextBtn.textContent = 'Next Question';
            }
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / quizData.questions.length) * 100;
        const progressFill = document.getElementById('progressFill');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const progressPercent = document.getElementById('progressPercent');
        const totalQuestions = document.getElementById('totalQuestions');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (currentQuestionSpan) currentQuestionSpan.textContent = this.currentQuestion + 1;
        if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
        if (totalQuestions) totalQuestions.textContent = quizData.questions.length;
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
            this.updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    nextQuestion() {
        const currentQ = quizData.questions[this.currentQuestion];
        
        // Validate answer exists
        if (!this.answers[currentQ.id]) {
            this.showError('statusMessage', 'Please select an answer before continuing.');
            return;
        }
        
        if (this.currentQuestion < quizData.questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
            this.updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Quiz complete
            this.completeQuiz();
        }
    }
    
    async completeQuiz() {
        if (this.isSubmitting) return;
        
        console.log('🏁 Quiz completed! Processing results...');
        this.isSubmitting = true;
        
        try {
            // Calculate results
            const results = this.calculateResults();
            console.log('📊 Results calculated:', results);
            
            // Submit to backend
            await this.submitResults(results);
            
            // Show results
            this.displayResults(results);
            
        } catch (error) {
            console.error('❌ Error completing quiz:', error);
            this.showError('statusMessage', 'There was an error processing your results. Please try again.');
        } finally {
            this.isSubmitting = false;
        }
    }
    
    calculateResults() {
        console.log('🧮 Calculating results...');
        
        // Calculate total score
        let totalScore = 0;
        Object.values(this.answers).forEach(score => {
            totalScore += score;
        });
        
        // Calculate section scores
        const sectionScores = getSectionBreakdown(this.answers);
        
        // Determine persona
        const persona = determinePersona(totalScore);
        
        // Calculate time taken
        const timeTaken = this.startTime ? Math.round((Date.now() - this.startTime) / 1000) : 0;
        
        const results = {
            totalScore,
            sectionScores,
            persona,
            timeTaken,
            completionDate: new Date().toISOString(),
            answers: this.answers
        };
        
        console.log('📈 Final results:', results);
        return results;
    }
    
    async submitResults(results) {
        console.log('📤 Submitting results to backend...');
        
        const payload = {
            contact: {
                firstName: this.userInfo.firstName,
                lastName: this.userInfo.lastName,
                email: this.userInfo.email,
                phone: this.userInfo.phone,
                tags: results.persona.tags,
                customFields: {
                    quiz_score: results.totalScore,
                    result_type: results.persona.type,
                    section_scores: results.sectionScores,
                    completion_date: results.completionDate,
                    referrer_source: 'quiz',
                    time_taken_seconds: results.timeTaken,
                    personalized_message: results.persona.personalizedMessage
                }
            },
            metadata: {
                quiz_version: '1.0',
                timestamp: Date.now(),
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };
        
        try {
            // Try the backend API first
            const response = await this.submitToBackend(payload);
            console.log('✅ Successfully submitted to backend:', response);
            
        } catch (error) {
            console.warn('⚠️ Backend submission failed, storing locally:', error);
            this.storeResultsLocally(payload);
        }
    }
    
    async submitToBackend(payload) {
        const apiEndpoint = 'http://localhost:3000/api/submit-quiz';
        
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    storeResultsLocally(payload) {
        // Store in localStorage as backup
        const storageKey = `pure_life_quiz_${Date.now()}`;
        localStorage.setItem(storageKey, JSON.stringify(payload));
        console.log('💾 Results stored locally:', storageKey);
    }
    
    displayResults(results) {
        console.log('🎉 Displaying results...');
        
        // Hide quiz, show results
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('resultsContainer').style.display = 'block';
        document.getElementById('resultsContainer').classList.add('fade-in');
        
        // Populate results
        this.populateResultsDisplay(results);
        
        // Setup social sharing
        this.setupSocialSharing(results);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    populateResultsDisplay(results) {
        // Total score
        document.getElementById('totalScore').textContent = results.totalScore;
        
        // Persona result
        const personaContainer = document.getElementById('personaResult');
        personaContainer.innerHTML = `
            <h3 class="persona-title">${results.persona.title}</h3>
            <p class="persona-description">${results.persona.description}</p>
            <div style="margin-top: 20px;">
                <h4 style="color: var(--primary-gold); margin-bottom: 15px;">Your Key Strengths:</h4>
                <ul style="color: var(--secondary-text); padding-left: 20px;">
                    ${results.persona.strengths.map(strength => `<li style="margin-bottom: 8px;">${strength}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-top: 20px;">
                <h4 style="color: var(--primary-gold); margin-bottom: 15px;">Growth Areas:</h4>
                <ul style="color: var(--secondary-text); padding-left: 20px;">
                    ${results.persona.growthAreas.map(area => `<li style="margin-bottom: 8px;">${area}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Section scores
        const sectionsContainer = document.getElementById('sectionScores');
        sectionsContainer.innerHTML = '';
        
        Object.entries(results.sectionScores).forEach(([section, score]) => {
            const sectionElement = document.createElement('div');
            sectionElement.className = 'section-score';
            sectionElement.innerHTML = `
                <div class="section-score-number">${score}/15</div>
                <div class="section-score-label">${sectionNames[section]}</div>
            `;
            sectionsContainer.appendChild(sectionElement);
        });
        
        // CTA section
        const ctaContainer = document.getElementById('ctaSection');
        ctaContainer.innerHTML = `
            <h3 class="cta-title">${results.persona.primaryCTA.text}</h3>
            <p class="cta-description">${results.persona.primaryCTA.description}</p>
            <a href="${results.persona.primaryCTA.url}" class="btn btn-cta" target="_blank">
                Get Started Now
            </a>
        `;
    }
    
    setupSocialSharing(results) {
        const shareText = `I just took the Pure Life Compass Quiz and discovered I'm a ${results.persona.title}! Take the quiz to discover your path to transformation.`;
        const shareUrl = window.location.href;
        
        // Facebook share
        const facebookBtn = document.getElementById('facebookShare');
        if (facebookBtn) {
            facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        }
        
        // Twitter share
        const twitterBtn = document.getElementById('twitterShare');
        if (twitterBtn) {
            twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        }
        
        // LinkedIn share
        const linkedinBtn = document.getElementById('linkedinShare');
        if (linkedinBtn) {
            linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        }
    }
    
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.classList.add('error-message');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
        console.error('❌ Error:', message);
    }
    
    showSuccess(elementId, message) {
        const successElement = document.getElementById(elementId);
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
            successElement.classList.add('success-message');
            
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 3000);
        }
        console.log('✅ Success:', message);
    }
    
    // Development helpers
    setupDevHelpers() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.devHelpers = {
                // Simulate completing quiz with specific score
                simulateQuiz: (targetScore) => {
                    console.log(`🧪 DEV: Simulating quiz with score ${targetScore}`);
                    
                    // Fill in dummy user info
                    this.userInfo = {
                        firstName: 'Test',
                        lastName: 'User',
                        email: 'test@example.com',
                        phone: '+1234567890'
                    };
                    
                    // Distribute score across questions
                    const averagePerQuestion = targetScore / quizData.questions.length;
                    quizData.questions.forEach(question => {
                        // Add some randomness while staying close to target
                        const variance = Math.random() * 2 - 1; // -1 to 1
                        let score = Math.round(averagePerQuestion + variance);
                        score = Math.max(1, Math.min(5, score)); // Clamp to 1-5
                        this.answers[question.id] = score;
                    });
                    
                    // Adjust final score to match target more closely
                    const currentTotal = Object.values(this.answers).reduce((sum, val) => sum + val, 0);
                    const diff = targetScore - currentTotal;
                    
                    if (Math.abs(diff) > 0) {
                        // Adjust the first few questions to hit target
                        const questions = quizData.questions.slice(0, Math.abs(diff));
                        questions.forEach((question, index) => {
                            if (index < Math.abs(diff)) {
                                if (diff > 0 && this.answers[question.id] < 5) {
                                    this.answers[question.id]++;
                                } else if (diff < 0 && this.answers[question.id] > 1) {
                                    this.answers[question.id]--;
                                }
                            }
                        });
                    }
                    
                    this.completeQuiz();
                },
                
                // Get current quiz state
                getQuizState: () => {
                    return {
                        currentQuestion: this.currentQuestion,
                        answers: this.answers,
                        userInfo: this.userInfo,
                        totalQuestions: quizData.questions.length
                    };
                },
                
                // Reset quiz
                resetQuiz: () => {
                    this.currentQuestion = 0;
                    this.answers = {};
                    this.userInfo = {};
                    this.isSubmitting = false;
                    location.reload();
                }
            };
            
            console.log('🛠️ Dev helpers loaded. Use window.devHelpers in console.');
        }
    }
}

// Initialize quiz when script loads
const pureLifeQuiz = new PureLifeQuiz();