import type { Metadata } from "next";
import Sessions from "@/components/sessions/Sessions";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Sessions",
  description:
    "Painting sessions for aged care, private groups of five or more, and workplace teams across Melbourne. Everything supplied, we come to you. Pricing scales with your group.",
  alternates: { canonical: "/sessions" },
  openGraph: {
    title: `Sessions | ${siteConfig.name}`,
    description:
      "Painting sessions for aged care, private groups and workplace teams across Melbourne.",
    url: `${siteConfig.url}/sessions`,
  },
};

export default function SessionsPage() {
  return (
    <div className="pt-16">
      <Sessions as="h1" />
    </div>
  );
}
