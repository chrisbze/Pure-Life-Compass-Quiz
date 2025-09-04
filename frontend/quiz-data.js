// Pure Life Compass Quiz Data - All 15 Questions Across 5 Sections
// Brand-accurate implementation with Always Works™ testing

const quizData = {
    questions: [
        // VISION Section (Questions 1-3)
        {
            id: 1,
            section: "vision",
            sectionDisplay: "Vision & Purpose",
            question: "How clear are you about your life's ultimate purpose and the legacy you want to leave?",
            answers: [
                { text: "I have a crystal-clear vision that guides all my decisions", value: 5 },
                { text: "I have a general sense of direction but need more clarity", value: 4 },
                { text: "I have some ideas but they're not well-defined", value: 3 },
                { text: "I have vague notions but struggle with specificity", value: 2 },
                { text: "I'm completely unsure about my life's purpose", value: 1 }
            ]
        },
        {
            id: 2,
            section: "vision",
            sectionDisplay: "Vision & Purpose",
            question: "When you imagine your ideal life 5 years from now, how vivid and detailed is that vision?",
            answers: [
                { text: "Extremely vivid - I can see, feel, and describe it in detail", value: 5 },
                { text: "Pretty clear with most important elements defined", value: 4 },
                { text: "Somewhat clear but missing key details", value: 3 },
                { text: "Vague with only general concepts", value: 2 },
                { text: "Completely unclear or non-existent", value: 1 }
            ]
        },
        {
            id: 3,
            section: "vision",
            sectionDisplay: "Vision & Purpose",
            question: "How often do you review and refine your long-term goals to ensure they align with your deepest values?",
            answers: [
                { text: "Weekly or monthly - it's a consistent practice", value: 5 },
                { text: "Quarterly - I make it a seasonal priority", value: 4 },
                { text: "A few times per year when I remember", value: 3 },
                { text: "Rarely - maybe once a year or less", value: 2 },
                { text: "Never - I don't have this practice", value: 1 }
            ]
        },

        // ACTION Section (Questions 4-6)
        {
            id: 4,
            section: "action",
            sectionDisplay: "Action & Execution",
            question: "When you commit to a goal, how consistent are you with taking daily action toward achieving it?",
            answers: [
                { text: "Extremely consistent - I take action every single day", value: 5 },
                { text: "Very consistent - I rarely miss more than a day", value: 4 },
                { text: "Moderately consistent - I act most days", value: 3 },
                { text: "Inconsistent - I act sporadically", value: 2 },
                { text: "Very inconsistent - I struggle to maintain momentum", value: 1 }
            ]
        },
        {
            id: 5,
            section: "action",
            sectionDisplay: "Action & Execution",
            question: "How quickly do you move from idea to implementation when you identify something important?",
            answers: [
                { text: "Immediately - I start taking action within hours", value: 5 },
                { text: "Very quickly - within a day or two", value: 4 },
                { text: "Reasonably fast - within a week", value: 3 },
                { text: "Slowly - it takes weeks to start", value: 2 },
                { text: "Very slowly or never - I often don't follow through", value: 1 }
            ]
        },
        {
            id: 6,
            section: "action",
            sectionDisplay: "Action & Execution",
            question: "How effectively do you break down large goals into smaller, manageable daily actions?",
            answers: [
                { text: "Expertly - I have a systematic approach that works", value: 5 },
                { text: "Well - I'm good at creating actionable steps", value: 4 },
                { text: "Adequately - I can do it but need to improve", value: 3 },
                { text: "Poorly - I struggle with breaking things down", value: 2 },
                { text: "Not at all - I'm overwhelmed by large goals", value: 1 }
            ]
        },

        // RESILIENCE Section (Questions 7-9)
        {
            id: 7,
            section: "resilience",
            sectionDisplay: "Resilience & Growth",
            question: "When you face a significant setback or failure, how do you typically respond?",
            answers: [
                { text: "I quickly learn from it and get back to pursuing my goals", value: 5 },
                { text: "I take some time to process, then come back stronger", value: 4 },
                { text: "I eventually recover but it takes some effort", value: 3 },
                { text: "I struggle for a while but eventually move forward", value: 2 },
                { text: "I get stuck and have trouble recovering", value: 1 }
            ]
        },
        {
            id: 8,
            section: "resilience",
            sectionDisplay: "Resilience & Growth",
            question: "How do you view challenges and obstacles in your path to achieving your goals?",
            answers: [
                { text: "As opportunities to grow and proof of my progress", value: 5 },
                { text: "As normal parts of the journey that I can handle", value: 4 },
                { text: "As manageable difficulties that I work through", value: 3 },
                { text: "As frustrating barriers that slow me down", value: 2 },
                { text: "As signs that maybe I should give up or change direction", value: 1 }
            ]
        },
        {
            id: 9,
            section: "resilience",
            sectionDisplay: "Resilience & Growth",
            question: "How well do you maintain your motivation and energy during difficult or stressful periods?",
            answers: [
                { text: "Exceptionally well - I actually thrive under pressure", value: 5 },
                { text: "Well - I stay motivated with some extra effort", value: 4 },
                { text: "Adequately - I manage but it's challenging", value: 3 },
                { text: "Poorly - I lose steam when things get tough", value: 2 },
                { text: "Very poorly - stress completely derails me", value: 1 }
            ]
        },

        // ALIGNMENT Section (Questions 10-12)
        {
            id: 10,
            section: "alignment",
            sectionDisplay: "Alignment & Balance",
            question: "How well do your daily actions and decisions align with your core values and long-term vision?",
            answers: [
                { text: "Perfectly - every decision reflects my values and vision", value: 5 },
                { text: "Very well - most of my actions are aligned", value: 4 },
                { text: "Fairly well - I'm aligned more often than not", value: 3 },
                { text: "Inconsistently - sometimes aligned, sometimes not", value: 2 },
                { text: "Poorly - I often act against my values and vision", value: 1 }
            ]
        },
        {
            id: 11,
            section: "alignment",
            sectionDisplay: "Alignment & Balance",
            question: "How effectively do you balance pursuing ambitious goals with taking care of your physical and mental well-being?",
            answers: [
                { text: "Masterfully - I optimize both performance and well-being", value: 5 },
                { text: "Well - I maintain good balance most of the time", value: 4 },
                { text: "Adequately - I manage both but could improve", value: 3 },
                { text: "Poorly - one often suffers for the other", value: 2 },
                { text: "Terribly - I sacrifice well-being or neglect goals", value: 1 }
            ]
        },
        {
            id: 12,
            section: "alignment",
            sectionDisplay: "Alignment & Balance",
            question: "How satisfied are you with the integration of different life areas (career, relationships, health, personal growth)?",
            answers: [
                { text: "Extremely satisfied - everything flows together beautifully", value: 5 },
                { text: "Very satisfied - most areas support each other", value: 4 },
                { text: "Moderately satisfied - some areas work well together", value: 3 },
                { text: "Somewhat unsatisfied - areas often conflict", value: 2 },
                { text: "Very unsatisfied - different areas are completely disconnected", value: 1 }
            ]
        },

        // COMMUNITY Section (Questions 13-15)
        {
            id: 13,
            section: "community",
            sectionDisplay: "Community & Support",
            question: "How strong is your network of people who truly support your growth and hold you accountable to your highest potential?",
            answers: [
                { text: "Extremely strong - I have multiple mentors and growth partners", value: 5 },
                { text: "Strong - I have several key people who support my growth", value: 4 },
                { text: "Moderate - I have some supportive relationships", value: 3 },
                { text: "Weak - I have few people who truly support my growth", value: 2 },
                { text: "Very weak or non-existent - I'm mostly on my own", value: 1 }
            ]
        },
        {
            id: 14,
            section: "community",
            sectionDisplay: "Community & Support",
            question: "How actively do you seek out and contribute to communities of like-minded individuals pursuing similar growth?",
            answers: [
                { text: "Very actively - I regularly engage and contribute to multiple communities", value: 5 },
                { text: "Actively - I participate in communities and add value", value: 4 },
                { text: "Moderately - I participate but could contribute more", value: 3 },
                { text: "Passively - I consume more than I contribute", value: 2 },
                { text: "Not at all - I avoid or don't seek out such communities", value: 1 }
            ]
        },
        {
            id: 15,
            section: "community",
            sectionDisplay: "Community & Support",
            question: "How comfortable are you with asking for help, feedback, or guidance when you need it?",
            answers: [
                { text: "Extremely comfortable - I actively seek help and feedback", value: 5 },
                { text: "Comfortable - I ask for help when I recognize the need", value: 4 },
                { text: "Moderately comfortable - I ask sometimes but hesitate", value: 3 },
                { text: "Uncomfortable - I struggle to ask even when I need help", value: 2 },
                { text: "Very uncomfortable - I almost never ask for help", value: 1 }
            ]
        }
    ]
};

