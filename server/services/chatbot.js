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

// Cached knowledge base - loaded once at startup
let cachedKnowledgeBase = null;
let lastCacheUpdate = null;

// Function to refresh cache (can be called via API endpoint)
export async function refreshKnowledgeBase() {
  console.log('🔄 Refreshing knowledge base cache...');
  return await loadKnowledgeBase();
}

// Export function to load knowledge base at startup
export async function loadKnowledgeBase() {
  try {
    console.log('🔄 Loading knowledge base from database...');
    
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

    const knowledgeBase = {
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

    // Cache the data
    cachedKnowledgeBase = knowledgeBase;
    lastCacheUpdate = new Date().toISOString();
    
    console.log(`✅ Knowledge base loaded successfully! Skills: ${Object.keys(skills).length} categories, Projects: ${projects.length}, Experiences: ${experiences.length}, Certifications: ${certifications.length}`);
    
    return knowledgeBase;

  } catch (error) {
    console.error('❌ Error loading knowledge base:', error);
    
    // Return fallback static data if database fetch fails
    const fallbackData = {
      personalInfo: STATIC_PERSONAL_INFO,
      skills: { error: "Impossible de récupérer les compétences" },
      experiences: [],
      projects: [],
      certifications: [],
      interests: ["Intelligence Artificielle", "Data Science", "Développement Web"]
    };
    
    cachedKnowledgeBase = fallbackData;
    lastCacheUpdate = new Date().toISOString();
    
    return fallbackData;
  }
}

// Function to get cached knowledge base
export function getKnowledgeBase() {
  if (!cachedKnowledgeBase) {
    console.warn('⚠️ Knowledge base not loaded! Using fallback data.');
    return {
      personalInfo: STATIC_PERSONAL_INFO,
      skills: { error: "Données non chargées" },
      experiences: [],
      projects: [],
      certifications: [],
      interests: ["Intelligence Artificielle", "Data Science", "Développement Web"]
    };
  }
  return cachedKnowledgeBase;
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

// Optimized system prompt for faster responses
const SYSTEM_PROMPT = `Tu es l'assistant de Samuel FOTSO, Data Scientist. Réponds en français, de manière concise et professionnelle.

INSTRUCTIONS:
- Réponses courtes et précises (max 150 mots)
- Utilise les données fournies
- Si info manquante: suggère le contact direct
- Reste professionnel et enthousiaste
- Adapte la réponse à la question posée`;

// Function to create optimized prompt for faster processing
function createOptimizedPrompt(userMessage, knowledgeBase) {
  // Create a condensed version of knowledge base for faster processing
  const condensedKnowledge = {
    contact: `${knowledgeBase.personalInfo.name} - ${knowledgeBase.personalInfo.title}
Email: ${knowledgeBase.personalInfo.email}
LinkedIn: ${knowledgeBase.personalInfo.linkedin}`,
    
    skills: Object.entries(knowledgeBase.skills).map(([category, skills]) => 
      `${category}: ${skills.map(s => `${s.name} (${s.level}%)`).join(', ')}`
    ).join('\n'),
    
    experiences: knowledgeBase.experiences.slice(0, 3).map(exp => 
      `${exp.title} chez ${exp.company} (${exp.period})`
    ).join(', '),
    
    projects: knowledgeBase.projects.slice(0, 3).map(proj => 
      `${proj.title} - ${proj.type}`
    ).join(', '),
    
    certifications: knowledgeBase.certifications.slice(0, 3).map(cert => 
      `${cert.name} (${cert.year})`
    ).join(', ')
  };

  return `PROFIL: ${condensedKnowledge.contact}

COMPÉTENCES:
${condensedKnowledge.skills}

EXPÉRIENCES: ${condensedKnowledge.experiences}

PROJETS: ${condensedKnowledge.projects}

CERTIFICATIONS: ${condensedKnowledge.certifications}

QUESTION: ${userMessage}`;
}

// Function to create a conversation context with cached data
export async function createConversationContext(userMessage, conversationHistory = []) {
  const knowledgeBase = getKnowledgeBase(); // Use cached data
  
  const context = {
    knowledge: knowledgeBase,
    conversation: conversationHistory,
    currentMessage: userMessage,
    timestamp: new Date().toISOString(),
    cacheInfo: {
      lastUpdate: lastCacheUpdate,
      isCached: !!cachedKnowledgeBase
    }
  };
  
  return context;
}

// Optimized function to generate chatbot response with cached data
export async function generateChatbotResponse(userMessage, conversationHistory = []) {
  try {
    // Use cached data instead of fetching from database
    const knowledgeBase = getKnowledgeBase();
    
    // Create optimized prompt for faster processing
    const optimizedPrompt = createOptimizedPrompt(userMessage, knowledgeBase);
    
    // Build minimal message array for faster processing
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: optimizedPrompt }
    ];
    
    // Add only the last 2 conversation messages to maintain context but reduce tokens
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-2);
      recentHistory.forEach(msg => {
        messages.splice(-1, 0, { role: msg.role, content: msg.content });
      });
    }
    
    const startTime = Date.now();
    
    // Optimized OpenAI call for faster response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 300, // Reduced for faster response
      temperature: 0.5, // Lower for more consistent responses
      presence_penalty: 0,
      frequency_penalty: 0
    });
    
    const responseTime = Date.now() - startTime;
    const response = completion.choices[0].message.content;
    
    return {
      success: true,
      response: response,
      responseTime: responseTime,
      context: {
        knowledge: { summary: "Cached data used" },
        conversation: conversationHistory.slice(-2), // Only include recent history
        currentMessage: userMessage,
        timestamp: new Date().toISOString(),
        cacheInfo: {
          lastUpdate: lastCacheUpdate,
          dataSource: "cache"
        }
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
  loadKnowledgeBase,
  refreshKnowledgeBase,
  getKnowledgeBase
};