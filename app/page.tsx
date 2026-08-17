import Hero from "@/components/hero/Hero";
import Sessions from "@/components/sessions/Sessions";
import OurStory from "@/components/story/OurStory";
import { heroCopy } from "@/lib/heroContent";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Supporting copy so the page never relies on animation alone to say
          what Paint & Chill is. */}
      <p className="sr-only">{heroCopy.seoIntro}</p>

      <Sessions />
      <OurStory />
    </>
  );
}
