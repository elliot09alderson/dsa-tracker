/**
 * One colour per topic, shared by every place a topic shows up as a chip
 * (the problem list, and the problem detail page) -- a tinted background
 * plus a solid-colour label, the same visual language company chips use, so
 * a topic is recognisable by colour rather than by reading the text every
 * time. Keyed by Topic.key (see TOPICS in @/data/problems); a topic not
 * listed here falls back to a neutral grey via topicColor() below.
 */
export const TOPIC_COLOR: Record<string, string> = {
  Arrays: '#60a5fa',
  Two_Pointers: '#34d399',
  Bit_Manipulation: '#a78bfa',
  Searching: '#fbbf24',
  Backtracking: '#f472b6',
  Sorting: '#38bdf8',
  Hashing: '#fb923c',
  Strings: '#4ade80',
  Stacks: '#c084fc',
  Queues: '#22d3ee',
  Linked_Lists: '#f87171',
  Trees: '#a3e635',
  Heaps: '#e879f9',
  Greedy_Algorithm: '#facc15',
  Dynamic_Programming: '#818cf8',
  Graphs: '#2dd4bf',
};

const FALLBACK_TOPIC_COLOR = '#94a3b8';

/** The colour for a topic key, or a neutral grey if the topic is unlisted. */
export function topicColor(topicKey: string): string {
  return TOPIC_COLOR[topicKey] ?? FALLBACK_TOPIC_COLOR;
}
