// =============================================
// SAMUEL FOTSO PORTFOLIO - SUPABASE ADMIN UTILITIES
// =============================================

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic data operations
  const getData = useCallback(async (tableName, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(tableName).select('*');

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending || false });
      }

      // Apply filters
      if (options.filter) {
        const { column, value, operator = 'eq' } = options.filter;
        query = query[operator](column, value);
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const createData = useCallback(async (tableName, item) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(tableName)
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = useCallback(async (tableName, id, updates) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteData = useCallback(async (tableName, id) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin-specific operations
  const getTableStats = useCallback(async (tableName) => {
    try {
      // If specific table is requested
      if (tableName) {
        // Skip non-existent tables
        if (tableName === 'user_tracking' || tableName === 'chatbot_conversations') {
          return 0;
        }
        
        const { count, error } = await supabase
          .from(tableName)
          .select('id', { count: 'exact', head: true });
        
        if (error) {
          console.error(`Error getting ${tableName} count:`, error);
          return 0;
        }
        
        return count || 0;
      }

      // Return all stats as object
      const [skills, experiences, projects] = await Promise.all([
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('experiences').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true })
      ]);

      return {
        skills: skills.count || 0,
        experiences: experiences.count || 0,
        projects: projects.count || 0,
        visitors: 0, // No user_tracking table yet
        chatMessages: 0 // No chatbot_conversations table yet
      };
    } catch (err) {
      setError(err);
      return {
        skills: 0,
        experiences: 0,
        projects: 0,
        visitors: 0,
        chatMessages: 0
      };
    }
  }, []);

  const getUserActivity = useCallback(async (limit = 10) => {
    try {
      // Return empty array until user_tracking table is created
      console.log('getUserActivity: user_tracking table not implemented yet');
      return [];
      
      // TODO: Uncomment when user_tracking table is created
      // const { data, error } = await supabase
      //   .from('user_tracking')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      //   .limit(limit);

      // if (error) throw error;
      // return data || [];
    } catch (err) {
      console.error('Error in getUserActivity:', err);
      return [];
    }
  }, []);

  return {
    loading,
    error,
    getData,
    createData,
    updateData,
    deleteData,
    getTableStats,
    getUserActivity,
  };
};

export default useSupabaseAdmin;