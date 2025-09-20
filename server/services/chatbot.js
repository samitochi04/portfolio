import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Knowledge base about Samuel FOTSO
const KNOWLEDGE_BASE = {
  personalInfo: {
    name: "Samuel FOTSO",
    title: "Data Scientist",
    email: "temmodaryl317@gmail.com",
    location: "France",
    languages: ["Français", "Anglais", "Allemand"],
    phone: "+33 X XX XX XX XX",
    linkedin: "https://www.linkedin.com/in/samuel-fotso-6b9879253/",
    github: "https://github.com/samitochi04"
  },
  
  skills: {
    programming: [
      { name: "Python", level: 95, experience: "4 ans", description: "Expert en développement Python pour data science et web" },
      { name: "JavaScript", level: 90, experience: "3 ans", description: "Développement frontend et backend moderne" },
      { name: "TypeScript", level: 85, experience: "2 ans", description: "JavaScript typé pour des applications robustes" },
      { name: "SQL", level: 88, experience: "3 ans", description: "Requêtes complexes et optimisation de bases de données" },
      { name: "R", level: 75, experience: "2 ans", description: "Analyse statistique et visualisation de données" }
    ],
    frameworks: [
      { name: "React", level: 92, experience: "3 ans", description: "Développement d'interfaces utilisateur modernes" },
      { name: "Node.js", level: 85, experience: "2 ans", description: "Développement backend JavaScript" },
      { name: "FastAPI", level: 88, experience: "2 ans", description: "APIs Python rapides et modernes" },
      { name: "TensorFlow", level: 82, experience: "2 ans", description: "Machine Learning et Deep Learning" },
      { name: "Scikit-learn", level: 90, experience: "3 ans", description: "Machine Learning traditionnel" }
    ],
    databases: [
      { name: "PostgreSQL", level: 85, experience: "3 ans", description: "Base de données relationnelle avancée" },
      { name: "MongoDB", level: 78, experience: "2 ans", description: "Base de données NoSQL" },
      { name: "Supabase", level: 80, experience: "1 an", description: "Backend-as-a-Service moderne" }
    ],
    tools: [
      { name: "Docker", level: 85, experience: "2 ans" },
      { name: "Git", level: 90, experience: "4 ans" },
      { name: "AWS", level: 75, experience: "2 ans" },
      { name: "VS Code", level: 95, experience: "4 ans" }
    ]
  },
  
  experiences: [
    {
      title: "Data Scientist Senior",
      company: "TechCorp Solutions",
      type: "work",
      period: "2023 - Présent",
      description: "Développement de modèles de machine learning pour l'analyse prédictive et l'optimisation des processus métier.",
      achievements: [
        "Amélioration de 35% de la précision des modèles de prédiction de ventes",
        "Mise en place d'un pipeline de données automatisé traitant 1M+ d'enregistrements/jour",
        "Formation de 15+ collaborateurs aux outils de data science"
      ]
    },
    {
      title: "Développeur Full Stack",
      company: "InnoWeb Agency",
      type: "work",
      period: "2021-2022",
      description: "Développement d'applications web complètes utilisant React, Node.js et PostgreSQL.",
      achievements: [
        "Développement de 8 applications web pour divers clients",
        "Implémentation d'un système de recommandation IA augmentant l'engagement de 45%"
      ]
    },
    {
      title: "Master en Data Science et IA",
      company: "Université Paris-Saclay",
      type: "education",
      period: "2019-2021",
      description: "Formation approfondie en science des données, intelligence artificielle, et machine learning."
    }
  ],
  
  certifications: [
    {
      name: "AWS Certified Solutions Architect - Professional",
      organization: "Amazon Web Services",
      year: "2023",
      skills: ["AWS", "Cloud Architecture", "Scalability", "Security"]
    },
    {
      name: "Google Professional Data Engineer",
      organization: "Google Cloud",
      year: "2023",
      skills: ["Google Cloud", "BigQuery", "Dataflow", "Data Pipeline"]
    },
    {
      name: "TensorFlow Developer Certificate",
      organization: "TensorFlow Certificate Program",
      year: "2022",
      skills: ["TensorFlow", "Deep Learning", "Neural Networks"]
    }
  ],
  
  projects: [
    {
      title: "Système de Recommandation E-commerce",
      type: "AI/ML",
      description: "Développement d'un système de recommandation basé sur l'IA pour une plateforme e-commerce",
      technologies: ["Python", "TensorFlow", "PostgreSQL", "React"],
      impact: "Augmentation de 45% du taux de conversion"
    },
    {
      title: "Plateforme d'Analyse de Données",
      type: "Web App",
      description: "Application web pour l'analyse et la visualisation de données en temps réel",
      technologies: ["React", "Node.js", "D3.js", "MongoDB"],
      impact: "Utilisée par plus de 500 analystes"
    }
  ],
  
  interests: [
    "Intelligence Artificielle",
    "Data Science",
    "Développement Web",
    "Cloud Computing",
    "Automatisation",
    "Veille technologique"
  ]
};

