import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabase = (table, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    realTime = false,
    filter = null,
    orderBy = 'created_at',
    ascending = false,
  } = options;

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select('*');

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }

      // Apply filters
      if (filter) {
        const { column, value, operator = 'eq' } = filter;
        query = query[operator](column, value);
      }

      const { data: result, error } = await query;

      if (error) {
        throw error;
      }

      setData(result || []);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Create new item
  const create = async (item) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh data
      await fetchData();
      return { success: true, data: result };
    } catch (err) {
      console.error(`Error creating ${table} item:`, err);
      return { success: false, error: err };
    }
  };

  // Update item
  const update = async (id, updates) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh data
      await fetchData();
      return { success: true, data: result };
    } catch (err) {
      console.error(`Error updating ${table} item:`, err);
      return { success: false, error: err };
    }
  };

  // Delete item
  const remove = async (id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh data
      await fetchData();
      return { success: true };
    } catch (err) {
      console.error(`Error deleting ${table} item:`, err);
      return { success: false, error: err };
    }
  };

  // Get item by ID
  const getById = async (id) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data: result };
    } catch (err) {
      console.error(`Error fetching ${table} item by ID:`, err);
      return { success: false, error: err };
    }
  };

  // Refresh data
  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription if enabled
    let subscription;
    if (realTime) {
      subscription = supabase
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: table 
          }, 
          (payload) => {
            console.log('Real-time update:', payload);
            fetchData(); // Refresh data on any change
          }
        )
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, JSON.stringify(filter)]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    getById,
    refresh,
  };
};