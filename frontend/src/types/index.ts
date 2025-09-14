// User types
export interface User {
  id: string;
  email: string;
  skill_level: 'beginner' | 'intermediate' | 'expert';
  preferences: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  skill_level?: 'beginner' | 'intermediate' | 'expert';
}

// Dataset types
export interface Dataset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  schema_info: Record<string, any>;
  metadata: Record<string, any>;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
  created_at: string;
  updated_at?: string;
}

export interface DatasetPreview {
  columns: string[];
  data: any[][];
  total_rows: number;
  sample_size: number;
}

export interface DatasetSchema {
  columns: Record<string, Record<string, any>>;
  basic_stats?: Record<string, any>;
  data_quality?: Record<string, any>;
}

// Analysis types
export interface AnalysisRequest {
  query_text: string;
  dataset_id: string;
}

export interface AnalysisResult {
  id: string;
  query_text: string;
  query_intent: Record<string, any>;
  results: Record<string, any>;
  execution_time?: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  error_message?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// UI State types
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface Modal {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Visualization types
export interface ChartConfig {
  type: 'bar' | 'line' | 'scatter' | 'pie' | 'histogram' | 'heatmap';
  data: any[];
  x_column?: string;
  y_column?: string;
  color_column?: string;
  title?: string;
  options?: Record<string, any>;
}

// Admin types
export interface SystemConfig {
  openai_configured: boolean;
  hugging_face_configured: boolean;
  max_file_size_mb: number;
  max_files_per_upload: number;
}

export interface SystemStatus {
  system: {
    status: string;
    uptime: string;
    version: string;
  };
  database: {
    status: string;
    pool_size: number;
  };
  storage: {
    status: string;
    available_space: string;
  };
  queues: {
    status: string;
    pending_jobs: number;
  };
  external_apis: {
    openai: string;
    hugging_face: string;
  };
}