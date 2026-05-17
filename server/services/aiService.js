const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GROK_API_KEY || process.env.GEMINI_API_KEY;

// Check if the key is a Gemini API Key (typically starts with AIzaSy)
const isGeminiKey = apiKey && apiKey.startsWith('AIzaSy');

let openaiClient = null;
let geminiModel = null;

if (apiKey) {
  if (isGeminiKey) {
    console.log('🤖 AI Service: Detected Google Gemini API key. Initializing Gemini Client.');
    const genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  } else {
    console.log('🤖 AI Service: Detected Grok/OpenAI API key. Initializing xAI Client.');
    openaiClient = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.x.ai/v1',
    });
  }
} else {
  console.warn('⚠️ AI Service: No API key detected. AI requests will fail.');
}

const GROK_MODEL = process.env.GROK_MODEL || 'grok-beta';

/**
 * Generate a summary using the selected engine
 */
const generateSummary = async (content) => {
  if (!content) return "No content provided to summarize.";
  if (!apiKey) {
    throw new Error("No API key configured in .env file (needs GROK_API_KEY or GEMINI_API_KEY).");
  }

  try {
    const prompt = `Summarize the following note into a concise paragraph. Do not add any conversational filler.\n\nNote Content:\n${content}`;

    if (isGeminiKey && geminiModel) {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } else if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: GROK_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful and concise AI assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      });
      return response.choices[0].message.content.trim();
    } else {
      throw new Error("AI client not initialized.");
    }
  } catch (error) {
    console.error("AI summary error:", error?.message || error);
    throw new Error(`Failed to generate summary with AI: ${error.message}`);
  }
};

/**
 * Extract action items using the selected engine
 */
const extractActionItems = async (content) => {
  if (!content) return [];
  if (!apiKey) {
    return ["Please configure GROK_API_KEY or GEMINI_API_KEY in your .env file."];
  }

  try {
    const prompt = `Extract a list of actionable items or tasks from the following note. Return ONLY a JSON array of strings, with no other text, markdown formatting, or conversational filler. Example: ["Task 1", "Task 2"]\n\nNote Content:\n${content}`;
    let text = "";

    if (isGeminiKey && geminiModel) {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      text = response.text().trim();
    } else if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: GROK_MODEL,
        messages: [
          { role: 'system', content: 'You are an AI assistant that extracts action items and returns ONLY JSON arrays of strings.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      });
      text = response.choices[0].message.content.trim();
    } else {
      throw new Error("AI client not initialized.");
    }

    // Attempt to parse the response text as a JSON array
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI action items error:", error?.message || error);
    return ["Could not extract action items correctly."];
  }
};

/**
 * Generate a catchy title using the selected engine
 */
const generateTitle = async (content) => {
  if (!content) return "Untitled Note";
  if (!apiKey) {
    throw new Error("No API key configured in .env file.");
  }

  try {
    const prompt = `Generate a short, catchy, and relevant title for the following note. Return ONLY the title text, without any quotes or conversational filler.\n\nNote Content:\n${content}`;

    if (isGeminiKey && geminiModel) {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text().trim().replace(/^["']|["']$/g, '');
    } else if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: GROK_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates catchy titles.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      });
      return response.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    } else {
      throw new Error("AI client not initialized.");
    }
  } catch (error) {
    console.error("AI title error:", error?.message || error);
    throw new Error(`Failed to generate title with AI: ${error.message}`);
  }
};

module.exports = {
  generateSummary,
  extractActionItems,
  generateTitle,
};
