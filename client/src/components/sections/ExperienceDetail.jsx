import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSupabaseAdmin } from '../../hooks';
import { Button, Card } from '../ui';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getData } = useSupabaseAdmin();
  
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('No experience ID provided');
          return;
        }
        
        const { data, error } = await getData('experiences', {
          filter: { 
            column: 'id', 
            value: id, 
            operator: 'eq' 
          },
          limit: 1
        });
        
        if (error) {
          setError('Failed to fetch experience');
          return;
        }
        
        if (data && data.length > 0) {
          setExperience(data[0]);
        } else {
          setError('Experience not found');
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id, getData]);

  const getTypeColor = (type) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800',
      education: 'bg-green-100 text-green-800',
      project: 'bg-purple-100 text-purple-800',
      certification: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || colors.work;
  };

  const getTypeIcon = (type) => {
    const icons = {
      work: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      education: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      project: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      certification: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    };
    return icons[type] || icons.work;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calculateDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested experience could not be found.'}</p>
          <Button onClick={() => navigate('/#experiences')}>
            {t('common.back')} to Experiences
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <div className="mb-8">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/#experiences')}
            className="inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')} to Experiences
          </Button>
        </div>

        {/* Experience Header */}
        <Card className="mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3 ${getTypeColor(experience.type)}`}>
                    {getTypeIcon(experience.type)}
                    <span className="ml-2">{t(`experience.${experience.type}`)}</span>
                  </div>
                  {experience.is_current && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {t('experience.current')}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{experience.company}</p>
                
                {/* Duration and Location */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {formatDate(experience.start_date)}
                      {experience.end_date && !experience.is_current && ` - ${formatDate(experience.end_date)}`}
                      {experience.is_current && ' - Present'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {calculateDuration(experience.start_date, experience.end_date, experience.is_current)}
                    </span>
                  </div>
                  
                  {experience.location && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{experience.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Company URL */}
              {experience.company_url && (
                <div className="mt-4 lg:mt-0">
                  <a 
                    href={experience.company_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visiter {experience.company}
                  </a>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Experience Description */}
        <Card className="mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {experience.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Key Achievements */}
        {experience.achievements && experience.achievements.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Achievements</h2>
              <ul className="space-y-3">
                {experience.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        {/* Technologies & Skills */}
        {experience.technologies && experience.technologies.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies & Skills Used</h2>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Impact & Learning */}
        <Card className="mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact Professionnel & Apprentissage</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Créé</h3>
                <div className="space-y-2 text-gray-700">
                  {experience.type === 'work' && (
                    <>
                      <p>• Contribution aux objectifs commerciaux grâce à des solutions basées sur les données</p>
                      <p>• Collaboration avec des équipes transversales pour livrer des projets</p>
                      <p>• Application des meilleures pratiques en développement logiciel et science des données</p>
                    </>
                  )}
                  {experience.type === 'education' && (
                    <>
                      <p>• Construction de connaissances fondamentales en science des données et technologie</p>
                      <p>• Développement de compétences analytiques et de résolution de problèmes</p>
                      <p>• Exposition à divers langages de programmation et outils</p>
                    </>
                  )}
                  {experience.type === 'project' && (
                    <>
                      <p>• Démonstration de l'application pratique des compétences techniques</p>
                      <p>• Résolution de problèmes réels avec des solutions innovantes</p>
                      <p>• Mise en valeur de la capacité à travailler de manière autonome et gérer des projets</p>
                    </>
                  )}
                  {experience.type === 'certification' && (
                    <>
                      <p>• Validation de l'expertise dans des domaines techniques spécifiques</p>
                      <p>• Démonstration d'un engagement envers l'apprentissage continu</p>
                      <p>• Amélioration de la crédibilité professionnelle et de la base de connaissances</p>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Compétences Développées</h3>
                <div className="space-y-2 text-gray-700">
                  <p>• Maîtrise technique avancée</p>
                  <p>• Gestion et organisation de projets</p>
                  <p>• Résolution de problèmes et pensée critique</p>
                  <p>• Communication et collaboration</p>
                  <p>• Analyse et interprétation de données</p>
                  <p>• Innovation et solutions créatives</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Back to experiences */}
        <div className="text-center">
          <Button variant="secondary" onClick={() => navigate('/#experiences')}>
            {t('common.back')} to All Experiences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;