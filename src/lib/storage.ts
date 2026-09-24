/**
 * Progress storage.
 *
 * Two layers, always used together:
 *
 *   localStorage — instant, offline, survives a refresh even with no network.
 *   MongoDB Atlas — the durable copy, so progress follows you between browsers
 *                   and machines. Reached through /api/progress.
 *
 * On load we prefer whichever copy is newer, so a reload never silently
 * reverts work done on another device, and a cluster that is unreachable
 * degrades to local-only rather than losing anything. On save we write local
 * first (so the UI is never waiting on the network) and then push to Atlas.
 */

import type { ProblemProgress, ProgressDoc } from './types';

const STORAGE_KEY = 'dsa-tracker:progress:v1';

export const EMPTY_PROGRESS: ProblemProgress = {
  solved: false,
  revisit: false,
  notes: '',
  code: '',
  updatedAt: '',
};

function emptyDoc(): ProgressDoc {
  return { version: 1, problems: {}, updatedAt: '' };
}

function isProgressDoc(value: unknown): value is ProgressDoc {
  const doc = value as ProgressDoc | null;
  return Boolean(doc && doc.version === 1 && typeof doc.problems === 'object' && doc.problems !== null);
}

/** How many problems carry any recorded state -- used to break load ties. */
function weight(doc: ProgressDoc): number {
  return Object.keys(doc.problems).length;
}

// --- local layer -----------------------------------------------------------

function readLocal(): ProgressDoc {
  if (typeof window === 'undefined') return emptyDoc();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDoc();
    const parsed: unknown = JSON.parse(raw);
    return isProgressDoc(parsed) ? parsed : emptyDoc();
  } catch {
    // Private browsing, cleared site data, or corrupt JSON.
    return emptyDoc();
  }
}

function writeLocal(doc: ProgressDoc): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch {
    // Quota exceeded or storage blocked; the Atlas copy still gets written.
  }
}

// --- sync status -----------------------------------------------------------

export type SyncState = 'idle' | 'syncing' | 'synced' | 'local-only';

let syncState: SyncState = 'idle';
let syncMessage = '';
const listeners = new Set<() => void>();

function setSync(state: SyncState, message = '') {
  syncState = state;
  syncMessage = message;
  listeners.forEach((l) => l());
}

/** Subscribe to sync-status changes (used by useSyncExternalStore). */
export function subscribeSync(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSyncState(): SyncState {
  return syncState;
}

export function getSyncMessage(): string {
  return syncMessage;
}

/** Server-side snapshot, so useSyncExternalStore does not warn during SSR. */
export function getSyncServerSnapshot(): SyncState {
  return 'idle';
}

// --- the store the app talks to -------------------------------------------

export interface ProgressStore {
  load(): Promise<ProgressDoc>;
  save(doc: ProgressDoc): Promise<void>;
}

export const hybridStore: ProgressStore = {
  async load() {
    const local = readLocal();
    setSync('syncing');

    try {
      const res = await fetch('/api/progress', { cache: 'no-store' });

      if (!res.ok) {
        // 501 means no Atlas URI configured; anything else is a real failure.
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setSync('local-only', body?.error ?? `Atlas unavailable (${res.status})`);
        return local;
      }

      const remote: unknown = await res.json();
      if (!isProgressDoc(remote)) {
        setSync('local-only', 'Atlas returned an unexpected document');
        return local;
      }

      // Prefer the newer copy. If timestamps tie or are missing, prefer the
      // one holding more records rather than picking arbitrarily.
      const remoteNewer =
        remote.updatedAt > local.updatedAt ||
        (remote.updatedAt === local.updatedAt && weight(remote) >= weight(local));

      const winner = remoteNewer ? remote : local;
      writeLocal(winner);

      // Local was ahead (offline edits): push it straight back up.
      if (!remoteNewer && weight(local) > 0) {
        void this.save(local);
      }

      setSync('synced');
      return winner;
    } catch (err) {
      setSync('local-only', err instanceof Error ? err.message : 'Network error');
      return local;
    }
  },

  async save(doc) {
    // Local first: the UI must never wait on the network.
    writeLocal(doc);
    setSync('syncing');

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setSync('local-only', body?.error ?? `Save failed (${res.status})`);
        return;
      }

      setSync('synced');
    } catch (err) {
      // Saved locally regardless; the next successful save pushes everything.
      setSync('local-only', err instanceof Error ? err.message : 'Network error');
    }
  },
};

export const activeStore: ProgressStore = hybridStore;

/** Export the whole progress document as a downloadable JSON backup. */
export function exportProgress(doc: ProgressDoc): string {
  return JSON.stringify(doc, null, 2);
}

/** Parse a previously exported backup, returning null if it is not one. */
export function parseProgressBackup(text: string): ProgressDoc | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return isProgressDoc(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
