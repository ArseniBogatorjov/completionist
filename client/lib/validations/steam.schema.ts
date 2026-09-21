import { z } from 'zod';

export const steamSyncSchema = z.object({
  steamId: z
    .string()
    .trim()
    .regex(
      /^\d{17}$/,
      'SteamID64 must consist of exactly 17 digits (e.g., 76561198000000000)',
    ),
});

export type SteamSyncInput = z.infer<typeof steamSyncSchema>;
