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
 * 2×2 investigator picker (Figma: Desktop - 4, 607×633 panel, 232px cards).
 * Each SELECT is a tiny form posting to a Server Action, so it works before
 * JavaScript loads and the choice is saved server-side, not just in the URL.
 */
export function InvestigatorPicker({ investigators, action, caseId }: InvestigatorPickerProps) {
  return (
    <div className="w-full rounded-[6px] bg-[#020719] lg:h-[633px] lg:w-[607px] lg:pt-px lg:pl-[37px]">
      <ul className="grid grid-cols-2 gap-x-[22.5px] gap-y-[44.7px] bg-[#030a1d] p-4 lg:h-[608px] lg:w-[546px] lg:grid-cols-[232.16px_232.16px] lg:p-0 lg:pt-[33.34px] lg:pl-[18.67px]">
        {investigators.map((investigator) => (
          <li
            key={investigator.id}
            className="relative h-[243.36px] rounded-[8.38px] border-[1.8px] border-black/20 bg-linear-to-b from-[#02081c] to-[#051f68]"
          >
            {/* Figure stands on the SELECT bar; its height is set per figure in Figma. */}
            <div className="absolute inset-x-0 top-0 h-[216px]">
              <Image
                src={investigator.image.src}
                alt={investigator.description}
                width={investigator.image.width}
                height={investigator.image.height}
                sizes="200px"
                style={{ height: investigator.pickerHeight }}
                className="absolute bottom-0 left-1/2 w-auto max-w-none -translate-x-1/2"
              />
            </div>
            <form action={action} className="absolute inset-x-0 top-[216px]">
              <input type="hidden" name="investigatorId" value={investigator.id} />
              {caseId && <input type="hidden" name="caseId" value={caseId} />}
              <button
                type="submit"
                aria-label={`Select ${investigator.description.toLowerCase()}`}
                className="flex w-full items-center justify-center rounded-[4px] bg-accent p-[6.28px] font-display text-[13.34px] leading-[1.62] font-black text-white uppercase transition-[filter] hover:brightness-110"
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
