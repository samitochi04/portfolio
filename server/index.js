import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { generateChatbotResponse, getConversationSuggestions, loadKnowledgeBase, refreshKnowledgeBase } from './services/chatbot.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client for storing conversations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
      'http://cck88ccwg00k8c8ccwswgkss.168.231.82.151.sslip.io', // Production frontend
      process.env.CLIENT_URL
    ];
    
    // Allow any local network IP on port 5173 or 4173
    const localNetworkRegex = /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):(5173|4173)$/;
    
    // Allow Cloudflare tunnel domains (*.trycloudflare.com)
    const cloudflareRegex = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/;
    
    // Allow Vercel preview domains
    const vercelRegex = /^https:\/\/.*\.vercel\.app$/;
    
    // Allow Netlify domains
    const netlifyRegex = /^https:\/\/.*\.netlify\.app$/;
    
    // Allow sslip.io domains for deployment
    const sslipRegex = /^https?:\/\/[a-z0-9]+\.[\d.]+\.sslip\.io$/;
    
    if (allowedOrigins.includes(origin) || 
        localNetworkRegex.test(origin) || 
        cloudflareRegex.test(origin) ||
        vercelRegex.test(origin) ||
        netlifyRegex.test(origin) ||
        sslipRegex.test(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other email services
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
    }
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      return res.status(500).json({
        success: false,
        message: 'Configuration email invalide'
      });
    }

    // Email content for notification to you
    const notificationEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
      subject: `[Portfolio] Nouveau message de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">
            Nouveau message depuis votre portfolio
          </h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #555; margin-bottom: 15px;">Informations du contact :</h3>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> <a href="mailto:${email}" style="color: #0066cc;">${email}</a></p>
            <p><strong>Sujet :</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #333;">
            <h3 style="color: #555; margin-bottom: 15px;">Message :</h3>
            <p style="line-height: 1.6; color: #666;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
            <p style="margin: 0; color: #888; font-size: 12px;">
              Ce message a été envoyé depuis votre portfolio le ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      `
    };

    // Auto-reply email to the sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Merci pour votre message - Samuel FOTSO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">
            Merci pour votre message !
          </h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Merci de m'avoir contacté via mon portfolio. J'ai bien reçu votre message concernant "<strong>${subject}</strong>" et je vous répondrai dans les plus brefs délais.</p>
            <p>En attendant ma réponse, n'hésitez pas à consulter mes projets et compétences sur mon portfolio.</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #333;">
            <h3 style="color: #555; margin-bottom: 15px;">Récapitulatif de votre message :</h3>
            <p><strong>Sujet :</strong> ${subject}</p>
            <p><strong>Message :</strong></p>
            <p style="line-height: 1.6; color: #666; font-style: italic;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
            <p style="margin: 0; text-align: center;">
              <strong>Samuel FOTSO</strong><br>
              Data Scientist<br>
              <a href="mailto:${process.env.EMAIL_USER}" style="color: #0066cc;">${process.env.EMAIL_USER}</a>
            </p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
            <p style="margin: 0; color: #888; font-size: 12px;">
              Cet email a été envoyé automatiquement le ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      `
    };

    // Send notification email
    try {
      await transporter.sendMail(notificationEmailOptions);
      console.log('Notification email sent successfully');
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de notification'
      });
    }
    
    // Send auto-reply email
    try {
      await transporter.sendMail(autoReplyOptions);
      console.log('Auto-reply email sent successfully');
    } catch (emailError) {
      console.error('Error sending auto-reply email:', emailError);
      // Continue even if auto-reply fails
    }

    res.json({
      success: true,
      message: 'Message envoyé avec succès !'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    });
  }
});

// Chatbot endpoints

// Get conversation suggestions
app.get('/api/chatbot/suggestions', (req, res) => {
  try {
    const language = req.query.lang || 'fr';
    const suggestions = getConversationSuggestions(language);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des suggestions'
    });
  }
});

// Refresh chatbot knowledge base cache
app.post('/api/chatbot/refresh-cache', async (req, res) => {
  try {
    console.log('🔄 Cache refresh requested via API');
    await refreshKnowledgeBase();
    
    res.json({
      success: true,
      message: 'Cache du chatbot rafraîchi avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement du cache'
    });
  }
});

// Chat with the bot
app.post('/api/chatbot/chat', async (req, res) => {
  try {
    const { message, sessionId, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message requis'
      });
    }

    // Generate response using OpenAI
    const chatbotResult = await generateChatbotResponse(message.trim(), conversationHistory);

    if (!chatbotResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de la réponse',
        response: chatbotResult.response
      });
    }

    // Store conversation in database
    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .insert({
          session_id: sessionId || 'anonymous',
          user_message: message.trim(),
          bot_response: chatbotResult.response,
          response_time_ms: chatbotResult.responseTime,
          context: chatbotResult.context || {}
        });

      if (error) {
        console.error('Supabase error storing conversation:', error);
      } else {
        console.log('Conversation saved successfully:', data);
      }
    } catch (dbError) {
      console.error('Error storing conversation:', dbError);
      // Continue even if storing fails
    }

    res.json({
      success: true,
      response: chatbotResult.response,
      responseTime: chatbotResult.responseTime,
      usage: chatbotResult.usage
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      response: "Désolé, je rencontre des difficultés techniques. N'hésitez pas à utiliser le formulaire de contact pour joindre Samuel directement. 😊"
    });
  }
});

// Get conversation history for a session
app.get('/api/chatbot/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('user_message, bot_response, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Format conversation history
    const history = data.reverse().map(conv => [
      { role: 'user', content: conv.user_message },
      { role: 'assistant', content: conv.bot_response }
    ]).flat();

    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé'
  });
});

// Start server and load knowledge base
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service configured with: ${process.env.EMAIL_USER || 'Not configured'}`);
  
  // Load chatbot knowledge base at startup
  try {
    await loadKnowledgeBase();
  } catch (error) {
    console.error('❌ Failed to load knowledge base at startup:', error);
  }
});

export default app;