import { GoogleGenAI, Schema, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    scan_id: { type: Type.STRING },
    timestamp: { type: Type.STRING },
    mode: { type: Type.STRING, enum: ['text', 'file', 'image', 'video'] },
    file_info: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, nullable: true },
        type: { type: Type.STRING, nullable: true },
        size_bytes: { type: Type.NUMBER, nullable: true },
        pages: { type: Type.NUMBER, nullable: true },
      },
      nullable: true
    },
    detection: {
      type: Type.OBJECT,
      properties: {
        is_ai_generated: { type: Type.BOOLEAN },
        ai_probability: { type: Type.NUMBER },
        human_probability: { type: Type.NUMBER },
        risk_score: { type: Type.NUMBER },
        risk_level: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
        confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
        summary: { type: Type.STRING },
        signals: { type: Type.ARRAY, items: { type: Type.STRING } },
        model_suspected: { type: Type.STRING, nullable: true },
        detailed_analysis: { type: Type.STRING },
      },
      required: ['is_ai_generated', 'ai_probability', 'human_probability', 'risk_score', 'risk_level', 'summary', 'signals', 'detailed_analysis']
    },
    humanizer: {
      type: Type.OBJECT,
      properties: {
        requested: { type: Type.BOOLEAN },
        humanized_text: { type: Type.STRING, nullable: true },
        changes_made: { type: Type.ARRAY, items: { type: Type.STRING } },
        improvement_score: { type: Type.NUMBER },
        notes: { type: Type.STRING, nullable: true },
      },
      required: ['requested', 'changes_made', 'improvement_score']
    },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    ui_hints: {
      type: Type.OBJECT,
      properties: {
        show_loading_animation: { type: Type.BOOLEAN },
        suggested_color: { type: Type.STRING, enum: ['red', 'yellow', 'green'] },
        suggested_view: { type: Type.STRING, enum: ['card', 'table', 'graph'] },
        alert_level: { type: Type.STRING, enum: ['info', 'warning', 'danger', 'success'] },
      },
      required: ['suggested_color', 'suggested_view', 'alert_level']
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        processing_time_ms: { type: Type.NUMBER },
        apis_used: { type: Type.ARRAY, items: { type: Type.STRING } },
        version: { type: Type.STRING },
      },
      required: ['processing_time_ms', 'apis_used', 'version']
    },
    error: { type: Type.BOOLEAN, nullable: true },
    message: { type: Type.STRING, nullable: true },
  },
  required: ['scan_id', 'timestamp', 'mode', 'detection', 'humanizer', 'recommendations', 'ui_hints', 'metadata']
};

