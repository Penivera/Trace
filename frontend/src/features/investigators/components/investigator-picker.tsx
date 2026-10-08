import Image from "next/image";

import type { Investigator } from "../data";

type InvestigatorPickerProps = {
  investigators: Investigator[];
  /** Server Action that records the choice and moves on (receives `investigatorId` and `caseId`). */
  action: (formData: FormData) => Promise<void>;
  /** Case to open after choosing, if any. */
  caseId?: string;
};

/**
 * Each SELECT is a tiny form posting to a Server Action, so it works before
 * JavaScript loads and the choice is saved server-side, not just in the URL.
 */
export function InvestigatorPicker({ investigators, action, caseId }: InvestigatorPickerProps) {
  return (
    <div className="w-full max-w-[506px] rounded-md bg-[#040b22]/75 sm:px-[33px] lg:h-[527px]">
      <ul className="grid h-full grid-cols-2 content-start gap-x-[19px] gap-y-[23px] bg-[#020716]/90 px-4 pt-[27px] pb-[27px]">
        {investigators.map((investigator) => (
          <li
            key={investigator.id}
            className="flex h-[210px] flex-col overflow-hidden rounded-[4px] bg-linear-to-b from-[#030b2b] to-[#0a2a8a]"
          >
            <div className="relative flex-1">
              <Image
                src={investigator.image.src}
                alt={investigator.description}
                fill
                sizes="194px"
                className="object-contain object-bottom"
              />
            </div>
            <form action={action}>
              <input type="hidden" name="investigatorId" value={investigator.id} />
              {caseId && <input type="hidden" name="caseId" value={caseId} />}
              <button
                type="submit"
                aria-label={`Select ${investigator.description.toLowerCase()}`}
                className="flex h-7 w-full items-center justify-center rounded-[3px] bg-accent font-display text-[11px] font-black tracking-wide text-white uppercase transition-[filter] hover:brightness-110"
              >
                Select
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
