import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '../ui';
import { EXPERIENCE_TYPES } from '../../lib/constants';
import { formatDate } from '../../lib/utils';
import { useSupabaseAdmin } from '../../hooks';

const Experience = () => {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getData } = useSupabaseAdmin();

  const types = Object.values(EXPERIENCE_TYPES);
  
  // Combine experiences and certifications for display
  const allItems = [
    ...experiences,
    ...certifications.map(cert => ({
      ...cert,
      type: 'certification',
      title: cert.name,
      company: cert.issuing_organization,
      startDate: cert.issue_date,
      endDate: cert.expiration_date,
      description: cert.description,
      achievements: cert.skills ? cert.skills.map(skill => `Compétence: ${skill}`) : []
    }))
  ];
  
  const filteredItems = selectedType 
    ? allItems.filter(item => item.type === selectedType)
    : allItems;

  // Fetch experiences and certifications from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch experiences
        const { data: experiencesData, error: experiencesError } = await getData('experiences', {
          orderBy: 'start_date',
          ascending: false
        });
        
        if (experiencesError) {
          console.error('Error fetching experiences:', experiencesError);
        } else {
          // Map database fields to component expected fields
          const mappedExperiences = experiencesData?.map(exp => ({
            ...exp,
            startDate: exp.start_date,
            endDate: exp.end_date,
          })) || [];
          
          setExperiences(mappedExperiences);
        }
        
        // Fetch certifications
        const { data: certificationsData, error: certificationsError } = await getData('certifications', {
          orderBy: 'issue_date',
          ascending: false
        });
        
        if (certificationsError) {
          console.error('Error fetching certifications:', certificationsError);
        } else {
          setCertifications(certificationsData || []);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getData]);

  const getExperienceIcon = (type) => {
    switch (type) {
      case EXPERIENCE_TYPES.WORK:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-2V4c0-1.11-.89-2-2-2h-4c0-1.11-.89-2-2-2H6c-1.11 0-2 .89-2 2v2H2c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM6 4h4v2H6V4zm10 15H4V8h12v11z"/>
          </svg>
        );
      case EXPERIENCE_TYPES.EDUCATION:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zM18.82 9L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
        );
      case EXPERIENCE_TYPES.CERTIFICATION:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case EXPERIENCE_TYPES.WORK:
        return 'text-blue-600 bg-blue-100';
      case EXPERIENCE_TYPES.EDUCATION:
        return 'text-emerald-600 bg-emerald-100';
      case EXPERIENCE_TYPES.CERTIFICATION:
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <section id="experiences" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experiences" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('experience.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('experience.subtitle')}
          </p>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-6 py-3 rounded-full transition-all duration-300 ${
              selectedType === null
                ? 'bg-black text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Tout
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedType === type
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {t(`experience.${type}`)}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300"></div>
          
          <div className="space-y-12">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(item.type)}`}>
                    {getExperienceIcon(item.type)}
                  </div>
                </div>

                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <Card hover className="transition-all duration-300 hover:shadow-xl">
                    <Card.Header>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-blue-600 font-medium">{item.company}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          {t(`experience.${item.type}`)}
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                          </svg>
                          <span>
                            {formatDate(item.startDate)} - {' '}
                            {item.endDate ? formatDate(item.endDate) : 
                             (item.type === 'certification' ? t('experience.noExpiration') : t('experience.current'))}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {item.description}
                        </p>
                        {item.achievements && item.achievements.length > 0 && (
                          <ul className="space-y-1 text-sm text-gray-600">
                            {item.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {/* Show credential URL for certifications */}
                        {item.type === 'certification' && item.credential_url && (
                          <div className="mt-3">
                            <a 
                              href={item.credential_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                              </svg>
                              Vérifier la certification
                            </a>
                          </div>
                        )}
                        {/* Show details link for experiences */}
                        {item.type !== 'certification' && (
                          <div className="mt-4">
                            <Link 
                              to={`/experience/${item.id}`}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {t('experience.viewDetails')}
                            </Link>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3+</div>
              <div className="text-sm text-gray-600">Années d'expérience</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">3+</div>
              <div className="text-sm text-gray-600">Projets majeurs</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Formations</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{certifications.length}</div>
              <div className="text-sm text-gray-600">Certifications</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;