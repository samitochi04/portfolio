import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseAdmin } from '../../hooks/useSupabaseAdmin';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

const ExperiencesManager = () => {
  const { user, isAdmin } = useAuth();
  const { getData, createData, updateData, deleteData } = useSupabaseAdmin();
  const navigate = useNavigate();
  
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'work',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    achievements: [],
    technologies: [],
    location: '',
    display_order: 1
  });

  const experienceTypes = [
    { value: 'work', label: 'Expérience professionnelle' },
    { value: 'education', label: 'Formation' },
    { value: 'project', label: 'Projet' },
    { value: 'certification', label: 'Certification' }
  ];

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    fetchExperiences();
  }, [user, isAdmin, navigate]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await getData('experiences', {
        orderBy: 'display_order',
        ascending: true
      });
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process achievements and technologies as arrays
      const processedData = {
        ...formData,
        achievements: typeof formData.achievements === 'string' 
          ? formData.achievements.split('\n').filter(item => item.trim())
          : formData.achievements,
        technologies: typeof formData.technologies === 'string'
          ? formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
          : formData.technologies,
        end_date: formData.is_current ? null : formData.end_date
      };

      if (editingExperience) {
        await updateData('experiences', editingExperience.id, processedData);
      } else {
        await createData('experiences', processedData);
      }
      
      await fetchExperiences();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      type: experience.type,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      is_current: experience.is_current || false,
      description: experience.description || '',
      achievements: Array.isArray(experience.achievements) 
        ? experience.achievements.join('\n')
        : experience.achievements || '',
      technologies: Array.isArray(experience.technologies)
        ? experience.technologies.join(', ')
        : experience.technologies || '',
      location: experience.location || '',
      display_order: experience.display_order || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (experienceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteData('experiences', experienceId);
      await fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setFormData({
      title: '',
      company: '',
      type: 'work',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: [],
      technologies: [],
      location: '',
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading && experiences.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement des expériences...</p>
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
                Gestion des expériences
              </h1>
              <p className="text-white/60">
                {experiences.length} expérience{experiences.length > 1 ? 's' : ''} enregistrée{experiences.length > 1 ? 's' : ''}
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
                Nouvelle expérience
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Experiences List */}
        <div className="space-y-6">
          {experiences.map((experience) => (
            <Card key={experience.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {experience.title}
                  </h3>
                  <p className="text-white/80 text-lg">
                    {experience.company}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                      {experienceTypes.find(type => type.value === experience.type)?.label}
                    </span>
                    <span className="text-white/60 text-sm">
                      {formatDate(experience.start_date)} - {
                        experience.is_current ? 'Présent' : formatDate(experience.end_date)
                      }
                    </span>
                    {experience.location && (
                      <span className="text-white/60 text-sm">
                        📍 {experience.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {experience.description && (
                <p className="text-white/70 mb-4">
                  {experience.description}
                </p>
              )}

              {experience.achievements && experience.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white/80 font-medium mb-2">Réalisations :</h4>
                  <ul className="space-y-1">
                    {experience.achievements.map((achievement, index) => (
                      <li key={index} className="text-white/70 text-sm flex items-start">
                        <span className="text-white/40 mr-2">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.technologies && experience.technologies.length > 0 && (
                <div>
                  <h4 className="text-white/80 font-medium mb-2">Technologies :</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, index) => (
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
            </Card>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">Aucune expérience enregistrée</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              className="mt-4"
            >
              Ajouter la première expérience
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExperience ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Titre du poste / Formation
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex: Data Scientist Senior"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Entreprise / Institution
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex: TechCorp Solutions"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Type d'expérience
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {experienceTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-black">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Localisation
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex: Paris, France"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Date de début
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
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
                disabled={formData.is_current}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-white/80 text-sm">Poste actuel</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Description de vos missions et responsabilités..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Réalisations (une par ligne)
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Amélioration de 35% de la précision des modèles&#10;Mise en place d'un pipeline automatisé&#10;Formation de 15+ collaborateurs"
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
              placeholder="Python, TensorFlow, PostgreSQL, Docker, AWS"
            />
          </div>

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

export default ExperiencesManager;