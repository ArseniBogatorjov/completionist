import { CompletionStatus } from '@prisma/client';

export interface ProgressCalculationObject {
  completionPercent: number;
  status: CompletionStatus;
}
