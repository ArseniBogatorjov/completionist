export type CompletionStatus = 'backlog' | 'completed' | 'playing';

export interface ProgressCalculationObject {
  completionPercent: number;
  status: CompletionStatus;
}
