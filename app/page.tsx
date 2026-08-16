import Hero from "@/components/hero/Hero";
import CustomCursor from "@/components/hero/CustomCursor";
import Sessions from "@/components/sessions/Sessions";
import { heroCopy } from "@/lib/heroContent";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Hero />

      {/* SEO supporting copy — the page never relies on animation alone to
          say what Paint & Chill is. */}
      <p className="sr-only">{heroCopy.seoIntro}</p>

      <Sessions />
    </>
  );
}
