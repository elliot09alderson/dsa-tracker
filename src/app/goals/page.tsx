import type { Metadata } from 'next';
import GoalsDashboard from '@/components/GoalsDashboard';

export const metadata: Metadata = {
  title: 'Your Goals',
  description:
    'Set weekly DSA practice goals by topic and deadline, and track how many questions are left as you solve.',
};

export default function GoalsPage() {
  return <GoalsDashboard />;
}
