import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { LessonContent, SearchResult, GroundingSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates lesson content dynamically based on the topic.
 */
export const generateLessonContent = async (
  chapterTitle: string,
  topicTitle: string
): Promise<LessonContent> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are an expert technical instructor creating a comprehensive university-grade lesson.
    
    Topic: "${topicTitle}"
    Chapter context: "${chapterTitle}"

    REQUIREMENTS:
    1. **Content**: Write a detailed, engaging lesson (approx. 600-800 words). Use Markdown.
       - Include clear headings.
       - Use code blocks for technical examples (GitHub Actions YAML, Python, etc.).
       - Use bold text for key concepts.
       - Provide real-world scenarios or "Why this matters" sections.
    
    2. **Assessment**: Create 4 diverse quiz questions to validate deep understanding.
       - Mix different question types: multiple-choice, true-false, code-completion, and matching questions.
       - Questions should test application of knowledge, not just memorization.
       - Include code snippets where relevant for technical topics.
       - Assign difficulty levels (easy, medium, hard) and points (10-30).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for the lesson" },
          content: { type: Type.STRING, description: "Comprehensive Markdown formatted lesson content" },
          quizzes: {
            type: Type.ARRAY,
            description: "A list of 4 diverse quiz questions",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Unique identifier for the question" },
                type: {
                  type: Type.STRING,
                  enum: ["multiple-choice", "true-false", "code-completion", "matching"],
                  description: "Type of quiz question"
                },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array of possible answers (2 for true-false, 4 for multiple-choice)"
                },
                correctIndex: { type: Type.INTEGER, description: "Index of the correct option" },
                explanation: { type: Type.STRING, description: "Detailed explanation of why the answer is correct" },
                codeSnippet: { type: Type.STRING, description: "Code snippet for code-completion questions (optional)" },
                points: { type: Type.INTEGER, description: "Points awarded for correct answer (10-30)" },
                difficulty: {
                  type: Type.STRING,
                  enum: ["easy", "medium", "hard"],
                  description: "Difficulty level of the question"
                }
              },
              required: ["id", "type", "question", "options", "correctIndex", "explanation", "points", "difficulty"]
            }
          }
        },
        required: ["title", "content", "quizzes"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate lesson content");
  }

  return JSON.parse(response.text) as LessonContent;
};

/**
 * Starts a new chat session with Gemini 3 Pro.
 */
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are an expert DevOps and Machine Learning tutor. Answer questions about GitHub Actions, CI/CD, and DVC helpfully and concisely.",
    }
  });
};

/**
 * Performs a search query using Gemini 2.5 Flash with Grounding.
 */
export const performGroundedSearch = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No results found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract sources if available
    const sources: GroundingSource[] = chunks
      .filter(c => c.web?.uri && c.web?.title)
      .map(c => ({ 
        web: {
          uri: c.web?.uri || "",
          title: c.web?.title || ""
        }
      }));

    return { text, sources };
  } catch (error) {
    console.error("Search error:", error);
    return { text: "Sorry, I encountered an error while searching.", sources: [] };
  }
};