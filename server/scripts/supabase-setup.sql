-- =============================================
-- SAMUEL FOTSO PORTFOLIO DATABASE SCHEMA
-- =============================================
-- This script creates all necessary tables for the portfolio
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- =============================================
-- 1. SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('programming', 'frameworks', 'databases', 'tools', 'ai_ml', 'soft_skills')),
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    years_experience INTEGER DEFAULT 0,
    description TEXT,
    icon_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. EXPERIENCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('work', 'education', 'project', 'certification')),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT NOT NULL,
    achievements TEXT[],
    technologies TEXT[],
    location VARCHAR(200),
    company_url TEXT,
    is_current BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('web_app', 'mobile_app', 'ai_ml', 'data_science', 'api', 'other')),
    technologies TEXT[] NOT NULL,
    features TEXT[],
    live_url TEXT,
    github_url TEXT,
    demo_url TEXT,
    image_urls TEXT[],
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. ADMIN USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(200),
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. USER TRACKING TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    page_visited VARCHAR(255),
    referrer TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0,
    actions JSONB DEFAULT '[]'::jsonb
);

-- =============================================
-- 6. CHATBOT CONVERSATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    response_time_ms INTEGER,
    user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON public.skills(is_featured);
CREATE INDEX IF NOT EXISTS idx_experiences_type ON public.experiences(type);
CREATE INDEX IF NOT EXISTS idx_experiences_current ON public.experiences(is_current);
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_user_tracking_timestamp ON public.user_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_tracking_session ON public.user_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_session ON public.chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_timestamp ON public.chatbot_conversations(created_at);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Skills: Public read, admin write
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Skills are editable by admin users" ON public.skills FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Experiences: Public read, admin write
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Experiences are viewable by everyone" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Experiences are editable by admin users" ON public.experiences FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Projects: Public read, admin write
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Projects are editable by admin users" ON public.projects FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Admin users: Special handling to avoid recursion
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- Allow authenticated users to read their own admin record
CREATE POLICY "Users can view their own admin record" ON public.admin_users FOR SELECT USING (
    auth.uid() = user_id
);
-- Allow service role to manage admin users (for admin operations)
CREATE POLICY "Service role can manage admin users" ON public.admin_users FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- User tracking: Insert only, admin read
ALTER TABLE public.user_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User tracking allows insert for everyone" ON public.user_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "User tracking is viewable by admin users only" ON public.user_tracking FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Chatbot conversations: Insert for everyone, admin read
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chatbot conversations allow insert for everyone" ON public.chatbot_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Chatbot conversations are viewable by admin users only" ON public.chatbot_conversations FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Site settings: Public read for public settings, admin write
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "All site settings are viewable by admin users" ON public.site_settings FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);
CREATE POLICY "Site settings are editable by admin users" ON public.site_settings FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = user_uuid AND is_active = true
    );
END;
$$;

-- Function to get portfolio stats
CREATE OR REPLACE FUNCTION get_portfolio_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'skills_count', (SELECT COUNT(*) FROM public.skills),
        'experiences_count', (SELECT COUNT(*) FROM public.experiences),
        'projects_count', (SELECT COUNT(*) FROM public.projects),
        'featured_projects_count', (SELECT COUNT(*) FROM public.projects WHERE is_featured = true),
        'total_visitors', (SELECT COUNT(DISTINCT session_id) FROM public.user_tracking),
        'total_page_views', (SELECT COUNT(*) FROM public.user_tracking),
        'chatbot_conversations', (SELECT COUNT(*) FROM public.chatbot_conversations)
    ) INTO result;
    
    RETURN result;
END;
$$;

-- =============================================
-- INITIAL DATA INSERTION
-- =============================================
-- This will be handled by the seed-data.js script