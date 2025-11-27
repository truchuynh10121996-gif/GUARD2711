const { getGeminiModel, SYSTEM_PROMPT } = require('../config/gemini');
const Scenario = require('../models/Scenario');

// Detect language from text
const detectLanguage = (text) => {
  // Vietnamese detection
  const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  if (vietnameseChars.test(text)) return 'vi';

  // Khmer detection
  const khmerChars = /[\u1780-\u17FF]/;
  if (khmerChars.test(text)) return 'km';

  // Default to English
  return 'en';
};

// Get relevant scenarios from database
const getRelevantScenarios = async (userMessage, language) => {
  try {
    const scenarios = await Scenario.find({
      language: language,
      isActive: true
    }).limit(5);

    return scenarios;
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return [];
  }
};

// Analyze fraud risk
const analyzeFraudRisk = (response) => {
  const lowerResponse = response.toLowerCase();
  const dangerKeywords = ['lừa đảo', 'scam', 'fraud', 'danger', 'nguy hiểm', 'cảnh báo nghiêm trọng'];
  const warningKeywords = ['cẩn thận', 'warning', 'caution', 'careful', 'chú ý'];

  let isFraud = false;
  let riskLevel = 'safe';

  for (const keyword of dangerKeywords) {
    if (lowerResponse.includes(keyword)) {
      isFraud = true;
      riskLevel = 'danger';
      break;
    }
  }

  if (!isFraud) {
    for (const keyword of warningKeywords) {
      if (lowerResponse.includes(keyword)) {
        riskLevel = 'warning';
        break;
      }
    }
  }

  return { isFraud, riskLevel };
};

// Generate response using Gemini
const generateResponse = async (userMessage, conversationHistory = []) => {
  try {
    const model = getGeminiModel();

    // Detect language
    const language = detectLanguage(userMessage);

    // Get relevant scenarios
    const scenarios = await getRelevantScenarios(userMessage, language);

    // Build context from scenarios
    let scenarioContext = '';
    if (scenarios.length > 0) {
      scenarioContext = '\n\nDỮ LIỆU THAM KHẢO VỀ CÁC TÌNH HUỐNG LỪA ĐẢO:\n';
      scenarios.forEach((scenario, index) => {
        scenarioContext += `\n${index + 1}. Loại: ${scenario.category}\n`;
        scenarioContext += `   Câu hỏi: ${scenario.question}\n`;
        scenarioContext += `   Trả lời: ${scenario.answer}\n`;
      });
    }

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nLỊCH SỬ HỘI THOẠI:\n';
      conversationHistory.forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'Người dùng' : 'Bạn'}: ${msg.content}\n`;
      });
    }

    // Create full prompt
    const fullPrompt = `${SYSTEM_PROMPT}${scenarioContext}${conversationContext}\n\nNgười dùng: ${userMessage}\n\nHãy trả lời bằng ngôn ngữ mà người dùng sử dụng:`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    // Analyze risk
    const { isFraud, riskLevel } = analyzeFraudRisk(response);

    return {
      response,
      language,
      isFraud,
      riskLevel
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response from Gemini API');
  }
};

module.exports = {
  generateResponse,
  detectLanguage,
  analyzeFraudRisk
};
