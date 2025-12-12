import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, VerdictType, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

export const verifyMythWithAI = async (
  claim: string,
  fact: string,
  sources: string[]
): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      You are the Truth Arbiter for 'Ekmyth', a fact-checking platform. 
      Review the following submission:
      
      Myth Claim: "${claim}"
      Proposed Fact: "${fact}"
      User Provided Sources: ${sources.join(", ")}

      Task:
      1. Verify if the "Proposed Fact" is accurate and effectively debunks the "Myth Claim".
      2. Analyze the credibility of the provided sources (if any).
      3. Use Google Search to cross-reference the claim with reputable sources.
      4. Provide a verdict (VERIFIED = The proposed fact is true and busts the myth, BUSTED = The proposed fact is actually false, PARTIALLY_TRUE = Nuanced, UNCERTAIN = Not enough info).
      5. Provide a confidence score (0-100).
      6. Provide a detailed reasoning summary. Explicitly explain WHY the "Myth Claim" is considered false (or true) and WHY the "Proposed Fact" is accurate (or inaccurate), citing evidence found during the search. Ensure both sides are addressed.

      IMPORTANT: Return your response as a valid JSON object with the following structure:
      {
        "verdict": "VERIFIED" | "BUSTED" | "PARTIALLY_TRUE" | "UNCERTAIN",
        "confidence": number,
        "reasoning": "string"
      }
      Do not include any markdown formatting or code blocks. Just the raw JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let jsonString = response.text || "{}";
    // Clean up markdown code blocks if present
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    const result = JSON.parse(jsonString);

    // Extract grounding chunks for AI suggested sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const suggestedSources: Source[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          suggestedSources.push({
            url: chunk.web.uri,
            title: chunk.web.title || "External Reference",
          });
        }
      });
    }

    return {
      verdict: result.verdict as VerdictType,
      confidence: result.confidence,
      reasoning: result.reasoning,
      suggestedSources: suggestedSources,
    };

  } catch (error) {
    console.error("AI Verification Failed:", error);
    // Fallback in case of error
    return {
      verdict: VerdictType.UNCERTAIN,
      confidence: 0,
      reasoning: "AI analysis failed to process the request. Please review manually.",
      suggestedSources: [],
    };
  }
};
