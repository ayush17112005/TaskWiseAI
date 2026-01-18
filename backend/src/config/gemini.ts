import { GoogleGenAI } from '@google/genai';
import config from './env';

/**
 * Initialize Google GenAI Client
 * 
 * This is the NEW centralized client (post-2024)
 */
const genAI = new GoogleGenAI({
  apiKey: config.geminiApiKey,
});

/**
 * Default Generation Config
 */
export const defaultGenerationConfig = {
  temperature: 0.7,
  maxOutputTokens: 2048,
  topP: 0.95,
  topK: 40,
};

/**
 * Default Safety Settings
 */
export const defaultSafetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category:  'HARM_CATEGORY_HATE_SPEECH',
    threshold:  'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold:  'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];

/**
 * Model name constant
 * Using gemini-2.0-flash-exp (latest free model)
 */
const MODEL_NAME = 'gemini-3-flash-preview'; 

/**
 * 📚 Call Gemini API (NEW WAY)
 */
export const callGemini = async (
  prompt: string,
  customConfig?: any
): Promise<string> => {
  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME, // ← Using constant
      contents: prompt,
      config: {
        ...defaultGenerationConfig,
        safetySettings: defaultSafetySettings,
        ...customConfig,
      },
    });

    return response.text || '';
  } catch (error:  any) {
    console.error('Gemini API Error:', error. message);

    if (error.message?. includes('API_KEY') || error.message?.includes('apiKey')) {
      throw new Error('Invalid Gemini API key');
    }

    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Gemini API quota exceeded.  Please try again later.');
    }

    if (error.message?.includes('SAFETY')) {
      throw new Error('Content was blocked by safety filters');
    }

    throw new Error(`Gemini API error: ${error.message}`);
  }
};

/**
 * Clean and extract JSON from AI response
 */
const cleanJSONResponse = (text: string): string => {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  
  // Try to find JSON object or array
  const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  // Remove comments (both // and /* */)
  cleaned = cleaned.replace(/\/\/.*$/gm, '');
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  
  return cleaned.trim();
};

/**
 * Call Gemini with JSON Response
 */
export const callGeminiJSON = async <T = any>(
  prompt: string,
  schema?:  any
): Promise<T> => {
  try {
    const config:  any = {
      ... defaultGenerationConfig,
      responseMimeType: 'application/json',
    };

    if (schema) {
      config.responseSchema = schema;
    }

    const response = await genAI.models.generateContent({
      model: MODEL_NAME, // ← Using constant
      contents: prompt,
      config,
    });

    const rawText = response.text || '{}';
    console.log('Raw AI Response:', rawText.substring(0, 500));
    
    const cleanedText = cleanJSONResponse(rawText);
    console.log('Cleaned JSON:', cleanedText.substring(0, 500));
    
    return JSON.parse(cleanedText) as T;
  } catch (error: any) {
    console.error('Gemini JSON Error:', error.message);

    if (error instanceof SyntaxError) {
      console.error('Invalid JSON received from AI');
      throw new Error('AI returned invalid JSON format');
    }

    throw error;
  }
};

/**
 * Call Gemini with Streaming
 */
export const callGeminiStream = async function* (
  prompt: string
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await genAI.models.generateContentStream({
      model: MODEL_NAME, // ← Using constant
      contents: prompt,
      config: {
        ...defaultGenerationConfig,
      },
    });

    for await (const chunk of response) {
      yield chunk.text || '';
    }
  } catch (error: any) {
    console.error('Gemini Stream Error:', error.message);
    throw new Error(`Gemini streaming error: ${error.message}`);
  }
};

/**
 * Test Gemini Connection
 */
export const testGeminiConnection = async (): Promise<boolean> => {
  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME, // ← Using constant
      contents: 'Say "Hello" if you can read this.',
    });

    return (response.text || '').toLowerCase().includes('hello');
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
};

/**
 * Count Tokens
 */
export const countTokens = async (prompt:  string): Promise<number> => {
  try {
    const result = await genAI.models. countTokens({
      model:  MODEL_NAME, // ← Using constant
      contents: prompt,
    });

    return result.totalTokens || 0;
  } catch (error:  any) {
    console.error('Token counting error:', error.message);
    return 0;
  }
};

// Export the client for advanced usage
export { genAI };

export default {
  callGemini,
  callGeminiJSON,
  callGeminiStream,
  testGeminiConnection,
  countTokens,
  genAI,
};