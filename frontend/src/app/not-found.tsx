import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold">Nothing to trace here</h2>
      <p className="text-muted">This page does not exist.</p>
      <Link href="/" className="text-accent underline underline-offset-4">
        Back to home
      </Link>
    </main>
  );
}
