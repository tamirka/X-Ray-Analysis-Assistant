
export enum AppStep {
  Upload = 'UPLOAD',
  Analyzing = 'ANALYZING',
  Result = 'RESULT',
}

export interface AnalysisResult {
  findings: string[];
  potentialIssues: string[];
  recommendation: string;
}