export const analyzeContent = async (
  content: string, 
  mode: 'text' | 'image' | 'file', 
  humanize: boolean, 
  fileData?: { base64: string, mime: string, name?: string }
): Promise<AnalysisResponse> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash';

  let promptContext = "";

  if (mode === 'image') {
    promptContext = `
      TASK: Perform a deep forensic analysis of this image for AI-GENERATED traces.
      
      CRITICAL INSTRUCTIONS:
      1. IGNORE text within the image unless it contains obvious AI formatting glitches.
      2. Focus on VISUAL ARTIFACTS typical of GANs, Diffusion models, and Deepfakes:
         - Asymmetry in eyes, ears, or glasses.
         - Strange textures in hair, skin, or background blurs.
         - Lighting inconsistencies (shadows not matching light sources).
         - Hands/Fingers: Look for extra/missing fingers or distorted joints.
         - "Hive AI" style forensic check: Look for pixelation noise that signifies upscaling.
      
      Humanization is NOT available for images.
    `;
  } else if (mode === 'file') {
     promptContext = `
      TASK: Analyze the attached document (PDF/DOCX) for AI-generated structural patterns.
      
      LOOK FOR ACADEMIC/FORMAL AI SIGNATURES:
      1. Structure: Is paragraph length perfectly uniform? (AI tendency).
      2. Citations: Are there hallucinated citations or generic references like "Studies show..." without sources?
      3. Tone: Is it overly "diplomatic", refusing to take a side?
      4. Phrasing: Overuse of transition words: "Moreover", "Furthermore", "In conclusion", "It is important to note".
      5. Vocabulary: "Delve", "Landscape", "Tapestry", "Nuance", "Multifaceted".
      
      If humanize=true, rewrite to break these patterns: vary sentence length, add strong opinions, remove filler.
     `;
  } else {
    promptContext = `
      TASK: Analyze the provided text for AI generation patterns.
      Look for:
      - Robotic/Neutral Tone.
      - Lack of personal anecdote or "soul".
      - Perfect grammar with zero stylistic flair.
      - Repetitive sentence structures.
      
      Humanize if requested: Inject personality, contractions, and varied cadence.
    `;
  }

  const systemInstruction = `
    You are "AI Wala Jhol" - a premium AI detection engine.
    Your goal: Detect AI content with high precision using forensic-level analysis.
    
    IMPORTANT CONSTRAINTS TO PREVENT ERRORS:
    1. Keep 'detailed_analysis' CONCISE (max 150 words) but insightful.
    2. Keep 'summary' under 200 characters.
    3. If humanizing, provide the result in 'humanized_text' but keep it concise.
    4. RETURN ONLY VALID JSON. Do not include markdown formatting.
    
    ${promptContext}
  `;

  try {
    const parts: any[] = [];
    
    if (mode === 'text') {
      parts.push({ text: `Content: ${content}\nHumanize: ${humanize}` });
    } else if (fileData) {
      parts.push({
        inlineData: {
          mimeType: fileData.mime,
          data: fileData.base64
        }
      });
      parts.push({ text: `Filename: ${fileData.name}\nHumanize: ${humanize}` });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4,
        maxOutputTokens: 8192,
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // Robust JSON cleaning
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '');
    }

    try {
      const parsed = JSON.parse(text) as AnalysisResponse;
      
      // Ensure file_info exists and has default values if null
      if (!parsed.file_info) {
        parsed.file_info = { name: null, type: null, size_bytes: null, pages: null };
      }

      // Inject local file info
      if (fileData?.name) {
         parsed.file_info = {
           ...parsed.file_info,
           name: fileData.name,
           type: mode === 'file' ? 'pdf' : (mode as any),
           // Keep existing values if they were somehow populated, else null
           size_bytes: parsed.file_info.size_bytes || null, 
           pages: parsed.file_info.pages || null
         };
      }
      
      // Fallback for missing detection object
      if (!parsed.detection) {
         parsed.detection = {
            is_ai_generated: false,
            ai_probability: 0,
            human_probability: 0,
            risk_score: 0,
            risk_level: 'LOW',
            confidence: 'low',
            summary: "Analysis incomplete.",
            signals: ["No clear signals"],
            model_suspected: null,
            detailed_analysis: "The model returned a partial response."
         };
      }

      return parsed;

    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, text.substring(0, 200) + "...");
      throw new Error("Failed to parse AI response. The analysis might have been too long.");
    }

  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      scan_id: `err_${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: mode as any,
      file_info: { name: fileData?.name || null, type: null, size_bytes: null, pages: null },
      detection: {
        is_ai_generated: false,
        ai_probability: 0,
        human_probability: 0,
        risk_score: 0,
        risk_level: 'LOW',
        confidence: 'low',
        summary: "Error during analysis.",
        signals: [],
        model_suspected: null,
        detailed_analysis: "We encountered an error. Please try again or use a shorter text/smaller file."
      },
      humanizer: { requested: humanize, humanized_text: null, changes_made: [], improvement_score: 0, notes: null },
      recommendations: [],
      ui_hints: { show_loading_animation: false, suggested_color: 'red', suggested_view: 'card', alert_level: 'danger' },
      metadata: { processing_time_ms: 0, apis_used: [], version: "1.0.0" },
      error: true,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
};