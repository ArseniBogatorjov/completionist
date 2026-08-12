// export type CompletionStatus = 'backlog' | 'completed' | 'playing';
import { CompletionStatus } from '@prisma/client';

export interface ProgressCalculationObject {
  completionPercent: number;
  status: CompletionStatus;
}
