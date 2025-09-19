# PORTFOLIO DEVELOPMENT RULES

## 🎯 PROJECT MISSION
Create a stunning, professional 3D portfolio for Samuel FOTSO that will impress recruiters and showcase his skills as a Data Scientist and Full Stack Developer.

## 🚨 CRITICAL RULES - NEVER BREAK THESE

### 1. CODE PRESERVATION
- **NEVER delete or break existing code**
- **ALWAYS preserve** the current Header.jsx functionality
- **ALWAYS preserve** the existing i18n structure and translations
- **ALWAYS preserve** the current file structure unless explicitly adding new files
- Before modifying any existing file, read it completely to understand its current state

### 2. FILE STRUCTURE INTEGRITY
- **RESPECT the file structure** defined in TODO.md
- **NO files should be deleted** from the current structure
- **ONLY ADD** new files as specified in the TODO.md
- **MAINTAIN** the existing folder hierarchy
- When creating new files, follow the established naming conventions

### 3. TRANSLATION SYSTEM RULES
- **French is the PRIMARY language** (default)
- **Maintain support** for English (en) and German (de)
- **Keep translation.json files clean** and well-structured
- **Use existing translation keys** where possible
- **Add new translations** for all new content in all 3 languages
- **NEVER remove** existing translation keys

### 4. DESIGN & STYLING CONSISTENCY
- **Primary colors**: Black & White (like existing Header)
- **Accent colors**: Choose colors that complement B&W theme and maintain consistency
- **Use Tailwind CSS** for styling (already configured)
- **Maintain responsive design** across all components
- **Follow existing Header styling** patterns for consistency

## 🎨 DESIGN GUIDELINES

