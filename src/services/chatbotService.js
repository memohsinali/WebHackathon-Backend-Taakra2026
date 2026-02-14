// CHATBOT SERVICE - CURRENTLY DISABLED
// Uncomment this code when you want to enable AI chatbot functionality

/*
import axios from 'axios';
import logger from '../config/logger.js';

class ChatbotService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async getResponse(message) {
    try {
      if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
        // Return placeholder response if API key not configured
        return this.getPlaceholderResponse(message);
      }

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant for Taakra, a competition management platform. Help users with questions about competitions, registrations, and event details.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error('Chatbot service error:', error.message);
      return this.getPlaceholderResponse(message);
    }
  }

  getPlaceholderResponse(message) {
    // Placeholder responses for common queries
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! Welcome to Taakra. How can I help you today? You can ask me about competitions, registrations, or any event-related questions.';
    }

    if (lowerMessage.includes('competition')) {
      return 'Taakra hosts various competitions across different categories. You can browse all competitions, filter by category, and register for the ones that interest you. Would you like to know more about a specific competition?';
    }

    if (lowerMessage.includes('register')) {
      return 'To register for a competition, simply browse the competitions page, find the event you want to participate in, and click the register button. You need to be logged in to register.';
    }

    if (lowerMessage.includes('schedule') || lowerMessage.includes('date')) {
      return 'Taakra runs from February 11-15, 2026. You can view the complete schedule in the calendar view, which shows all competitions organized by day.';
    }

    if (lowerMessage.includes('category')) {
      return 'We have competitions in various categories including Arts, Sports, Technology, Literary, and more. You can filter competitions by category to find events that match your interests.';
    }

    // Default response
    return 'Thank you for your message! I\'m here to help with questions about Taakra competitions, registrations, and events. Feel free to ask me anything about our platform. (Note: AI chatbot requires OpenAI API key configuration for advanced responses)';
  }
}

export default new ChatbotService();
*/

// Temporary placeholder export while chatbot is disabled
export default {
  getResponse: async () => {
    return 'Chatbot service is currently disabled. Please contact support for assistance.';
  }
};