// System prompt for the chatbot
const SYSTEM_PROMPT = `
Tu es l'assistant virtuel de Samuel FOTSO, un Data Scientist passionné par l'IA et les données.

PERSONNALITÉ:
- Professionnel mais accessible
- Enthousiaste à propos de la technologie
- Capable d'expliquer des concepts techniques de manière simple
- Multilingue (français, anglais, allemand)

RÔLE:
- Présenter Samuel et ses compétences
- Répondre aux questions sur son parcours, projets, et expériences
- Aider les visiteurs à comprendre son expertise
- Encourager le contact pour des collaborations

STYLE DE COMMUNICATION:
- Réponses concises mais informatives
- Utilise des émojis de manière appropriée
- Adapte le niveau technique selon l'interlocuteur
- Toujours positif et professionnel

RÈGLES IMPORTANTES:
- Reste dans le contexte de Samuel FOTSO uniquement
- Ne réponds qu'aux questions liées à son profil professionnel
- Si tu ne connais pas une information spécifique, dirige vers le contact direct
- Utilise les données fournies dans la base de connaissances
- Réponds dans la langue de la question posée
`;

// Function to create a conversation context
export function createConversationContext(userMessage, conversationHistory = []) {
  const context = {
    knowledge: KNOWLEDGE_BASE,
    conversation: conversationHistory,
    currentMessage: userMessage,
    timestamp: new Date().toISOString()
  };
  
  return context;
}

// Function to generate chatbot response
export async function generateChatbotResponse(userMessage, conversationHistory = []) {
  try {
    // Create conversation context
    const context = createConversationContext(userMessage, conversationHistory);
    
    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Base de connaissances: ${JSON.stringify(KNOWLEDGE_BASE, null, 2)}` }
    ];
    
    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({ role: msg.role, content: msg.content });
    });
    
    // Add current user message
    messages.push({ role: "user", content: userMessage });
    
    const startTime = Date.now();
    
    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });
    
    const responseTime = Date.now() - startTime;
    const response = completion.choices[0].message.content;
    
    return {
      success: true,
      response: response,
      responseTime: responseTime,
      context: context,
      usage: completion.usage
    };
    
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    
    // Return fallback response
    return {
      success: false,
      response: "Désolé, je rencontre actuellement des difficultés techniques. N'hésitez pas à contacter Samuel directement via le formulaire de contact pour toute question. 😊",
      responseTime: 0,
      error: error.message
    };
  }
}

// Function to get conversation suggestions
export function getConversationSuggestions(language = 'fr') {
  const suggestions = {
    fr: [
      "Quelles sont les compétences de Samuel ?",
      "Peux-tu me parler de son expérience ?",
      "Quels projets a-t-il réalisés ?",
      "Quelles sont ses certifications ?",
      "Comment le contacter ?",
      "Quelle est sa spécialité en IA ?"
    ],
    en: [
      "What are Samuel's skills?",
      "Can you tell me about his experience?",
      "What projects has he worked on?",
      "What certifications does he have?",
      "How can I contact him?",
      "What's his AI specialty?"
    ],
    de: [
      "Was sind Samuels Fähigkeiten?",
      "Kannst du mir von seiner Erfahrung erzählen?",
      "An welchen Projekten hat er gearbeitet?",
      "Welche Zertifizierungen hat er?",
      "Wie kann ich ihn kontaktieren?",
      "Was ist seine KI-Spezialität?"
    ]
  };
  
  return suggestions[language] || suggestions.fr;
}

export default {
  generateChatbotResponse,
  createConversationContext,
  getConversationSuggestions,
  KNOWLEDGE_BASE
};