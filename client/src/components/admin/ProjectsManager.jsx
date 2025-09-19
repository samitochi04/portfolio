import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseAdmin } from '../../hooks/useSupabaseAdmin';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

const ProjectsManager = () => {
  const { user, isAdmin } = useAuth();
  const { getData, createData, updateData, deleteData } = useSupabaseAdmin();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    type: 'web_app',
    technologies: [],
    features: [],
    live_url: '',
    github_url: '',
    status: 'completed',
    start_date: '',
    end_date: '',
    is_featured: false,
    display_order: 1
  });

  const projectTypes = [
    { value: 'web_app', label: 'Application Web' },
    { value: 'mobile_app', label: 'Application Mobile' },
    { value: 'ai_ml', label: 'IA & Machine Learning' },
    { value: 'api', label: 'API / Backend' },
    { value: 'desktop_app', label: 'Application Desktop' },
    { value: 'other', label: 'Autre' }
  ];

  const projectStatuses = [
    { value: 'planning', label: 'En planification' },
    { value: 'in_progress', label: 'En développement' },
    { value: 'completed', label: 'Terminé' },
    { value: 'on_hold', label: 'En pause' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    fetchProjects();
  }, [user, isAdmin, navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getData('projects', {
        orderBy: 'display_order',
        ascending: true
      });
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process technologies and features as arrays
      const processedData = {
        ...formData,
        technologies: typeof formData.technologies === 'string'
          ? formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
          : formData.technologies,
        features: typeof formData.features === 'string'
          ? formData.features.split('\n').filter(feature => feature.trim())
          : formData.features
      };

      if (editingProject) {
        await updateData('projects', editingProject.id, processedData);
      } else {
        await createData('projects', processedData);
      }
      
      await fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      long_description: project.long_description || '',
      type: project.type,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : project.technologies || '',
      features: Array.isArray(project.features)
        ? project.features.join('\n')
        : project.features || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      is_featured: project.is_featured || false,
      display_order: project.display_order || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteData('projects', projectId);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      long_description: '',
      type: 'web_app',
      technologies: [],
      features: [],
      live_url: '',
      github_url: '',
      status: 'completed',
      start_date: '',
      end_date: '',
      is_featured: false,
      display_order: 1
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'text-blue-400',
      in_progress: 'text-yellow-400',
      completed: 'text-green-400',
      on_hold: 'text-orange-400',
      cancelled: 'text-red-400'
    };
    return colors[status] || 'text-white/60';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Gestion des projets
              </h1>
              <p className="text-white/60">
                {projects.length} projet{projects.length > 1 ? 's' : ''} enregistré{projects.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/admin/dashboard')}
                variant="outline"
                size="sm"
              >
                ← Retour
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                size="sm"
              >
                Nouveau projet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                      {projectTypes.find(type => type.value === project.type)?.label}
                    </span>
                    <span className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                      {projectStatuses.find(status => status.value === project.status)?.label}
                    </span>
                    {project.is_featured && (
                      <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                        ⭐ Mis en avant
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p className="text-white/70 mb-4">
                {project.description}
              </p>

              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white/80 font-medium mb-2">Technologies :</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white/80 font-medium mb-2">Fonctionnalités :</h4>
                  <ul className="space-y-1">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-white/70 text-sm flex items-start">
                        <span className="text-white/40 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                    {project.features.length > 3 && (
                      <li className="text-white/60 text-xs">
                        ... et {project.features.length - 3} autre{project.features.length - 3 > 1 ? 's' : ''}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-white/60 text-sm">
                  {project.start_date && (
                    <span>
                      {formatDate(project.start_date)} 
                      {project.end_date && ` - ${formatDate(project.end_date)}`}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      title="Voir le projet en ligne"
                    >
                      🌐
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      title="Voir le code source"
                    >
                      📁
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">Aucun projet enregistré</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              className="mt-4"
            >
              Ajouter le premier projet
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Modifier le projet' : 'Nouveau projet'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Titre du projet
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex: Portfolio 3D Interactif"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Type de projet
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {projectTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-black">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description courte
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="2"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Description résumée du projet en 1-2 phrases..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description détaillée
            </label>
            <textarea
              name="long_description"
              value={formData.long_description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Description complète du projet, contexte, défis relevés..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Technologies (séparées par des virgules)
            </label>
            <textarea
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="React, Three.js, Supabase, Tailwind CSS, Node.js"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Fonctionnalités principales (une par ligne)
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Animations 3D interactives avec Three.js&#10;Chatbot IA intégré&#10;Interface multilingue (FR, EN, DE)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                URL du projet en ligne
              </label>
              <input
                type="url"
                name="live_url"
                value={formData.live_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                URL du repository GitHub
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Statut du projet
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {projectStatuses.map(status => (
                  <option key={status.value} value={status.value} className="bg-black">
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Date de début
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="flex items-center justify-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-white/80 text-sm">Mettre en avant</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="outline"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsManager;