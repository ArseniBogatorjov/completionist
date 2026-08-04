export type CompletionStatus = 'backlog' | 'completed' | 'playing';

export interface ProgressCalculationResult {
  completionPercent: number;
  status: CompletionStatus;
}

export interface SyncedGamesResponse {
  synced: number;
}
