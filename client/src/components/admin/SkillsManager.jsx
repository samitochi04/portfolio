import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseAdmin } from '../../hooks/useSupabaseAdmin';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

const SkillsManager = () => {
  const { user, isAdmin } = useAuth();
  const { getData, createData, updateData, deleteData } = useSupabaseAdmin();
  const navigate = useNavigate();
  
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'programming',
    level: 50,
    years_experience: 1,
    description: '',
    is_featured: false,
    display_order: 1
  });

  const categories = [
    { value: 'programming', label: 'Programmation' },
    { value: 'frameworks', label: 'Frameworks' },
    { value: 'databases', label: 'Bases de données' },
    { value: 'ai_ml', label: 'IA & Machine Learning' },
    { value: 'tools', label: 'Outils' },
    { value: 'soft_skills', label: 'Compétences humaines' }
  ];

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    fetchSkills();
  }, [user, isAdmin, navigate]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getData('skills', {
        orderBy: 'display_order',
        ascending: true
      });
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingSkill) {
        await updateData('skills', editingSkill.id, formData);
      } else {
        await createData('skills', formData);
      }
      
      await fetchSkills();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      years_experience: skill.years_experience,
      description: skill.description || '',
      is_featured: skill.is_featured || false,
      display_order: skill.display_order || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (skillId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteData('skills', skillId);
      await fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'programming',
      level: 50,
      years_experience: 1,
      description: '',
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

  if (loading && skills.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement des compétences...</p>
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
                Gestion des compétences
              </h1>
              <p className="text-white/60">
                {skills.length} compétence{skills.length > 1 ? 's' : ''} enregistrée{skills.length > 1 ? 's' : ''}
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
                Nouvelle compétence
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {skill.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {categories.find(cat => cat.value === skill.category)?.label}
                  </p>
                  {skill.is_featured && (
                    <span className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full mt-1">
                      Mis en avant
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">Niveau</span>
                    <span className="text-white">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-white/60">Expérience: </span>
                  <span className="text-white">{skill.years_experience} an{skill.years_experience > 1 ? 's' : ''}</span>
                </div>
                
                {skill.description && (
                  <p className="text-white/70 text-sm">
                    {skill.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">Aucune compétence enregistrée</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              className="mt-4"
            >
              Ajouter la première compétence
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSkill ? 'Modifier la compétence' : 'Nouvelle compétence'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Nom de la compétence
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Ex: React, Python, Leadership..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className="bg-black">
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Niveau (%)
              </label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Années d'expérience
              </label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleInputChange}
                min="0"
                max="50"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
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
              placeholder="Description de votre expertise dans cette compétence..."
            />
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

            <div className="flex items-center pt-6">
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

export default SkillsManager;