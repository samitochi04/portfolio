-- =============================================
-- FIX RLS POLICIES - REMOVE INFINITE RECURSION
-- =============================================
-- This script fixes the Row Level Security policies that caused infinite recursion
-- Run this in your Supabase SQL editor

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Skills are editable by admin users" ON public.skills;
DROP POLICY IF EXISTS "Experiences are editable by admin users" ON public.experiences;
DROP POLICY IF EXISTS "Projects are editable by admin users" ON public.projects;
DROP POLICY IF EXISTS "Admin users are viewable by admin users only" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users are editable by admin users only" ON public.admin_users;
DROP POLICY IF EXISTS "User tracking is viewable by admin users only" ON public.user_tracking;
DROP POLICY IF EXISTS "Chatbot conversations are viewable by admin users only" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "All site settings are viewable by admin users" ON public.site_settings;
DROP POLICY IF EXISTS "Site settings are editable by admin users" ON public.site_settings;

-- Create new policies without recursion
-- Skills: Public read, admin write
CREATE POLICY "Skills are editable by admin users" ON public.skills FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Experiences: Public read, admin write
CREATE POLICY "Experiences are editable by admin users" ON public.experiences FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Projects: Public read, admin write
CREATE POLICY "Projects are editable by admin users" ON public.projects FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Admin users: Special handling to avoid recursion
-- Allow authenticated users to read their own admin record
CREATE POLICY "Users can view their own admin record" ON public.admin_users FOR SELECT USING (
    auth.uid() = user_id
);
-- Allow service role to manage admin users (for admin operations)
CREATE POLICY "Service role can manage admin users" ON public.admin_users FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- User tracking: Insert only, admin read
CREATE POLICY "User tracking is viewable by admin users only" ON public.user_tracking FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Chatbot conversations: Insert for everyone, admin read
CREATE POLICY "Chatbot conversations are viewable by admin users only" ON public.chatbot_conversations FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Site settings: Public read for public settings, admin write
CREATE POLICY "All site settings are viewable by admin users" ON public.site_settings FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);
CREATE POLICY "Site settings are editable by admin users" ON public.site_settings FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- =============================================
-- ALTERNATIVE: SIMPLER APPROACH - DISABLE RLS FOR PORTFOLIO DATA
-- =============================================
-- If the above still causes issues, you can temporarily disable RLS 
-- for the main portfolio tables since they're read-only for the public

-- Uncomment these lines if you want to disable RLS completely for portfolio data:
-- ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled only for sensitive tables:
-- ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_tracking ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;