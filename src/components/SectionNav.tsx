import Link from 'next/link';
import AuthPanel from '@/components/AuthPanel';

/**
 * Switches between the two question banks. Shown at the top of each
 * sidebar, on both dashboards -- so its brand mark is a <p>, not an <h1>.
 * Each dashboard owns the one real, keyword-specific <h1> for its page in
 * its own main content instead.
 */
export default function SectionNav({ active }: { active: 'dsa' | 'ai' | 'goals' }) {
  const base = 'flex-1 rounded-md px-2 py-1.5 text-center text-xs font-semibold transition';
  const on = 'bg-accent text-bg';
  const off = 'text-muted hover:text-text';

  return (
    <div>
      <p className="mb-2 text-lg font-bold tracking-tight">Interview Tracker</p>
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-bg p-1">
        <Link href="/" className={`${base} ${active === 'dsa' ? on : off}`}>
          DSA
        </Link>
        <Link href="/ai" className={`${base} ${active === 'ai' ? on : off}`}>
          AI / ML
        </Link>
        <Link href="/goals" className={`${base} ${active === 'goals' ? on : off}`}>
          Goals
        </Link>
      </div>
      {/* AuthPanel carries its own bottom margin as the trailing element. */}
      <AuthPanel />
    </div>
  );
}
