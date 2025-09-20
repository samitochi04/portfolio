import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseAdmin } from '../../hooks/useSupabaseAdmin';
import { Button, Card, Modal } from '../ui';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { getData, createData, updateData, deleteData } = useSupabaseAdmin();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit' | 'delete'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Data states
  const [stats, setStats] = useState({
    skills: 0,
    experiences: 0,
    projects: 0,
    certifications: 0,
    visitors: 0,
    chatMessages: 0
  });
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Menu items
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'skills', label: 'Compétences', icon: '🚀' },
    { id: 'experiences', label: 'Expériences', icon: '💼' },
    { id: 'projects', label: 'Projets', icon: '🎯' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all tables data
      const [skillsData, experiencesData, projectsData, certificationsData] = await Promise.all([
        getData('skills'),
        getData('experiences'),
        getData('projects'),
        getData('certifications')
      ]);

      setSkills(skillsData.data || []);
      setExperiences(experiencesData.data || []);
      setProjects(projectsData.data || []);
      setCertifications(certificationsData.data || []);

      // Calculate stats
      setStats({
        skills: skillsData.data?.length || 0,
        experiences: experiencesData.data?.length || 0,
        projects: projectsData.data?.length || 0,
        certifications: certificationsData.data?.length || 0,
        visitors: 0, // Would need visitor tracking
        chatMessages: 0 // Would need chatbot data
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [getData]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  // Handle CRUD operations
  const handleCreate = async (tableName, data) => {
    try {
      await createData(tableName, data);
      await fetchData();
      setShowModal(false);
      setFormData({});
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdate = async (tableName, id, data) => {
    try {
      await updateData(tableName, id, data);
      await fetchData();
      setShowModal(false);
      setFormData({});
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (tableName, id) => {
    try {
      await deleteData(tableName, id);
      await fetchData();
      setShowModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Form handlers
  const openCreateModal = (section) => {
    setActiveSection(section);
    setModalType('create');
    setFormData({});
    setSelectedItem(null);
    setShowModal(true);
  };

  const openEditModal = (item, section) => {
    setActiveSection(section);
    setModalType('edit');
    setFormData(item);
    setSelectedItem(item);
    setShowModal(true);
  };

  const openDeleteModal = (item) => {
    setModalType('delete');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Overview component
  const OverviewSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Vue d'ensemble</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Compétences</p>
                <p className="text-3xl font-bold">{stats.skills}</p>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Expériences</p>
                <p className="text-3xl font-bold">{stats.experiences}</p>
              </div>
              <div className="text-4xl">💼</div>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Projets</p>
                <p className="text-3xl font-bold">{stats.projects}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Certifications</p>
                <p className="text-3xl font-bold">{stats.certifications}</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100">Visiteurs</p>
                <p className="text-3xl font-bold">{stats.visitors}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100">Messages Chat</p>
                <p className="text-3xl font-bold">{stats.chatMessages}</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-white">Répartition du contenu</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Compétences</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(stats.skills / Math.max(stats.skills, stats.experiences, stats.projects, stats.certifications)) * 100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-white">{stats.skills}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Expériences</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(stats.experiences / Math.max(stats.skills, stats.experiences, stats.projects, stats.certifications)) * 100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-white">{stats.experiences}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Projets</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: `${(stats.projects / Math.max(stats.skills, stats.experiences, stats.projects, stats.certifications)) * 100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-white">{stats.projects}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Certifications</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(stats.certifications / Math.max(stats.skills, stats.experiences, stats.projects, stats.certifications)) * 100}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-white">{stats.certifications}</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-white">Actions rapides</h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => openCreateModal('skills')}
                className="flex flex-col items-center justify-center h-20 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30"
              >
                <span className="text-xl mb-1">🚀</span>
                <span className="text-sm">Ajouter Compétence</span>
              </Button>
              <Button
                onClick={() => openCreateModal('experiences')}
                className="flex flex-col items-center justify-center h-20 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30"
              >
                <span className="text-xl mb-1">💼</span>
                <span className="text-sm">Ajouter Expérience</span>
              </Button>
              <Button
                onClick={() => openCreateModal('projects')}
                className="flex flex-col items-center justify-center h-20 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-600/30"
              >
                <span className="text-xl mb-1">🎯</span>
                <span className="text-sm">Ajouter Projet</span>
              </Button>
              <Button
                onClick={() => openCreateModal('certifications')}
                className="flex flex-col items-center justify-center h-20 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 border border-yellow-600/30"
              >
                <span className="text-xl mb-1">🏆</span>
                <span className="text-sm">Ajouter Certification</span>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  // Skills section component
  const SkillsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Compétences</h2>
        <Button onClick={() => openCreateModal('skills')} variant="accent">
          Ajouter une compétence
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Années</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{skill.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{skill.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{skill.level}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{skill.years_experience}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        onClick={() => openEditModal(skill, 'skills')}
                        variant="secondary"
                        size="sm"
                      >
                        Modifier
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(skill)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  // Experiences section component
  const ExperiencesSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Expériences</h2>
        <Button onClick={() => openCreateModal('experiences')} variant="accent">
          Ajouter une expérience
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entreprise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{exp.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{exp.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{exp.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Présent'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        onClick={() => openEditModal(exp, 'experiences')}
                        variant="secondary"
                        size="sm"
                      >
                        Modifier
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(exp)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  // Projects section component
  const ProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Projets</h2>
        <Button onClick={() => openCreateModal('projects')} variant="accent">
          Ajouter un projet
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Technologies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{project.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                        project.status === 'in_progress' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {project.technologies?.slice(0, 3).join(', ')}
                      {project.technologies?.length > 3 && '...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        onClick={() => openEditModal(project, 'projects')}
                        variant="secondary"
                        size="sm"
                      >
                        Modifier
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(project)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  // Certifications section component
  const CertificationsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Certifications</h2>
        <Button onClick={() => openCreateModal('certifications')} variant="accent">
          Ajouter une certification
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Organisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date d'émission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {certifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{cert.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cert.issuing_organization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {cert.expiration_date ? new Date(cert.expiration_date).toLocaleDateString() : 'Aucune'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        onClick={() => openEditModal(cert, 'certifications')}
                        variant="secondary"
                        size="sm"
                      >
                        Modifier
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(cert)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  // Settings section component
  const SettingsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Paramètres du Site</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-white">Informations générales</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
                <input
                  type="text"
                  defaultValue="Samuel FOTSO"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Titre professionnel</label>
                <input
                  type="text"
                  defaultValue="Data Scientist & Full Stack Developer"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="temmodaryl317@gmail.com"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
                />
              </div>
              <Button variant="accent">Sauvegarder</Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-white">Configuration</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Mode sombre</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Animations 3D</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Suivi des visiteurs</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  // Form modal component
  const FormModal = () => {
    const getCurrentFields = () => {
      switch (activeSection) {
        case 'skills':
          return [
            { name: 'name', label: 'Nom', type: 'text', required: true },
            { name: 'category', label: 'Catégorie', type: 'select', options: ['programming', 'frameworks', 'databases', 'tools', 'ai_ml', 'soft_skills'], required: true },
            { name: 'level', label: 'Niveau (%)', type: 'number', min: 0, max: 100, required: true },
            { name: 'years_experience', label: 'Années d\'expérience', type: 'number', min: 0, required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
          ];
        case 'experiences':
          return [
            { name: 'title', label: 'Titre', type: 'text', required: true },
            { name: 'company', label: 'Entreprise', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['work', 'education', 'project'], required: true },
            { name: 'start_date', label: 'Date de début', type: 'date', required: true },
            { name: 'end_date', label: 'Date de fin', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'achievements', label: 'Réalisations (séparées par des virgules)', type: 'textarea' },
          ];
        case 'projects':
          return [
            { name: 'title', label: 'Titre', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['web_app', 'mobile_app', 'ai_ml', 'data_science', 'api', 'other'], required: true },
            { name: 'status', label: 'Statut', type: 'select', options: ['completed', 'in_progress', 'planned'], required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'technologies', label: 'Technologies (séparées par des virgules)', type: 'textarea' },
            { name: 'live_url', label: 'URL du projet', type: 'url' },
            { name: 'github_url', label: 'URL GitHub', type: 'url' },
          ];
        case 'certifications':
          return [
            { name: 'name', label: 'Nom', type: 'text', required: true },
            { name: 'issuing_organization', label: 'Organisation émettrice', type: 'text', required: true },
            { name: 'issue_date', label: 'Date d\'émission', type: 'date', required: true },
            { name: 'expiration_date', label: 'Date d\'expiration', type: 'date' },
            { name: 'credential_id', label: 'ID du certificat', type: 'text' },
            { name: 'credential_url', label: 'URL du certificat', type: 'url' },
            { name: 'description', label: 'Description', type: 'textarea' },
          ];
        default:
          return [];
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const fields = getCurrentFields();
      
      // Process form data
      const processedData = { ...formData };
      
      // Convert comma-separated strings to arrays
      if (processedData.technologies && typeof processedData.technologies === 'string') {
        processedData.technologies = processedData.technologies.split(',').map(tech => tech.trim());
      }
      if (processedData.achievements && typeof processedData.achievements === 'string') {
        processedData.achievements = processedData.achievements.split(',').map(achievement => achievement.trim());
      }

      if (modalType === 'create') {
        handleCreate(activeSection, processedData);
      } else if (modalType === 'edit') {
        handleUpdate(activeSection, selectedItem.id, processedData);
      }
    };

    if (modalType === 'delete') {
      return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirmer la suppression">
          <div className="p-6 bg-gray-900">
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3 justify-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDelete(activeSection, selectedItem.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      );
    }

    return (
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={`${modalType === 'create' ? 'Ajouter' : 'Modifier'} - ${menuItems.find(item => item.id === activeSection)?.label}`}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-900">
          {getCurrentFields().map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
                >
                  <option value="">Sélectionner...</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
                />
              )}
            </div>
          ))}
          <div className="flex space-x-3 justify-end pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="accent" type="submit">
              {modalType === 'create' ? 'Créer' : 'Modifier'}
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Render current section
  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'skills':
        return <SkillsSection />;
      case 'experiences':
        return <ExperiencesSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'certifications':
        return <CertificationsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
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
              <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
              <p className="text-white/60">Bienvenue, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="secondary"
                size="sm"
              >
                Voir le site
              </Button>
              <Button
                onClick={handleLogout}
                variant="secondary"
                size="sm"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen border-r border-gray-700">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderCurrentSection()}
        </div>
      </div>

      {/* Modal */}
      <FormModal />
    </div>
  );
};

export default AdminDashboard;