// Persona Result Configurations
const resultConfigs = {
    dreamer: {
        range: [0, 25],
        type: "DREAMER",
        title: "The Visionary Dreamer",
        tags: ["Dreamer", "Challenge-Ready", "Needs-Structure", "Vision-Focused"],
        description: "You have incredible vision and big dreams, but you need more structure and consistent action to bring those dreams to life. Your imagination is your superpower - now it's time to build the bridge between vision and reality.",
        strengths: [
            "Powerful imagination and visionary thinking",
            "Natural ability to see possibilities others miss",
            "Strong intuition about what could be possible",
            "Inspiring and motivating to others"
        ],
        growthAreas: [
            "Converting ideas into consistent daily actions",
            "Building sustainable systems and structures",
            "Maintaining momentum through challenges",
            "Breaking big visions into manageable steps"
        ],
        nextSteps: [
            "Start with ONE specific goal and create a daily action plan",
            "Find an accountability partner or coach",
            "Learn proven frameworks for turning vision into reality",
            "Focus on building consistent habits before taking on too much"
        ],
        primaryCTA: {
            text: "Join the 30-Day Pure Life Challenge",
            url: "https://purelifewarrior.com/challenge",
            description: "Perfect for Dreamers who need structure and daily accountability to turn their vision into reality."
        },
        secondaryCTA: {
            text: "Explore Our Vision-to-Reality Framework",
            url: "https://purelifewarrior.com/framework",
            description: "Get the exact system for converting big dreams into achievable daily actions."
        },
        personalizedMessage: "Your vision is your gift to the world - but the world needs you to take action on it. The gap between where you are and where you want to be can be bridged with the right structure and support."
    },
    
    builder: {
        range: [26, 50],
        type: "BUILDER",
        title: "The Determined Builder",
        tags: ["Builder", "Challenge-Ready", "Elite-Prospect", "Growth-Minded"],
        description: "You have a solid foundation and are making consistent progress, but you're ready to accelerate your growth and build something truly significant. You understand the value of both vision and action.",
        strengths: [
            "Good balance of vision and practical action",
            "Consistent effort toward your goals",
            "Ability to learn and adapt",
            "Building positive momentum in key areas"
        ],
        growthAreas: [
            "Accelerating your rate of progress",
            "Developing more sophisticated strategies",
            "Building stronger support systems",
            "Optimizing your approach for better results"
        ],
        nextSteps: [
            "Identify your highest-leverage activities",
            "Invest in advanced training and mentorship",
            "Connect with other high-achievers",
            "Systematize what's working to scale your impact"
        ],
        primaryCTA: {
            text: "Join the Pure Life Challenge + Elite Preview",
            url: "https://purelifewarrior.com/challenge-elite",
            description: "Perfect for Builders ready to accelerate their progress with advanced strategies and elite-level community."
        },
        secondaryCTA: {
            text: "Discover Elite Membership Benefits",
            url: "https://purelifewarrior.com/elite-preview",
            description: "See how our Elite community can help you build faster and more effectively."
        },
        personalizedMessage: "You're already building - now it's time to build smarter and faster. The right community and advanced strategies will help you achieve in months what might otherwise take years."
    },
    
    driver: {
        range: [51, 65],
        type: "DRIVER",
        title: "The High-Performance Driver",
        tags: ["Driver", "Challenge-Ready", "Elite-Ready", "High-Achiever"],
        description: "You're operating at a high level and consistently achieving your goals. You're ready for elite-level challenges and community. Your focus should be on optimization, leverage, and creating even greater impact.",
        strengths: [
            "Strong execution and consistent results",
            "Good systems and processes",
            "Resilience through challenges",
            "Clear vision with aligned action"
        ],
        growthAreas: [
            "Optimizing for maximum leverage and impact",
            "Building and leading others",
            "Scaling your systems and influence",
            "Maintaining peak performance sustainably"
        ],
        nextSteps: [
            "Focus on high-leverage activities only",
            "Build or join an elite peer community",
            "Develop leadership and mentoring skills",
            "Create systems that work without your constant input"
        ],
        primaryCTA: {
            text: "Apply for Elite Membership",
            url: "https://purelifewarrior.com/elite-application",
            description: "Exclusive community for high-performers ready to optimize their impact and scale their influence."
        },
        secondaryCTA: {
            text: "Explore Advanced Performance Training",
            url: "https://purelifewarrior.com/advanced-training",
            description: "Take your already-strong performance to the next level with advanced strategies."
        },
        personalizedMessage: "You're already achieving at a high level - now it's time to focus on leverage and impact. The right elite community will help you scale your influence and create lasting change."
    },
    
    leader: {
        range: [66, 75],
        type: "LEADER",
        title: "The Transformational Leader",
        tags: ["Leader", "Challenge-Ready", "Elite-Ready", "Retreat-Prospect", "Transformational"],
        description: "You're operating at an elite level with strong vision, consistent action, resilience, and community. You're ready to lead others and create transformational impact. Your focus should be on legacy and leading by example.",
        strengths: [
            "Exceptional integration across all life areas",
            "Strong leadership capabilities",
            "Consistent high performance",
            "Clear vision with masterful execution"
        ],
        growthAreas: [
            "Expanding your sphere of influence",
            "Creating transformational experiences for others",
            "Building lasting legacy systems",
            "Mastering the art of sustainable peak performance"
        ],
        nextSteps: [
            "Focus on creating transformation in others",
            "Build platforms for sharing your wisdom",
            "Invest in exclusive high-level experiences",
            "Create systems that perpetuate your impact"
        ],
        primaryCTA: {
            text: "Explore Tulum Leadership Retreat",
            url: "https://purelifewarrior.com/tulum-retreat",
            description: "Exclusive retreat for transformational leaders ready to create their ultimate legacy."
        },
        secondaryCTA: {
            text: "Join Elite + Retreat Track",
            url: "https://purelifewarrior.com/elite-retreat",
            description: "The highest level of community and transformation for proven leaders."
        },
        personalizedMessage: "You've achieved what most people only dream of. Now your opportunity is to create transformation for others while continuing to grow your own impact and legacy. The world needs your leadership."
    }
};

// Section Display Names
const sectionNames = {
    vision: "Vision & Purpose",
    action: "Action & Execution",
    resilience: "Resilience & Growth",
    alignment: "Alignment & Balance",
    community: "Community & Support"
};

// Function to determine persona based on score
function determinePersona(totalScore) {
    if (totalScore <= 25) return resultConfigs.dreamer;
    if (totalScore <= 50) return resultConfigs.builder;
    if (totalScore <= 65) return resultConfigs.driver;
    return resultConfigs.leader;
}

// Function to get section score breakdown
function getSectionBreakdown(answers) {
    const sections = {
        vision: 0,
        action: 0,
        resilience: 0,
        alignment: 0,
        community: 0
    };
    
    quizData.questions.forEach(question => {
        const answer = answers[question.id];
        if (answer) {
            sections[question.section] += answer;
        }
    });
    
    return sections;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        quizData,
        resultConfigs,
        sectionNames,
        determinePersona,
        getSectionBreakdown
    };
}