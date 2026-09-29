import { TOTAL_PROBLEMS, TOPICS } from '@/data/problems';
import { TOTAL_AI_QUESTIONS } from '@/data/ai';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

/**
 * llms.txt (see llmstxt.org): a short, plain-text orientation for AI answer
 * engines -- what this site is and where its key pages are. Generated from
 * the same source data as sitemap.ts rather than hand-written, so the topic
 * list can't drift out of sync with the catalogue.
 */
// Content only depends on build-time data, same as robots.ts/sitemap.ts --
// no reason to regenerate it per request.
export const dynamic = 'force-static';

export function GET() {
  const topicLines = TOPICS.map((t) => `- ${t.label}`).join('\n');

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is a free, browser-based DSA practice tool. Each problem page shows the
question, one or more written solutions (brute-force, better, optimal) with time/space
complexity, and an in-browser editor where a visitor writes and runs their own
JavaScript or TypeScript solution against real test cases -- no signup or install
required.

## Key pages

- [DSA problem list](${SITE_URL}/): ${TOTAL_PROBLEMS} problems, filterable by topic, company and difficulty.
- [AI/ML question bank](${SITE_URL}/ai): ${TOTAL_AI_QUESTIONS} AI and machine learning interview questions.
- [Sitemap](${SITE_URL}/sitemap.xml): every problem, topic and AI question page.

## Topics covered

${topicLines}

## Notes

- Written solutions are in TypeScript; the practice editor also accepts plain JavaScript.
- Problems are sourced from LeetCode, GeeksforGeeks and InterviewBit, tagged by topic and
  by the companies known to ask them.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
