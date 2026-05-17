const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate a summary using Gemini
 */
const generateSummary = async (content) => {
  if (!content) return "No content provided to summarize.";
  try {
    const prompt = `Summarize the following note into a concise paragraph. Do not add any conversational filler.\n\nNote Content:\n${content}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini summary error:", error);
    throw new Error("Failed to generate summary with AI.");
  }
};

/**
 * Extract action items using Gemini
 */
const extractActionItems = async (content) => {
  if (!content) return [];
  try {
    const prompt = `Extract a list of actionable items or tasks from the following note. Return ONLY a JSON array of strings, with no other text, markdown formatting, or conversational filler. Example: ["Task 1", "Task 2"]\n\nNote Content:\n${content}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Attempt to parse the response text as a JSON array
    // Sometimes the model might wrap it in markdown code blocks like ```json ... ```
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini action items error:", error);
    // Fallback if parsing fails
    return ["Could not extract action items correctly."];
  }
};

/**
 * Generate a catchy title using Gemini
 */
const generateTitle = async (content) => {
  if (!content) return "Untitled Note";
  try {
    const prompt = `Generate a short, catchy, and relevant title for the following note. Return ONLY the title text, without any quotes or conversational filler.\n\nNote Content:\n${content}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error("Gemini title error:", error);
    throw new Error("Failed to generate title with AI.");
  }
};

module.exports = {
  generateSummary,
  extractActionItems,
  generateTitle,
};
