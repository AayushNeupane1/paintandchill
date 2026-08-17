import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-canvas px-5 py-32 text-center">
      <div>
        <p className="paint-text mx-auto w-fit font-script text-[22vw] leading-none sm:text-[9rem]">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">
          This page hasn&apos;t been painted yet.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
          The link may be old, or the page may have moved. Everything else is
          still where you left it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            BACK TO HOME
          </Link>
          <Link href="/sessions" className="btn btn-secondary">
            SEE SESSIONS
          </Link>
        </div>
      </div>
    </div>
  );
}
