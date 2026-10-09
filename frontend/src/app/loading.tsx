import { TraceLoader } from "@/components/feedback/trace-loader";

/** Shown while any page outside the game shell (landing, auth) loads on navigation. */
export default function Loading() {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-[linear-gradient(178deg,#000614_2%,#002472_45%,#011b55_84%)]">
      <TraceLoader className="flex-1" />
    </div>
  );
}
