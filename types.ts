
export enum AppStep {
  Upload = 'UPLOAD',
  Result = 'RESULT',
}

export interface AnalysisResult {
  findings: string[];
  potentialIssues: string[];
  recommendation: string;
}