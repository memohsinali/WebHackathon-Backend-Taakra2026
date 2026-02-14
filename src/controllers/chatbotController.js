import asyncHandler from 'express-async-handler';
import Competition from '../models/Competition.js';

// Simple rule-based response generator
function generateResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('register') || lower.includes('registration') || lower.includes('sign up')) {
    return "To register for a competition:\n1. Browse competitions at /competitions\n2. Click on a competition you're interested in\n3. Click 'Register Now'\n4. Your registration will be pending admin approval\n\nYou need to be logged in to register.";
  }
  if (lower.includes('find') || lower.includes('search') || lower.includes('competition') || lower.includes('event')) {
    return "You can browse all competitions at the Competitions page. Use the search bar to find competitions by name, or filter by category (Technical, Cultural, Sports, Academic, Workshop). You can also sort by trending, most registrations, or newest.";
  }
  if (lower.includes('trending') || lower.includes('popular') || lower.includes('top')) {
    return "Check out the Competitions page sorted by 'Most Registrations' to see the most popular events. The LandingPage also shows featured and trending competitions.";
  }
  if (lower.includes('calendar') || lower.includes('schedule') || lower.includes('upcoming') || lower.includes('date')) {
    return "View the Event Calendar at /calendar to see all upcoming competitions on a monthly calendar. You can switch to Agenda view to see a chronological list of events.";
  }
  if (lower.includes('status') || lower.includes('approved') || lower.includes('pending')) {
    return "Check your registration status in your Dashboard under 'My Registrations'. Registrations can be Pending (waiting for approval), Approved, or Rejected.";
  }
  if (lower.includes('login') || lower.includes('account') || lower.includes('password') || lower.includes('forgot')) {
    return "To login, visit /login. If you forgot your password, use the 'Forgot Password' link on the login page. For new accounts, register at /signup.";
  }
  if (lower.includes('contact') || lower.includes('support') || lower.includes('help') || lower.includes('chat')) {
    return "For live support, use the Chat feature at /chat to message our support team directly. We're available to help with any questions about competitions or registrations.";
  }
  if (lower.includes('category') || lower.includes('technical') || lower.includes('cultural') || lower.includes('sports') || lower.includes('academic') || lower.includes('workshop')) {
    return "We have competitions in the following categories:\n• Technical - Hackathons, coding, web development\n• Cultural - Dance, music, arts\n• Sports - Football, basketball, athletics\n• Academic - Research presentations, quizzes\n• Workshop - Hands-on learning events\n\nFilter by category on the Competitions page.";
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('greet')) {
    return "Hello! I'm the Taakra AI Assistant. I can help you find competitions, understand the registration process, check schedules, and more. What would you like to know?";
  }
  if (lower.includes('thank')) {
    return "You're welcome! Feel free to ask if you need any more help with competitions or events at Taakra.";
  }

  return "I can help you with:\n\n• Finding competitions and events\n• Registration process and status\n• Event calendar and schedules\n• Category information\n• Account and login help\n• Contacting support\n\nWhat would you like to know more about?";
}

// @desc    Get chatbot response
// @route   POST /api/chatbot
// @access  Public
export const getChatbotResponse = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const response = generateResponse(message.trim());

  res.json({
    success: true,
    data: { message: response },
  });
});
