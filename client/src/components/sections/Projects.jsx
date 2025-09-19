import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../ui';
import { PROJECT_TYPES } from '../../lib/constants';
import { useSupabaseAdmin } from '../../hooks';

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getData } = useSupabaseAdmin();

  const types = Object.values(PROJECT_TYPES);
  
  const filteredProjects = selectedType 
    ? projects.filter(project => project.type === selectedType)
    : projects;

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await getData('projects', {
          orderBy: 'display_order',
          ascending: true
        });
        
        if (error) {
          // Error fetching projects
          return;
        }
        
        // Map database fields to component expected fields
        const mappedData = data?.map(project => ({
          ...project,
          liveUrl: project.live_url,
          githubUrl: project.github_url,
        })) || [];
        
        setProjects(mappedData);
      } catch (error) {
        // Error fetching projects
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [getData]);

  const getTypeColor = (type) => {
    switch (type) {
      case PROJECT_TYPES.WEB_APP:
        return 'text-blue-600 bg-blue-100';
      case PROJECT_TYPES.MOBILE_APP:
        return 'text-emerald-600 bg-emerald-100';
      case PROJECT_TYPES.AI_ML:
        return 'text-purple-600 bg-purple-100';
      case PROJECT_TYPES.DATA_SCIENCE:
        return 'text-yellow-600 bg-yellow-100';
      case PROJECT_TYPES.API:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case PROJECT_TYPES.WEB_APP:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
          </svg>
        );
      case PROJECT_TYPES.AI_ML:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('projects.subtitle')}
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
            Tous
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
              {t(`projects.type.${type}`)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} hover className="transition-all duration-300 hover:shadow-xl group">
              {/* Project Image/Icon */}
              <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                <div className={`p-4 rounded-full ${getTypeColor(project.type)} transition-transform duration-300 group-hover:scale-110`}>
                  {getTypeIcon(project.type)}
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(project.type)}`}>
                    {t(`projects.type.${project.type}`)}
                  </span>
                </div>
              </div>

              <Card.Body className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                {project.technologies && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t('projects.technologies')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  {project.liveUrl && (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                      className="flex-1"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {t('projects.viewLive')}
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                      className="flex-1"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      {t('projects.viewCode')}
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Add more projects message if filtered */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              Aucun projet trouvé pour cette catégorie
            </div>
            <Button
              variant="ghost"
              onClick={() => setSelectedType(null)}
            >
              Voir tous les projets
            </Button>
          </div>
        )}

        {/* Projects Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-gray-600">Projets réalisés</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{types.length}</div>
              <div className="text-sm text-gray-600">Types de projets</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Satisfaction client</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;