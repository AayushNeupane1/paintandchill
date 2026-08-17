// -----------------------------------------------------------------------------
// Our Story.
//
// Written from the founder's own note. Voice is deliberately first person and
// plain — it is the one place on the site that should not sound like marketing.
// Wording is yours to adjust; only this file needs editing.
// -----------------------------------------------------------------------------

export const story = {
  eyebrow: "OUR STORY",
  titleLead: "The birth of",
  titleScript: "Paint & Chill.",

  /** The line that carries the whole section. */
  lead: "As a boy, I wanted to speak through paint long before I could say much of it out loud.",

  body: [
    "Art was never about being good at it. It was how I understood people — a language that still worked when words ran out. I have always seen it as a way to communicate: to put a little peace into a room, and a little happiness with it.",
    "Paint & Chill started in 2025 with that same idea, just scaled up to fit around a table. Not a class. Not a test. A couple of hours where a room full of people end up talking to each other because their hands are busy.",
    "We take it into aged care lounges, living rooms, offices and courtyards across Melbourne. Most people have not held a brush since school. Nearly all of them surprise themselves. Every one of them leaves with something they made.",
  ],

  stats: [
    { value: "2025", label: "Established in Melbourne" },
    { value: "All ages", label: "From aged care to corporate" },
    { value: "We come to you", label: "Anywhere across Melbourne" },
  ],

  video: {
    /** Drop the file at public/video/our-story.mp4 */
    src: "/video/our-story.mp4",
    /**
     * Frame shape. Set this to match the real footage so nothing important
     * gets cropped: "4 / 5" for phone-portrait, "16 / 9" for landscape.
     * No poster image — the video's own first frame is what shows.
     */
    aspect: "9 / 16",
    /** Describes the footage for anyone who cannot see it. */
    description:
      "Footage from a Paint & Chill session at a Melbourne aged care home: residents seated around tables painting at easels, finished canvases of mountains, moonlit blossom and a mushroom drying beside them, and staff moving through the room helping.",
  },
};
