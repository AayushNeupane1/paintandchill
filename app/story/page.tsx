import type { Metadata } from "next";
import OurStory from "@/components/story/OurStory";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How Paint & Chill began — art as a way to communicate, and what happens in a room when everyone is trying.",
  alternates: { canonical: "/story" },
  openGraph: {
    title: `Our Story | ${siteConfig.name}`,
    description: "How Paint & Chill began in Melbourne.",
    url: `${siteConfig.url}/story`,
  },
};

export default function StoryPage() {
  return (
    <div className="pt-16">
      <OurStory as="h1" />
    </div>
  );
}
