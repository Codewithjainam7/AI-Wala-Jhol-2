export interface FileInfo {
  name: string | null;
  type: 'pdf' | 'docx' | 'image' | 'video' | 'text' | null;
  size_bytes: number | null;
  pages: number | null;
}

export interface DetectionResult {
  is_ai_generated: boolean;
  ai_probability: number;
  human_probability: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: 'high' | 'medium' | 'low';
  summary: string;
  signals: string[];
  model_suspected: string | null;
  detailed_analysis: string;
}

export interface HumanizerResult {
  requested: boolean;
  humanized_text: string | null;
  changes_made: string[];
  improvement_score: number;
  notes: string | null;
}

export interface UiHints {
  show_loading_animation: boolean;
  suggested_color: 'red' | 'yellow' | 'green';
  suggested_view: 'card' | 'table' | 'graph';
  alert_level: 'info' | 'warning' | 'danger' | 'success';
}

export interface AnalysisResponse {
  scan_id: string;
  timestamp: string;
  mode: 'text' | 'file' | 'image' | 'video';
  file_info: FileInfo;
  detection: DetectionResult;
  humanizer: HumanizerResult;
  recommendations: string[];
  ui_hints: UiHints;
  metadata: {
    processing_time_ms: number;
    apis_used: string[];
    version: string;
  };
  error?: boolean;
  message?: string;
  fallback_analysis?: boolean;
}

// History item is essentially a stored AnalysisResponse, but we might want a lightweight version for lists
export type HistoryItem = AnalysisResponse;

export interface WritingTip {
  title: string;
  description: string;
  example_ai: string;
  example_human: string;
}
