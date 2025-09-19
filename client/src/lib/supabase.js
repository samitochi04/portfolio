import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  SKILLS: 'skills',
  EXPERIENCES: 'experiences',
  PROJECTS: 'projects',
  ADMIN_USERS: 'admin_users',
  USER_TRACKING: 'user_tracking',
  CHATBOT_CONVERSATIONS: 'chatbot_conversations',
};

// Auth helpers
export const auth = {
  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const db = {
  // Generic CRUD operations
  async getAll(table) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getById(table, id) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async create(table, item) {
    const { data, error } = await supabase
      .from(table)
      .insert([item])
      .select()
      .single();
    return { data, error };
  },

  async update(table, id, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(table, id) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    return { data, error };
  },

  // Skills specific operations
  async getSkillsByCategory(category) {
    const { data, error } = await supabase
      .from(TABLES.SKILLS)
      .select('*')
      .eq('category', category)
      .order('level', { ascending: false });
    return { data, error };
  },

  // Experiences specific operations
  async getExperiencesByType(type) {
    const { data, error } = await supabase
      .from(TABLES.EXPERIENCES)
      .select('*')
      .eq('type', type)
      .order('start_date', { ascending: false });
    return { data, error };
  },

  // Projects specific operations
  async getProjectsByType(type) {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // User tracking
  async trackVisitor(data) {
    const { data: result, error } = await supabase
      .from(TABLES.USER_TRACKING)
      .insert([{
        ...data,
        timestamp: new Date().toISOString(),
      }]);
    return { data: result, error };
  },

  // Check if user is admin
  async isAdmin(userId) {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
    return { isAdmin: !!data, error };
  },
};

// Real-time subscriptions
export const realtime = {
  // Subscribe to table changes
  subscribe(table, callback) {
    return supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  },
};