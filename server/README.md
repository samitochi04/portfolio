# Portfolio Backend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Gmail account (for email functionality)
- OpenAI API key (for chatbot)

### 1. Environment Setup

Copy the example environment file and configure it:
```bash
cd server
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
NOTIFICATION_EMAIL=your-email@gmail.com

# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
```

### 2. Gmail Setup for Email Functionality

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an App Password for "Mail"
4. Use this App Password as `EMAIL_APP_PASSWORD` in your .env file

### 3. Database Setup

Run the database schema in your Supabase SQL editor:
```bash
npm run setup-db
```

Or manually execute the SQL file: `scripts/supabase-setup.sql`

### 4. Seed Data

Populate the database with sample data:
```bash
# Seed all data (skills, experiences, projects)
npm run seed

# Seed certifications specifically
npm run seed-certif
```

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:3001`

## 📁 Project Structure

```
server/
├── services/
│   └── chatbot.js          # OpenAI chatbot service with knowledge base
├── scripts/
│   ├── supabase-setup.sql  # Database schema with certifications table
│   ├── seed-data.js        # General data seeding script
│   └── data-certif.js      # Certifications seeding script
├── index.js                # Main server entry point
├── package.json
├── .env.example           # Environment variables template
└── README.md
```

## 🛠 API Endpoints

### Health Check
- `GET /api/health` - Server status check

### Contact Form
- `POST /api/contact` - Send contact form emails
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "Hello, I'm interested in your services..."
  }
  ```

### Chatbot
- `GET /api/chatbot/suggestions?lang=fr` - Get conversation suggestions
- `POST /api/chatbot/chat` - Chat with AI assistant
  ```json
  {
    "message": "What are Samuel's skills?",
    "sessionId": "session_123",
    "conversationHistory": []
  }
  ```
- `GET /api/chatbot/history/:sessionId` - Get conversation history

## 🗄 Database Schema

### New Features Added:

#### Certifications Table
- `id` - UUID primary key
- `name` - Certification name
- `issuing_organization` - Organization that issued the certification
- `issue_date` - Date when certification was issued
- `expiration_date` - Expiration date (nullable for non-expiring certs)
- `credential_id` - Unique credential identifier
- `credential_url` - URL to verify the certification
- `certificate_url` - URL to the certificate document
- `description` - Detailed description
- `skills` - Array of related skills
- `is_featured` - Boolean for highlighting important certifications
- `display_order` - For sorting certifications

#### Updated Experience Types
The `EXPERIENCE_TYPES` constant now includes:
- `WORK` - Professional work experience
- `EDUCATION` - Educational background
- `CERTIFICATION` - Professional certifications

**Note:** `PROJECT` type was removed from experiences since projects have their own dedicated section.

## 🤖 AI Chatbot Features

### Knowledge Base Includes:
- **Personal Information**: Contact details, languages, location
- **Skills**: Programming languages, frameworks, databases, tools with experience levels
- **Work Experience**: Professional roles, achievements, technologies used
- **Education**: Academic background and qualifications
- **Certifications**: Professional certifications with verification links
- **Projects**: Portfolio projects with technologies and impact
- **Interests**: Professional interests and specializations

### Capabilities:
- Context-aware conversations
- Multilingual support (French, English, German)
- Conversation history tracking
- Response time optimization
- Fallback responses for technical issues

### Example Interactions:
- "What are Samuel's skills in Python?"
- "Tell me about his certifications"
- "What projects has he worked on?"
- "How can I contact him?"

## 📧 Email Functionality

### Features:
- **Contact Form Processing**: Validates and processes contact form submissions
- **Dual Email System**: 
  - Notification email sent to portfolio owner
  - Auto-reply confirmation sent to the sender
- **HTML Templates**: Professional email templates with branding
- **Validation**: Email format validation and required field checks

### Email Templates Include:
- Portfolio branding
- Contact information summary
- Message preview
- Timestamp and metadata
- Professional styling

## 🔧 Frontend Integration

### Environment Variables for Client
Add to your client `.env` file:
```env
VITE_API_URL=http://localhost:3001
```

### Components Updated:
1. **Experience Component**: Now fetches and displays certifications alongside work experience and education
2. **Contact Form**: Integrated with backend email API
3. **Chatbot**: Fully integrated with OpenAI backend service

## 🚨 Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Verify Gmail App Password is correct
   - Check 2FA is enabled on Google account
   - Ensure EMAIL_USER and EMAIL_APP_PASSWORD are set

2. **Chatbot not responding**:
   - Verify OpenAI API key is valid and has credits
   - Check network connectivity
   - Review server logs for error details

3. **Database connection issues**:
   - Verify Supabase URL and service key
   - Check RLS policies are correctly set
   - Ensure tables are created using the schema

4. **CORS errors**:
   - Verify CLIENT_URL matches your frontend URL
   - Check if frontend is running on the specified port

### Debug Mode:
Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 🔐 Security Features

- **Row Level Security (RLS)**: Implemented on all Supabase tables
- **Input Validation**: All API endpoints validate input data
- **CORS Protection**: Configured for specific client origins
- **Environment Variables**: Sensitive data stored in environment variables
- **Rate Limiting**: Consider implementing for production use

## 📈 Performance Optimizations

- **Database Indexing**: Optimized indexes for common queries
- **Connection Pooling**: Efficient database connection management
- **Response Caching**: Consider implementing Redis for production
- **Error Handling**: Comprehensive error handling and logging

## 🌍 Deployment Considerations

### Production Checklist:
- [ ] Update CLIENT_URL for production domain
- [ ] Configure production database
- [ ] Set up email service for production
- [ ] Implement rate limiting
- [ ] Add monitoring and logging
- [ ] Configure SSL/HTTPS
- [ ] Set up backup strategies

### Recommended Platforms:
- **Server**: Railway, Render, Heroku
- **Database**: Supabase (already configured)
- **Email**: Gmail or professional email service
- **Monitoring**: Sentry, LogRocket, or similar

---

## 🎉 Success!

Your portfolio backend is now fully configured with:
✅ Email functionality with nodemailer
✅ AI chatbot with OpenAI integration
✅ Certifications management system
✅ Updated database schema
✅ Complete API endpoints
✅ Professional error handling

The system is ready for both development and production use!