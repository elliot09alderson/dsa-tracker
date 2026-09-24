import Link from 'next/link';

/** Switches between the two question banks. Shown at the top of each sidebar. */
export default function SectionNav({ active }: { active: 'dsa' | 'ai' }) {
  const base = 'flex-1 rounded-md px-3 py-1.5 text-center text-xs font-semibold transition';
  const on = 'bg-accent text-bg';
  const off = 'text-muted hover:text-text';

  return (
    <div className="mb-5">
      <h1 className="mb-2 text-lg font-bold tracking-tight">Interview Tracker</h1>
      <div className="flex gap-1 rounded-lg border border-border bg-bg p-1">
        <Link href="/" className={`${base} ${active === 'dsa' ? on : off}`}>
          DSA
        </Link>
        <Link href="/ai" className={`${base} ${active === 'ai' ? on : off}`}>
          AI / ML
        </Link>
      </div>
    </div>
  );
}
