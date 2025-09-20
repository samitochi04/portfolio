// =============================================
// SAMUEL FOTSO PORTFOLIO - DATA SEEDING SCRIPT
// =============================================
// This script populates the database with initial data
// Run this after setting up the database schema

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🔧 Environment check:');
console.log(`SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =============================================
// SAMPLE DATA
// =============================================

const skills = [
  // Programming Languages
  { name: 'Python', category: 'programming', level: 95, years_experience: 4, description: 'Expert en développement Python pour data science et web', is_featured: true, display_order: 1 },
  { name: 'JavaScript', category: 'programming', level: 90, years_experience: 3, description: 'Développement frontend et backend moderne', is_featured: true, display_order: 2 },
  { name: 'TypeScript', category: 'programming', level: 85, years_experience: 2, description: 'JavaScript typé pour des applications robustes', display_order: 3 },
  { name: 'SQL', category: 'programming', level: 88, years_experience: 3, description: 'Requêtes complexes et optimisation de bases de données', display_order: 4 },
  { name: 'R', category: 'programming', level: 75, years_experience: 2, description: 'Analyse statistique et visualisation de données', display_order: 5 },

  // Frameworks & Libraries
  { name: 'React', category: 'frameworks', level: 92, years_experience: 3, description: 'Développement d\'interfaces utilisateur modernes', is_featured: true, display_order: 6 },
  { name: 'Node.js', category: 'frameworks', level: 85, years_experience: 2, description: 'Développement backend JavaScript', is_featured: true, display_order: 7 },
  { name: 'FastAPI', category: 'frameworks', level: 88, years_experience: 2, description: 'APIs Python rapides et modernes', display_order: 8 },
  { name: 'TensorFlow', category: 'frameworks', level: 82, years_experience: 2, description: 'Machine Learning et Deep Learning', is_featured: true, display_order: 9 },
  { name: 'Scikit-learn', category: 'frameworks', level: 90, years_experience: 3, description: 'Machine Learning traditionnel', display_order: 10 },
  { name: 'Pandas', category: 'frameworks', level: 93, years_experience: 3, description: 'Manipulation et analyse de données', display_order: 11 },
  { name: 'NumPy', category: 'frameworks', level: 88, years_experience: 3, description: 'Calcul numérique et scientifique', display_order: 12 },

  // Databases
  { name: 'PostgreSQL', category: 'databases', level: 85, years_experience: 3, description: 'Base de données relationnelle avancée', is_featured: true, display_order: 13 },
  { name: 'MongoDB', category: 'databases', level: 78, years_experience: 2, description: 'Base de données NoSQL', display_order: 14 },
  { name: 'Redis', category: 'databases', level: 70, years_experience: 1, description: 'Cache et stockage en mémoire', display_order: 15 },
  { name: 'Supabase', category: 'databases', level: 80, years_experience: 1, description: 'Backend-as-a-Service moderne', display_order: 16 },

  // AI & Machine Learning
  { name: 'Machine Learning', category: 'ai_ml', level: 90, years_experience: 3, description: 'Algorithmes d\'apprentissage automatique', is_featured: true, display_order: 17 },
  { name: 'Deep Learning', category: 'ai_ml', level: 85, years_experience: 2, description: 'Réseaux de neurones profonds', is_featured: true, display_order: 18 },
  { name: 'Data Science', category: 'ai_ml', level: 92, years_experience: 4, description: 'Analyse et science des données', is_featured: true, display_order: 19 },
  { name: 'Computer Vision', category: 'ai_ml', level: 78, years_experience: 2, description: 'Vision par ordinateur et traitement d\'images', display_order: 20 },
  { name: 'NLP', category: 'ai_ml', level: 80, years_experience: 2, description: 'Traitement du langage naturel', display_order: 21 },

  // Tools
  { name: 'Git', category: 'tools', level: 90, years_experience: 4, description: 'Contrôle de version et collaboration', display_order: 22 },
  { name: 'Docker', category: 'tools', level: 82, years_experience: 2, description: 'Conteneurisation et déploiement', display_order: 23 },
  { name: 'AWS', category: 'tools', level: 75, years_experience: 1, description: 'Services cloud Amazon', display_order: 24 },
  { name: 'Jupyter', category: 'tools', level: 95, years_experience: 4, description: 'Notebooks pour data science', display_order: 25 },
  { name: 'VS Code', category: 'tools', level: 95, years_experience: 4, description: 'Environnement de développement', display_order: 26 },

  // Soft Skills
  { name: 'Résolution de problèmes', category: 'soft_skills', level: 92, years_experience: 4, description: 'Approche analytique et créative', display_order: 27 },
  { name: 'Communication', category: 'soft_skills', level: 88, years_experience: 4, description: 'Présentation de résultats techniques', display_order: 28 },
  { name: 'Travail en équipe', category: 'soft_skills', level: 90, years_experience: 4, description: 'Collaboration efficace en équipe', display_order: 29 },
  { name: 'Apprentissage continu', category: 'soft_skills', level: 95, years_experience: 4, description: 'Veille technologique permanente', display_order: 30 }
];

const experiences = [
  {
    title: 'Data Scientist Senior',
    company: 'TechCorp Solutions',
    type: 'work',
    start_date: '2023-01-15',
    end_date: null,
    is_current: true,
    description: 'Développement de modèles de machine learning pour l\'analyse prédictive et l\'optimisation des processus métier. Encadrement d\'une équipe de 3 data scientists juniors.',
    achievements: [
      'Amélioration de 35% de la précision des modèles de prédiction de ventes',
      'Mise en place d\'un pipeline de données automatisé traitant 1M+ d\'enregistrements/jour',
      'Réduction de 60% du temps de traitement des analyses grâce à l\'optimisation des algorithmes',
      'Formation de 15+ collaborateurs aux outils de data science'
    ],
    technologies: ['Python', 'TensorFlow', 'PostgreSQL', 'Docker', 'AWS', 'Jupyter'],
    location: 'Paris, France',
    display_order: 1
  },
  {
    title: 'Développeur Full Stack',
    company: 'InnoWeb Agency',
    type: 'work',
    start_date: '2021-06-01',
    end_date: '2022-12-31',
    description: 'Développement d\'applications web complètes utilisant React, Node.js et PostgreSQL. Création d\'APIs RESTful et intégration de solutions d\'IA.',
    achievements: [
      'Développement de 8 applications web pour divers clients',
      'Implémentation d\'un système de recommandation IA augmentant l\'engagement de 45%',
      'Optimisation des performances frontend réduisant le temps de chargement de 50%',
      'Mise en place de tests automatisés couvrant 90% du code'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'JavaScript', 'Docker'],
    location: 'Lyon, France',
    display_order: 2
  },
  {
    title: 'Master en Data Science et IA',
    company: 'Université Paris-Saclay',
    type: 'education',
    start_date: '2019-09-01',
    end_date: '2021-06-30',
    description: 'Formation approfondie en science des données, intelligence artificielle, et machine learning. Spécialisation en deep learning et traitement du langage naturel.',
    achievements: [
      'Diplômé avec mention Très Bien (17.5/20)',
      'Projet de fin d\'études sur la détection de fake news avec 94% de précision',
      'Publication d\'un article de recherche sur les réseaux de neurones convolutifs',
      'Stage de 6 mois chez Google Research'
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'R', 'SQL', 'Jupyter'],
    location: 'Paris, France',
    display_order: 3
  },
  {
    title: 'Licence en Informatique',
    company: 'Université de Technologie de Compiègne',
    type: 'education',
    start_date: '2016-09-01',
    end_date: '2019-06-30',
    description: 'Formation solide en informatique fondamentale, programmation, et mathématiques appliquées. Spécialisation en développement logiciel et bases de données.',
    achievements: [
      'Diplômé Major de promotion (18.2/20)',
      'Projet tutoré : Application mobile de gestion universitaire',
      'Président du club informatique de l\'université',
      'Organisateur de hackathons étudiants'
    ],
    technologies: ['Java', 'C++', 'Python', 'MySQL', 'Git'],
    location: 'Compiègne, France',
    display_order: 4
  }
];

const projects = [
  {
    title: 'Portfolio 3D Interactif',
    description: 'Portfolio personnel avec animations 3D, chatbot IA intégré, et système de gestion de contenu. Interface multilingue et design responsive moderne.',
    long_description: 'Ce portfolio représente le summum de mes compétences en développement frontend. Il intègre des animations 3D fluides avec Three.js, un chatbot intelligent, et un système complet de gestion de contenu avec Supabase. L\'interface est entièrement responsive et disponible en trois langues.',
    type: 'web_app',
    technologies: ['React', 'Three.js', 'Supabase', 'Tailwind CSS', 'Node.js'],
    features: [
      'Animations 3D interactives avec Three.js',
      'Chatbot IA intégré',
      'Interface multilingue (FR, EN, DE)',
      'Système d\'administration complet',
      'Design responsive et moderne',
      'Optimisations performances'
    ],
    live_url: 'https://samuel-fotso-portfolio.vercel.app',
    github_url: 'https://github.com/samitochi04/portfolio',
    status: 'completed',
    start_date: '2024-01-01',
    end_date: '2024-03-15',
    is_featured: true,
    display_order: 1
  },
  {
    title: 'Système de Détection de Fraude IA',
    description: 'Modèle de machine learning pour détecter les transactions frauduleuses en temps réel avec une précision de 97%. Traitement de millions de transactions par jour.',
    long_description: 'Solution complète de détection de fraude utilisant des algorithmes de machine learning avancés. Le système analyse en temps réel les patterns de transaction et identifie les anomalies avec une très haute précision, réduisant significativement les pertes financières.',
    type: 'ai_ml',
    technologies: ['Python', 'TensorFlow', 'PostgreSQL', 'FastAPI', 'Docker', 'AWS'],
    features: [
      'Détection en temps réel',
      'Précision de 97%',
      'Traitement de 1M+ transactions/jour',
      'Interface de monitoring',
      'API REST pour intégration',
      'Alertes automatiques'
    ],
    github_url: 'https://github.com/samitochi04/fraud-detection',
    status: 'completed',
    start_date: '2023-03-01',
    end_date: '2023-08-30',
    is_featured: true,
    display_order: 2
  },
  {
    title: 'Plateforme E-commerce Intelligente',
    description: 'Application e-commerce avec système de recommandation IA, gestion avancée du stock, et analytics en temps réel. Interface admin complète.',
    long_description: 'Plateforme e-commerce moderne intégrant un système de recommandation basé sur l\'IA, une gestion intelligente du stock, et des analytics avancés. L\'interface utilisateur est optimisée pour la conversion et l\'expérience client.',
    type: 'web_app',
    technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'Stripe', 'AWS'],
    features: [
      'Système de recommandation IA',
      'Gestion automatisée du stock',
      'Paiements sécurisés Stripe',
      'Analytics en temps réel',
      'Interface admin complète',
      'Notifications push'
    ],
    live_url: 'https://ecommerce-ai-demo.vercel.app',
    github_url: 'https://github.com/samitochi04/ecommerce-ai',
    status: 'completed',
    start_date: '2022-09-01',
    end_date: '2023-01-15',
    is_featured: true,
    display_order: 3
  },
  {
    title: 'Analyseur de Sentiment Social Media',
    description: 'Outil d\'analyse de sentiment sur les réseaux sociaux utilisant du NLP avancé. Traitement de millions de posts et génération de rapports détaillés.',
    long_description: 'Application de traitement du langage naturel pour analyser le sentiment sur les réseaux sociaux. Utilise des modèles de deep learning pour comprendre les nuances du langage et générer des insights marketing précieux.',
    type: 'ai_ml',
    technologies: ['Python', 'BERT', 'spaCy', 'Flask', 'PostgreSQL', 'Celery'],
    features: [
      'Analyse de sentiment en temps réel',
      'Support multilingue',
      'Détection d\'émotions complexes',
      'Rapports et visualisations',
      'API REST publique',
      'Dashboard interactif'
    ],
    github_url: 'https://github.com/samitochi04/sentiment-analyzer',
    status: 'completed',
    start_date: '2022-01-01',
    end_date: '2022-06-30',
    is_featured: false,
    display_order: 4
  },
  {
    title: 'API de Géolocalisation Intelligente',
    description: 'API RESTful pour services de géolocalisation avec machine learning pour prédire les déplacements et optimiser les trajets.',
    type: 'api',
    technologies: ['Python', 'FastAPI', 'PostGIS', 'Redis', 'Docker'],
    features: [
      'Géolocalisation précise',
      'Prédiction de trajets',
      'Optimisation de routes',
      'Cache Redis performant',
      'Documentation OpenAPI',
      'Rate limiting avancé'
    ],
    github_url: 'https://github.com/samitochi04/geo-api',
    status: 'completed',
    start_date: '2021-10-01',
    end_date: '2022-01-31',
    display_order: 5
  }
];

const siteSettings = [
  { key: 'site_title', value: 'Samuel FOTSO - Portfolio', description: 'Titre principal du site', type: 'string', is_public: true },
  { key: 'site_description', value: 'Data Scientist', description: 'Description du site', type: 'string', is_public: true },
  { key: 'contact_email', value: 'temmodaryl317@gmail.com', description: 'Email de contact principal', type: 'string', is_public: true },
  { key: 'linkedin_url', value: 'https://www.linkedin.com/in/samuel-fotso-6b9879253/', description: 'Profil LinkedIn', type: 'string', is_public: true },
  { key: 'github_url', value: 'https://github.com/samitochi04', description: 'Profil GitHub', type: 'string', is_public: true },
  { key: 'enable_chatbot', value: 'true', description: 'Activer le chatbot', type: 'boolean', is_public: true },
  { key: 'enable_analytics', value: 'true', description: 'Activer le tracking analytics', type: 'boolean', is_public: false },
  { key: 'max_chat_messages', value: '50', description: 'Nombre max de messages dans le chat', type: 'number', is_public: false }
];

// =============================================
// SEEDING FUNCTIONS
// =============================================

async function seedSkills() {
  console.log('🌱 Seeding skills...');
  
  for (const skill of skills) {
    const { error } = await supabase
      .from('skills')
      .insert([skill]);
    
    if (error) {
      console.error(`Error inserting skill ${skill.name}:`, error);
    } else {
      console.log(`✅ Inserted skill: ${skill.name}`);
    }
  }
}

async function seedExperiences() {
  console.log('🌱 Seeding experiences...');
  
  for (const experience of experiences) {
    const { error } = await supabase
      .from('experiences')
      .insert([experience]);
    
    if (error) {
      console.error(`Error inserting experience ${experience.title}:`, error);
    } else {
      console.log(`✅ Inserted experience: ${experience.title}`);
    }
  }
}

async function seedProjects() {
  console.log('🌱 Seeding projects...');
  
  for (const project of projects) {
    const { error } = await supabase
      .from('projects')
      .insert([project]);
    
    if (error) {
      console.error(`Error inserting project ${project.title}:`, error);
    } else {
      console.log(`✅ Inserted project: ${project.title}`);
    }
  }
}

async function seedSiteSettings() {
  console.log('🌱 Seeding site settings...');
  
  for (const setting of siteSettings) {
    const { error } = await supabase
      .from('site_settings')
      .insert([setting]);
    
    if (error) {
      console.error(`Error inserting setting ${setting.key}:`, error);
    } else {
      console.log(`✅ Inserted setting: ${setting.key}`);
    }
  }
}

async function createAdminUser() {
  console.log('🌱 Creating admin user...');
  
  // Note: This assumes you've already created a user in Supabase Auth
  // Replace with actual user ID from your Supabase Auth
  const adminUser = {
    user_id: '00000000-0000-0000-0000-000000000000', // Replace with actual UUID
    email: 'temmodaryl317@gmail.com',
    full_name: 'Samuel FOTSO',
    role: 'super_admin',
    is_active: true
  };
  
  const { error } = await supabase
    .from('admin_users')
    .insert([adminUser]);
  
  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('✅ Created admin user');
  }
}

// =============================================
// MAIN SEEDING FUNCTION
// =============================================

async function seedDatabase() {
  console.log('🚀 Starting database seeding...');
  
  try {
    await seedSkills();
    await seedExperiences();
    await seedProjects();
    await seedSiteSettings();
    
    // Note: Uncomment and update the user_id before running
    // await createAdminUser();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('seed-data.js');
if (isMainModule) {
  seedDatabase();
}

export { seedDatabase };