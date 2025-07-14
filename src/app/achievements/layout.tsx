import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Our Achievements - OCC World Trade',
  description: 'Explore our certifications, awards, and industry recognition that demonstrate our commitment to excellence.',
};

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
