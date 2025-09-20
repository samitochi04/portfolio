import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSupabaseAdmin } from '../../hooks';
import { Button, Card } from '../ui';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getData } = useSupabaseAdmin();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('No project ID provided');
          return;
        }
        
        const { data, error } = await getData('projects', {
          filter: { 
            column: 'id', 
            value: id, 
            operator: 'eq' 
          },
          limit: 1
        });
        
        if (error) {
          setError('Failed to fetch project');
          return;
        }
        
        if (data && data.length > 0) {
          setProject(data[0]);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, getData]);

  const getTypeColor = (type) => {
    const colors = {
      web_app: 'bg-blue-100 text-blue-800',
      mobile_app: 'bg-green-100 text-green-800',
      ai_ml: 'bg-purple-100 text-purple-800',
      data_science: 'bg-orange-100 text-orange-800',
      api: 'bg-gray-100 text-gray-800',
      other: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || colors.other;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      planning: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.completed;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested project could not be found.'}</p>
          <Button onClick={() => navigate('/#projects')}>
            {t('common.back')} to Projects
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
            onClick={() => navigate('/#projects')}
            className="inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')} to Projects
          </Button>
        </div>

        {/* Project Header */}
        <Card className="mb-8">
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(project.type)}`}>
                    {t(`projects.type.${project.type}`)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  {project.is_featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-3 mt-4 lg:mt-0">
                {project.live_url && (
                  <Button 
                    as="a" 
                    href={project.live_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t('projects.viewLive')}
                  </Button>
                )}
                {project.github_url && (
                  <Button 
                    variant="secondary"
                    as="a" 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    {t('projects.viewCode')}
                  </Button>
                )}
              </div>
            </div>

            {/* Project dates */}
            {(project.start_date || project.end_date) && (
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Duration: </span>
                {formatDate(project.start_date)}
                {project.end_date && ` - ${formatDate(project.end_date)}`}
                {!project.end_date && project.status === 'in_progress' && ' - Present'}
              </div>
            )}
          </div>
        </Card>

        {/* Project Description */}
        <Card className="mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                {project.description}
              </p>
              {project.long_description && (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.long_description}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Technologies Used */}
        {project.technologies && project.technologies.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('projects.technologies')}</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
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

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        {/* Project Images */}
        {project.image_urls && project.image_urls.length > 0 && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.image_urls.map((imageUrl, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imageUrl}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Additional Links */}
        {project.demo_url && (
          <Card className="mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Demo</h2>
              <Button 
                as="a" 
                href={project.demo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Demo
              </Button>
            </div>
          </Card>
        )}

        {/* Back to projects */}
        <div className="text-center">
          <Button variant="secondary" onClick={() => navigate('/#projects')}>
            {t('common.back')} to All Projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;