import OpenAI from 'openai';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Static personal info (update as needed)
const STATIC_PERSONAL_INFO = {
  name: "Samuel FOTSO",
  title: "Data Scientist, à la recherche d'une alternance",
  email: "temmodaryl317@gmail.com",
  location: "France",
  languages: ["Français", "Anglais", "Allemand"],
  phone: "+33 X XX XX XX XX",
  linkedin: "https://www.linkedin.com/in/samuel-fotso-6b9879253/",
  github: "https://github.com/samitochi04"
};

// Function to fetch real-time data from database
async function fetchKnowledgeBase() {
  try {
    // Fetch all data in parallel
    const [skillsResult, experiencesResult, projectsResult, certificationsResult] = await Promise.all([
      supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true }),
      supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false }),
      supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true }),
      supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false })
    ]);

    // Process skills by category
    const skills = {};
    if (skillsResult.data) {
      skillsResult.data.forEach(skill => {
        if (!skills[skill.category]) {
          skills[skill.category] = [];
        }
        skills[skill.category].push({
          name: skill.name,
          level: skill.level,
          experience: `${skill.years_experience} an${skill.years_experience > 1 ? 's' : ''}`,
          description: skill.description || `Expertise en ${skill.name}`
        });
      });
    }

    // Process experiences
    const experiences = experiencesResult.data?.map(exp => ({
      title: exp.title,
      company: exp.company,
      type: exp.type,
      period: formatDatePeriod(exp.start_date, exp.end_date, exp.is_current),
      description: exp.description,
      achievements: exp.achievements || [],
      technologies: exp.technologies || [],
      location: exp.location
    })) || [];

    // Process projects
    const projects = projectsResult.data?.map(project => ({
      title: project.title,
      type: project.type,
      description: project.description,
      technologies: project.technologies || [],
      status: project.status,
      live_url: project.live_url,
      github_url: project.github_url,
      features: project.features || []
    })) || [];

    // Process certifications
    const certifications = certificationsResult.data?.map(cert => ({
      name: cert.name,
      organization: cert.issuing_organization,
      year: cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : 'N/A',
      skills: cert.skills || [],
      credential_url: cert.credential_url,
      description: cert.description
    })) || [];

    return {
      personalInfo: STATIC_PERSONAL_INFO,
      skills,
      experiences,
      projects,
      certifications,
      interests: [
        "Intelligence Artificielle",
        "Data Science", 
        "Développement Web",
        "Cloud Computing",
        "Automatisation",
        "Veille technologique"
      ]
    };

  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    // Return fallback static data if database fetch fails
    return {
      personalInfo: STATIC_PERSONAL_INFO,
      skills: { error: "Impossible de récupérer les compétences" },
      experiences: [],
      projects: [],
      certifications: [],
      interests: ["Intelligence Artificielle", "Data Science", "Développement Web"]
    };
  }
}

// Helper function to format date periods
function formatDatePeriod(startDate, endDate, isCurrent) {
  const start = new Date(startDate).getFullYear();
  if (isCurrent) {
    return `${start} - Présent`;
  } else if (endDate) {
    const end = new Date(endDate).getFullYear();
    return start === end ? start.toString() : `${start}-${end}`;
  }
  return start.toString();
}

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

// Function to create a conversation context with dynamic data
export async function createConversationContext(userMessage, conversationHistory = []) {
  const knowledgeBase = await fetchKnowledgeBase();
  
  const context = {
    knowledge: knowledgeBase,
    conversation: conversationHistory,
    currentMessage: userMessage,
    timestamp: new Date().toISOString()
  };
  
  return context;
}

// Function to generate chatbot response with dynamic data
export async function generateChatbotResponse(userMessage, conversationHistory = []) {
  try {
    // Fetch fresh data from database
    const knowledgeBase = await fetchKnowledgeBase();
    
    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Base de connaissances (données en temps réel): ${JSON.stringify(knowledgeBase, null, 2)}` }
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
      context: {
        knowledge: knowledgeBase,
        conversation: conversationHistory,
        currentMessage: userMessage,
        timestamp: new Date().toISOString()
      },
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
  fetchKnowledgeBase
};