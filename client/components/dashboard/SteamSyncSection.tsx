'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { apiClient } from '@/lib/api/apiClient';
import { steamSyncSchema } from '@/lib/validations/steam.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';

interface Props {
  onSyncSuccess?: () => void;
}

export default function SteamSyncSection({ onSyncSuccess }: Props) {
  const [steamId, setSteamId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e: SubmitEvent) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    const result = steamSyncSchema.safeParse({ steamId });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Invalid Steam ID');
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmSync = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      await apiClient('/steam/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steamId }),
      });

      setIsModalOpen(false);
      setSteamId('');
      if (onSyncSuccess) {
        onSyncSuccess();
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred during sign up.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur">
        <form
          onSubmit={handleOpenModal}
          className="flex flex-col gap-3 sm:flex-row sm:items-start"
        >
          <div className="flex-1 space-y-1">
            <Input
              type="text"
              placeholder="Enter SteamID64 (17 digits)"
              value={steamId}
              onChange={(e) => {
                setSteamId(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-emerald-500"
            />
            {validationError && (
              <p className="text-xs text-red-400 pl-1">{validationError}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-medium transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Library
          </Button>
        </form>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sync Requirements
            </DialogTitle>
            <DialogDescription className="text-zinc-400 pt-2">
              Please verify your Steam account configuration before starting the
              import process.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-sm text-zinc-300">
            <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Public Profile</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Set your Steam Privacy Settings for both **Profile** and
                  **Game details** to **Public**.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <RefreshCw className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Processing Time</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Large game libraries may take from **30 seconds up to a few
                  minutes** to complete initial synchronization.
                </p>
              </div>
            </div>

            {apiError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-md">
                Sync error: {apiError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSync}
              disabled={isLoading}
              className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Confirm & Sync'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
