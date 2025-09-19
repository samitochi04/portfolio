# 🔐 Administration System

This document describes the admin system for Samuel FOTSO's portfolio, including database setup, content management, and analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Database Setup](#database-setup)
- [Admin Features](#admin-features)
- [User Guide](#user-guide)
- [API Reference](#api-reference)
- [Security](#security)

## 🎯 Overview

The admin system provides a complete content management solution with:

- **Authentication & Authorization**: Secure login with role-based access
- **Content Management**: CRUD operations for skills, experiences, and projects
- **Analytics**: Visitor tracking and engagement metrics
- **Real-time Updates**: Live data synchronization
- **Responsive Interface**: Mobile-friendly admin dashboard

## 🗄️ Database Setup

### Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Environment Variables**: Set up your `.env` file in the `client` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Schema Installation

1. **Run Setup Script** (Windows PowerShell):
   ```powershell
   .\setup-database.ps1
   ```

2. **Manual Setup**:
   - Copy contents of `server/scripts/supabase-setup.sql`
   - Paste in Supabase SQL Editor
   - Execute the script

### Data Seeding

Populate with sample data:

```bash
cd server
npm install @supabase/supabase-js
node scripts/seed-data.js
```

## ⚡ Admin Features

### 🔑 Authentication

- **Secure Login**: Email/password authentication
- **Role-Based Access**: Admin and super admin roles
- **Session Management**: Automatic token refresh
- **Protected Routes**: Admin-only access control

### 📊 Dashboard

- **Quick Stats**: Overview of content counts
- **Recent Activity**: Latest visitor interactions
- **System Status**: Health monitoring
- **Quick Actions**: Direct links to management pages

### 🛠️ Content Management

#### Skills Manager (`/admin/skills`)
- Create, edit, delete skills
- Categorization (Programming, Frameworks, AI/ML, etc.)
- Skill levels and experience years
- Featured skills highlighting
- Display order management

#### Experiences Manager (`/admin/experiences`)
- Professional experience tracking
- Education and certifications
- Rich descriptions and achievements
- Technology stack tagging
- Timeline organization

#### Projects Manager (`/admin/projects`)
- Project portfolio management
- Type categorization (Web App, AI/ML, API, etc.)
- Feature lists and descriptions
- Live demo and GitHub links
- Status tracking (Planning, In Progress, Completed)

### 📈 Analytics & Tracking

- **Visitor Tracking**: Automatic visitor data collection
- **Privacy-Friendly**: No personal data collection
- **Engagement Metrics**: Scroll depth, time on page
- **Device Analytics**: Browser, OS, device type detection
- **Geographic Insights**: Timezone-based location approximation

## 📖 User Guide

### Accessing Admin Panel

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access dashboard at `/admin/dashboard`

### Managing Skills

1. Go to **Skills Manager**
2. Click **"Nouvelle compétence"** to add
3. Fill in skill details:
   - Name and category
   - Skill level (0-100%)
   - Years of experience
   - Description
   - Featured status
4. Save changes

### Managing Experiences

1. Access **Experiences Manager**
2. Add new experience with:
   - Title and company
   - Experience type (Work, Education, etc.)
   - Date range
   - Detailed description
   - Achievements list
   - Technology stack
5. Organize by display order

### Managing Projects

1. Open **Projects Manager**
2. Create project entries:
   - Project title and type
   - Short and detailed descriptions
   - Feature lists
   - Technology stack
   - Demo and repository links
   - Project status and timeline

### Viewing Analytics

1. Check dashboard for overview
2. Review visitor statistics
3. Monitor engagement patterns
4. Track content performance

## 🔌 API Reference

### Authentication Endpoints

```javascript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'password'
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### Data Operations

```javascript
// Get all skills
const skills = await getData('skills', {
  orderBy: 'display_order',
  ascending: true
});

// Create new skill
const newSkill = await createData('skills', {
  name: 'React',
  category: 'frameworks',
  level: 90,
  years_experience: 3
});

// Update skill
const updatedSkill = await updateData('skills', skillId, {
  level: 95
});

// Delete skill
await deleteData('skills', skillId);
```

### Analytics

```javascript
// Get table statistics
const skillsCount = await getTableStats('skills');

// Get recent activity
const recentActivity = await getUserActivity(10);
```

## 🔒 Security

### Authentication Security

- **JWT Tokens**: Secure token-based authentication
- **Row Level Security (RLS)**: Database-level access control
- **Admin Role Validation**: Server-side permission checks
- **Session Management**: Automatic token refresh and logout

### Data Protection

- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token validation
- **Rate Limiting**: Request throttling

### Privacy Compliance

- **No Personal Data**: Only technical visitor information
- **Anonymized Tracking**: IP addresses not stored
- **Transparent Collection**: Clear data usage
- **Minimal Data**: Only necessary information collected

### Database Security

```sql
-- Example RLS policy
CREATE POLICY "Admin users can manage skills" ON skills
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users 
      WHERE is_active = true
    )
  );
```

### Best Practices

1. **Strong Passwords**: Enforce complex admin passwords
2. **Regular Updates**: Keep dependencies current
3. **Access Logging**: Monitor admin actions
4. **Backup Strategy**: Regular database backups
5. **Environment Security**: Secure environment variables

## 🚀 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access admin panel
# http://localhost:5173/admin/login
```

### Environment Setup

```env
# Development environment
VITE_SUPABASE_URL=your_dev_supabase_url
VITE_SUPABASE_ANON_KEY=your_dev_anon_key

# Production environment
VITE_SUPABASE_URL=your_prod_supabase_url
VITE_SUPABASE_ANON_KEY=your_prod_anon_key
```

### Deployment

1. Build the application
2. Deploy to your hosting platform
3. Set production environment variables
4. Run database migrations
5. Create admin user accounts

---

## 📞 Support

For technical support or questions about the admin system:

- **Email**: samuel.fotso@example.com
- **Documentation**: Check README files
- **Issues**: Create GitHub issues for bugs

---

*This admin system is designed to be secure, user-friendly, and scalable for managing a professional portfolio website.*