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
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${skill.level}%`,
                              transform: selectedCategory === category || selectedCategory === null ? 'translateX(0)' : 'translateX(-100%)'
                            }}
                          />
                        </div>
                      </div>
                    ))}
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