### Color Palette
- **Primary**: Black (#000000), White (#ffffff)
- **Accent Options**: 
  - Electric Blue (#0066ff) - for tech/AI feel
  - Emerald (#10b981) - for success states
  - Purple (#8b5cf6) - for interactive elements
  - Gray scales (#f8fafc to #1e293b) - for backgrounds and text

### Typography
- **Use existing Tailwind typography** utilities
- **Maintain readability** with proper contrast
- **Keep font hierarchy** consistent across sections

### Animation Principles
- **Smooth transitions** (300ms default)
- **Purposeful animations** that enhance UX
- **Performance-first** approach for 3D elements
- **Respect user accessibility** (prefers-reduced-motion)

## 🔧 TECHNICAL STANDARDS

### React Component Rules
- **Use functional components** with hooks
- **Implement proper prop validation** where needed
- **Keep components focused** on single responsibilities
- **Use consistent naming**: PascalCase for components
- **Export default** for main components, named exports for utilities

### 3D Implementation Standards
- **Use React Three Fiber** for React integration
- **Optimize performance** with proper disposal of geometries/materials
- **Implement LOD** (Level of Detail) where applicable
- **Test on various devices** for performance
- **Provide fallbacks** for devices that can't handle 3D

### State Management
- **Use React hooks** for local state
- **Implement custom hooks** for complex logic
- **Keep state as local as possible**
- **Use context only when necessary** (auth, theme, language)

### API Integration Rules
- **Use Supabase client** for all database operations
- **Implement proper error handling** for all API calls
- **Add loading states** for all async operations
- **Secure admin routes** with proper authentication
- **Never expose sensitive API keys** in frontend code

## 🔒 SECURITY REQUIREMENTS

### Authentication
- **Protect admin routes** with proper authentication
- **Use Supabase Auth** for user management
- **Implement role-based access** (admin vs visitor)
- **Store tokens securely** (httpOnly cookies when possible)

### Data Protection
- **Validate all inputs** on frontend and backend
- **Sanitize user-generated content**
- **Implement rate limiting** for chatbot and contact forms
- **Log security events** appropriately

## 📱 ACCESSIBILITY STANDARDS

### WCAG Compliance
- **Maintain proper color contrast** ratios
- **Provide alt text** for images and 3D elements
- **Ensure keyboard navigation** works everywhere
- **Support screen readers** with proper ARIA labels
- **Respect reduced motion preferences**

### Mobile Responsiveness
- **Mobile-first approach** for all components
- **Test on various screen sizes** (320px to 4k)
- **Optimize 3D performance** for mobile devices
- **Provide touch-friendly interactions**

## 🎯 FEATURE-SPECIFIC RULES

### 3D Elements
- **Performance is critical** - always test on lower-end devices
- **Provide graceful degradation** for unsupported browsers
- **Use proper lighting** for visual appeal
- **Implement proper camera controls** for user interaction

### Voice Feature
- **User must be able to control** audio playback
- **Provide visual feedback** when audio is playing
- **Support multiple audio formats** for browser compatibility
- **Implement volume controls**

### Chatbot
- **No memory between sessions** (as specified)
- **Clean, modern UI** that fits the overall design
- **Proper error handling** for API failures
- **Typing indicators** for better UX

### Admin Dashboard
- **NEVER expose admin routes** in main navigation
- **Require authentication** for all admin functions
- **Provide CRUD operations** for all content types
- **Include data validation** for all forms

## 🚀 PERFORMANCE REQUIREMENTS

### Loading Performance
- **Lazy load** all 3D components
- **Optimize images** (WebP format when possible)
- **Minimize bundle size** with proper code splitting
- **Implement service worker** for caching (future enhancement)

### 3D Performance
- **Target 60fps** on desktop, 30fps on mobile
- **Use instancing** for repeated geometries
- **Implement frustum culling** for complex scenes
- **Monitor memory usage** and dispose unused resources

## 📊 CONTENT MANAGEMENT RULES

### Data Structure
- **Keep data normalized** in Supabase tables
- **Use proper relationships** between entities
- **Implement soft deletes** for important data
- **Maintain audit logs** for admin actions

### Content Quality
- **All content must be professional** and error-free
- **Images must be optimized** for web
- **Maintain consistent tone** across all languages
- **Regular content updates** through admin interface

## 🧪 TESTING STANDARDS

### Manual Testing Checklist
- [ ] **Test on multiple browsers** (Chrome, Firefox, Safari, Edge)
- [ ] **Test on multiple devices** (desktop, tablet, mobile)
- [ ] **Test all 3D interactions** and animations
- [ ] **Test language switching** functionality
- [ ] **Test admin authentication** and CRUD operations
- [ ] **Test voice feature** on different browsers
- [ ] **Test chatbot interface** and error states

### Performance Testing
- [ ] **Lighthouse score** above 90 for performance
- [ ] **3D frame rate** testing on various devices
- [ ] **Bundle size** optimization verification
- [ ] **Loading time** optimization verification

## 📝 DOCUMENTATION REQUIREMENTS

### Code Documentation
- **Comment complex logic** and 3D implementations
- **Document all custom hooks** with JSDoc
- **Maintain updated README** files
- **Document API endpoints** and data structures

### User Documentation
- **Create user guide** for admin interface
- **Document keyboard shortcuts** and interactions
- **Provide troubleshooting guide** for common issues

## 🔄 MAINTENANCE STANDARDS

### Code Quality
- **Run ESLint** before all commits
- **Follow consistent formatting** (Prettier recommended)
- **Keep dependencies updated** (security patches)
- **Regular code reviews** and refactoring

### Backup & Recovery
- **Regular database backups** through Supabase
- **Version control** for all code changes
- **Environment configuration** properly documented

---

## ⚡ QUICK REFERENCE

### Before Starting Any Task:
1. Read the current code to understand existing implementation
2. Check TODO.md for the specific file structure requirements
3. Verify no existing functionality will be broken
4. Plan the implementation without deleting existing code

### Before Committing:
1. Test the new feature thoroughly
2. Verify all existing features still work
3. Check translation files are updated
4. Run lint and fix any issues
5. Update TODO.md progress

### Emergency Contacts:
- **Original Developer**: Samuel FOTSO
- **Key Technologies**: React, Three.js, Tailwind CSS, Supabase, i18next

---

**Remember: The goal is to ENHANCE the existing portfolio, not rebuild it. Every addition should make it more impressive while preserving what already works.**