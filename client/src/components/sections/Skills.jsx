import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui';
import { Scene, SkillElements } from '../three';
import { SKILLS_CATEGORIES } from '../../lib/constants';
import { useSupabaseAdmin } from '../../hooks';

const Skills = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getData } = useSupabaseAdmin();

  const categories = Object.values(SKILLS_CATEGORIES);
  
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  // Fetch skills from Supabase
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const { data, error } = await getData('skills', {
          orderBy: 'display_order',
          ascending: true
        });
        
        if (error) {
          console.error('Error fetching skills:', error);
          return;
        }
        
        setSkills(data || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [getData]);

  const getSkillsByCategory = (category) => {
    return skills.filter(skill => skill.category === category);
  };

  // Convert level to star rating
  const getStarRating = (level) => {
    if (level <= 20) return 1;
    if (level <= 40) return 2;
    if (level <= 60) return 3;
    if (level <= 80) return 4;
    return 5;
  };

  // Render stars based on rating
  const renderStars = (rating, level) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="skills" className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
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
    <section id="skills" className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* 3D Skills Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Scene camera={{ position: [0, 0, 15] }}>
          <SkillElements skills={filteredSkills} visible={true} />
        </Scene>
      </div>

      <div className="relative z-20 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('skills.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-black text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Toutes
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {t(`skills.categories.${category}`)}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const categorySkills = getSkillsByCategory(category);
            if (selectedCategory && selectedCategory !== category) return null;
            
            return (
              <Card 
                key={category} 
                className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
                hover
              >
                <Card.Header>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t(`skills.categories.${category}`)}
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => {
                      const starRating = getStarRating(skill.level);
                      return (
                        <div key={skill.id} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800">{skill.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            {renderStars(starRating, skill.level)}
                            {skill.years_experience > 0 && (
                              <span className="text-xs text-gray-500">
                                {skill.years_experience} {skill.years_experience === 1 ? 'year' : 'years'}
                              </span>
                            )}
                          </div>
                          {skill.description && (
                            <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* Skills Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{skills.length}</div>
              <div className="text-sm text-gray-600">Technologies</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Catégories</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">3+</div>
              <div className="text-sm text-gray-600">{t('skills.years')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;