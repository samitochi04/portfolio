// =============================================
// SAMUEL FOTSO PORTFOLIO - CERTIFICATIONS DATA
// =============================================
// This script seeds the certifications table with sample data

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🎓 Certifications Data Seeding Script');
console.log('🔧 Environment check:');
console.log(`SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =============================================
// CERTIFICATIONS DATA
// =============================================

const certifications = [
  {
    name: 'AWS Certified Solutions Architect - Professional',
    issuing_organization: 'Amazon Web Services',
    issue_date: '2023-08-15',
    expiration_date: '2026-08-15',
    credential_id: 'AWS-PSA-2023-SF001',
    credential_url: 'https://aws.amazon.com/verification',
    certificate_url: 'https://example.com/certificates/aws-professional.pdf',
    description: 'Certification avancée validant l\'expertise en conception d\'architectures cloud AWS complexes, sécurisées et hautement disponibles.',
    skills: ['AWS', 'Cloud Architecture', 'Scalability', 'Security', 'Cost Optimization'],
    is_featured: true,
    display_order: 1
  },
  {
    name: 'Google Professional Data Engineer',
    issuing_organization: 'Google Cloud',
    issue_date: '2023-05-22',
    expiration_date: '2025-05-22',
    credential_id: 'GCP-PDE-2023-SF002',
    credential_url: 'https://cloud.google.com/certification/verify',
    certificate_url: 'https://example.com/certificates/gcp-data-engineer.pdf',
    description: 'Certification validant les compétences en ingénierie de données sur Google Cloud Platform, incluant BigQuery, Dataflow et Pub/Sub.',
    skills: ['Google Cloud', 'BigQuery', 'Dataflow', 'Pub/Sub', 'Data Pipeline', 'ETL'],
    is_featured: true,
    display_order: 2
  },
  {
    name: 'Microsoft Azure AI Engineer Associate',
    issuing_organization: 'Microsoft',
    issue_date: '2023-03-10',
    expiration_date: '2025-03-10',
    credential_id: 'MS-AI-102-2023-SF003',
    credential_url: 'https://learn.microsoft.com/en-us/credentials/browse/',
    certificate_url: 'https://example.com/certificates/azure-ai-engineer.pdf',
    description: 'Certification en ingénierie IA sur Azure, couvrant Cognitive Services, Machine Learning et Computer Vision.',
    skills: ['Azure', 'Cognitive Services', 'Computer Vision', 'NLP', 'Machine Learning'],
    is_featured: true,
    display_order: 3
  },
  {
    name: 'TensorFlow Developer Certificate',
    issuing_organization: 'TensorFlow Certificate Program',
    issue_date: '2022-11-18',
    expiration_date: '2025-11-18',
    credential_id: 'TF-DEV-2022-SF004',
    credential_url: 'https://www.tensorflow.org/certificate',
    certificate_url: 'https://example.com/certificates/tensorflow-developer.pdf',
    description: 'Certification officielle TensorFlow validant les compétences en développement de modèles de machine learning et deep learning.',
    skills: ['TensorFlow', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP'],
    is_featured: true,
    display_order: 4
  },
  {
    name: 'Certified Kubernetes Application Developer (CKAD)',
    issuing_organization: 'Cloud Native Computing Foundation',
    issue_date: '2022-09-05',
    expiration_date: '2025-09-05',
    credential_id: 'CKAD-2022-SF005',
    credential_url: 'https://training.linuxfoundation.org/certification/verify',
    certificate_url: 'https://example.com/certificates/ckad.pdf',
    description: 'Certification pratique en développement d\'applications sur Kubernetes, incluant les pods, services, deployments et networking.',
    skills: ['Kubernetes', 'Docker', 'Container Orchestration', 'DevOps', 'Microservices'],
    is_featured: false,
    display_order: 5
  },
  {
    name: 'MongoDB Certified Developer Associate',
    issuing_organization: 'MongoDB University',
    issue_date: '2022-07-12',
    expiration_date: '2025-07-12',
    credential_id: 'MDB-DEV-2022-SF006',
    credential_url: 'https://university.mongodb.com/verify_certificate',
    certificate_url: 'https://example.com/certificates/mongodb-developer.pdf',
    description: 'Certification en développement d\'applications avec MongoDB, couvrant les requêtes, indexation et agrégation.',
    skills: ['MongoDB', 'NoSQL', 'Database Design', 'Aggregation', 'Indexing'],
    is_featured: false,
    display_order: 6
  },
  {
    name: 'React Developer Certification',
    issuing_organization: 'Meta (Facebook)',
    issue_date: '2022-04-20',
    expiration_date: null, // No expiration
    credential_id: 'META-REACT-2022-SF007',
    credential_url: 'https://developers.facebook.com/certifications',
    certificate_url: 'https://example.com/certificates/react-developer.pdf',
    description: 'Certification officielle Meta en développement React, incluant hooks, state management et performance optimization.',
    skills: ['React', 'JavaScript', 'Frontend Development', 'Hooks', 'State Management'],
    is_featured: false,
    display_order: 7
  },
  {
    name: 'Scrum Master Certified (SMC)',
    issuing_organization: 'Scrum Alliance',
    issue_date: '2021-12-08',
    expiration_date: '2024-12-08',
    credential_id: 'SA-SMC-2021-SF008',
    credential_url: 'https://www.scrumalliance.org/get-certified/verify-certification',
    certificate_url: 'https://example.com/certificates/scrum-master.pdf',
    description: 'Certification en gestion de projet agile et méthodologie Scrum, incluant facilitation d\'équipe et amélioration continue.',
    skills: ['Scrum', 'Agile', 'Project Management', 'Team Leadership', 'Process Improvement'],
    is_featured: false,
    display_order: 8
  }
];

// =============================================
// SEEDING FUNCTIONS
// =============================================

async function clearCertifications() {
  console.log('🗑️ Clearing existing certifications...');
  const { error } = await supabase
    .from('certifications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (error) {
    console.error('❌ Error clearing certifications:', error);
    throw error;
  }
  console.log('✅ Certifications cleared');
}

async function seedCertifications() {
  console.log('🎓 Seeding certifications...');
  
  const { data, error } = await supabase
    .from('certifications')
    .insert(certifications)
    .select();
  
  if (error) {
    console.error('❌ Error seeding certifications:', error);
    throw error;
  }
  
  console.log(`✅ Successfully seeded ${data.length} certifications`);
  return data;
}

// =============================================
// MAIN EXECUTION
// =============================================

async function main() {
  try {
    console.log('🚀 Starting certifications data seeding...\n');
    
    // Clear existing data
    await clearCertifications();
    
    // Seed new data
    const certificationData = await seedCertifications();
    
    console.log('\n🎉 Certifications seeding completed successfully!');
    console.log(`📊 Total certifications: ${certificationData.length}`);
    console.log(`⭐ Featured certifications: ${certificationData.filter(c => c.is_featured).length}`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();