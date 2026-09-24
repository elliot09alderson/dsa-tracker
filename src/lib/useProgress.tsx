'use client';

/**
 * Progress state for the whole app.
 *
 * One provider sits at the root, loads the saved document once, and hands
 * every component the same read/update API. Writes are debounced before they
 * hit storage so that typing in the notes box or the code editor does not
 * write on every keystroke.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  EMPTY_PROGRESS,
  activeStore,
  getSyncMessage,
  getSyncServerSnapshot,
  getSyncState,
  subscribeSync,
  type SyncState,
} from './storage';
import type { ProblemProgress, ProgressDoc } from './types';

interface ProgressContextValue {
  /** False until the saved document has been read back from storage. */
  ready: boolean;
  /** Progress for one problem; always returns a value, never undefined. */
  get(problemId: string): ProblemProgress;
  /** Merge a patch into one problem's progress. */
  update(problemId: string, patch: Partial<ProblemProgress>): void;
  /** Convenience wrapper used by the list checkboxes. */
  toggleSolved(problemId: string): void;
  /** Ids of every solved problem, for counting. */
  solvedIds: Set<string>;
  /** Ids flagged for revision. */
  revisitIds: Set<string>;
  /** The raw document, for export. */
  doc: ProgressDoc;
  /** Replace everything, used by the import-backup button. */
  replace(doc: ProgressDoc): void;
  /** Whether the Atlas copy is up to date. */
  sync: SyncState;
  /** Why syncing failed, when it did. */
  syncMessage: string;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const SAVE_DEBOUNCE_MS = 400;

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [doc, setDoc] = useState<ProgressDoc>({
    version: 1,
    problems: {},
    updatedAt: '',
  });
  const [ready, setReady] = useState(false);

  // Load once on mount.
  useEffect(() => {
    let cancelled = false;
    activeStore.load().then((loaded) => {
      if (!cancelled) {
        setDoc(loaded);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced persistence. The timer is reset on every change, so a burst of
  // keystrokes results in a single write once typing stops.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void activeStore.save(doc);
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [doc, ready]);

  const get = useCallback(
    (problemId: string): ProblemProgress => doc.problems[problemId] ?? EMPTY_PROGRESS,
    [doc],
  );

  const update = useCallback((problemId: string, patch: Partial<ProblemProgress>) => {
    setDoc((prev) => ({
      ...prev,
      problems: {
        ...prev.problems,
        [problemId]: {
          ...(prev.problems[problemId] ?? EMPTY_PROGRESS),
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const toggleSolved = useCallback(
    (problemId: string) => {
      setDoc((prev) => {
        const current = prev.problems[problemId] ?? EMPTY_PROGRESS;
        return {
          ...prev,
          problems: {
            ...prev.problems,
            [problemId]: {
              ...current,
              solved: !current.solved,
              updatedAt: new Date().toISOString(),
            },
          },
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [],
  );

  const replace = useCallback((next: ProgressDoc) => setDoc(next), []);

  // Recomputed only when the document changes, not on every render.
  const solvedIds = useMemo(
    () => new Set(Object.entries(doc.problems).filter(([, p]) => p.solved).map(([id]) => id)),
    [doc],
  );
  const revisitIds = useMemo(
    () => new Set(Object.entries(doc.problems).filter(([, p]) => p.revisit).map(([id]) => id)),
    [doc],
  );

  // Sync status lives outside React (in the storage module), so it is read
  // through useSyncExternalStore rather than mirrored into state.
  const sync = useSyncExternalStore(subscribeSync, getSyncState, getSyncServerSnapshot);
  const syncMessage = useSyncExternalStore(subscribeSync, getSyncMessage, () => '');

  const value = useMemo(
    () => ({ ready, get, update, toggleSolved, solvedIds, revisitIds, doc, replace, sync, syncMessage }),
    [ready, get, update, toggleSolved, solvedIds, revisitIds, doc, replace, sync, syncMessage],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
