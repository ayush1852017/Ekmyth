export enum VerdictType {
  VERIFIED = 'VERIFIED',
  BUSTED = 'BUSTED',
  PARTIALLY_TRUE = 'PARTIALLY_TRUE',
  UNCERTAIN = 'UNCERTAIN',
}

export interface Source {
  url: string;
  title?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface MythSubmission {
  id: string;
  title: string;
  mythClaim: string;
  factReality: string;
  category: string;
  userSources: string[];
  submittedAt: number;
  author: string;
  
  // AI Verification Data
  isVerified: boolean;
  aiVerdict: VerdictType;
  aiConfidenceScore: number; // 0-100
  aiReasoning: string;
  aiSuggestedSources: Source[];
  
  comments: Comment[];
  upvotes: number;
}

export interface AIAnalysisResult {
  verdict: VerdictType;
  confidence: number;
  reasoning: string;
  suggestedSources?: Source[];
}
