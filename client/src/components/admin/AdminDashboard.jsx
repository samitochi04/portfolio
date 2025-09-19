import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseAdmin } from '../../hooks/useSupabaseAdmin';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { getTableStats } = useSupabaseAdmin();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    skills: 0,
    experiences: 0,
    projects: 0,
    visitors: 0,
    chatMessages: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch statistics (call without parameters to get all stats)
      const statsData = await getTableStats();
      
      if (statsData) {
        setStats(statsData);
      }

      // Fetch recent activity (disabled until user_tracking table exists)
      // const activity = await getUserActivity();
      // setRecentActivity(activity?.slice(0, 10) || []);
      setRecentActivity([]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [getTableStats]); // Add getTableStats as dependency

  useEffect(() => {
    // Simple check - if user exists, fetch data
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]); // Only depend on user and fetchDashboardData

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
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
              <h1 className="text-2xl font-bold text-white">
                Tableau de bord
              </h1>
              <p className="text-white/60">
                Bienvenue, {user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-white/60 hover:text-white transition-colors"
              >
                Voir le site
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.skills}
            </div>
            <div className="text-white/60">Compétences</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.experiences}
            </div>
            <div className="text-white/60">Expériences</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.projects}
            </div>
            <div className="text-white/60">Projets</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.visitors}
            </div>
            <div className="text-white/60">Visiteurs</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.chatMessages}
            </div>
            <div className="text-white/60">Messages Chat</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/skills">
                <Button variant="outline" className="w-full">
                  Gérer les compétences
                </Button>
              </Link>
              <Link to="/admin/experiences">
                <Button variant="outline" className="w-full">
                  Gérer les expériences
                </Button>
              </Link>
              <Link to="/admin/projects">
                <Button variant="outline" className="w-full">
                  Gérer les projets
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full">
                  Voir les analytics
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">
              Activité récente
            </h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                    <div>
                      <p className="text-white text-sm">
                        {activity.action || 'Activité inconnue'}
                      </p>
                      <p className="text-white/60 text-xs">
                        {activity.created_at ? new Date(activity.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                      </p>
                    </div>
                    <div className="text-white/40 text-xs">
                      {activity.ip_address || 'IP inconnue'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-sm">
                  Aucune activité récente
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">
            État du système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-white/80 text-sm">Base de données</p>
              <p className="text-green-400 text-xs">Opérationnelle</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-white/80 text-sm">API</p>
              <p className="text-green-400 text-xs">Fonctionnelle</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-white/80 text-sm">Site web</p>
              <p className="text-green-400 text-xs">En ligne</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;