import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { renderHighlights } from "@/lib/text/highlight";
import { cn } from "@/lib/utils/cn";

import type { CaseFile as CaseFileData } from "../data";

/* The case dossier (Figma: Desktop - 7 › Article - CaseCard, 775×965). */

const STATUS_LABEL: Record<CaseFileData["status"], string> = {
  open: "Open",
  solved: "Solved",
  closed: "Closed",
};

const label = "font-display text-[11.3px] leading-[16.15px] font-black tracking-[1.13px] uppercase";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-[9.69px]">
      <h2 id={id} className={cn(label, "text-accent")}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[3.23px] rounded-[9.69px] border-[0.8px] border-white/8 bg-[rgb(4_18_58/0.55)] p-[16.95px]">
      <dt className="flex items-center gap-[6.46px] pb-[6.46px] font-roboto text-[9.69px] leading-[12.92px] font-semibold tracking-[0.48px] text-[rgb(203_213_225/0.7)] uppercase italic">
        <Image src={icon} alt="" width={13} height={13} className="size-[12.92px]" />
        {label}
      </dt>
      <dd className="font-display text-[16.15px] leading-[22.6px] font-bold tracking-[0.4px]">
        {value}
      </dd>
    </div>
  );
}

type CaseFileProps = {
  caseFile: CaseFileData;
  beginHref: Route;
  className?: string;
};

/** The case dossier: briefing, known facts and objectives, then "Begin investigation". */
export function CaseFile({ caseFile, beginHref, className }: CaseFileProps) {
  const { number, codename, difficulty, status, briefing, knownInformation, objectives } = caseFile;

  return (
    <article
      aria-labelledby="case-file-title"
      className={cn(
        "relative isolate flex flex-col items-center overflow-hidden rounded-[19.38px] border-[0.8px] border-[rgb(252_163_17/0.18)] p-[0.8px] pb-6 backdrop-blur-[8px] lg:h-[965px] lg:w-[775px] lg:pb-[0.8px]",
        "bg-[radial-gradient(930px_1158px_at_50%_0,rgb(5_31_104/0.45),rgb(4_20_66/0.65)_50%,rgb(2_8_28/0.85))]",
        "shadow-[0_20.18px_40.37px_-9.69px_rgb(0_0_0/0.25)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute top-[-103.33px] left-[-103.33px] -z-10 size-[258.34px] rounded-full bg-[#051f68] opacity-60 blur-[40.37px]"
      />
      <div
        aria-hidden
        className="absolute top-[calc(50%+115.88px)] right-[-103.35px] -z-10 size-[232.5px] -translate-y-1/2 rounded-full bg-accent opacity-10 blur-[56.51px]"
      />

      <header className="flex w-full flex-col gap-[9.69px] border-b-[0.8px] border-white/10 px-5 pt-8 pb-6 lg:h-[180px] lg:px-[32.29px] lg:pt-[50.05px] lg:pb-[33.1px]">
        <p className={cn(label, "text-accent")}>{number}</p>
        <h1
          id="case-file-title"
          className="font-display text-[26px] leading-[1.2] font-black tracking-[-0.97px] uppercase drop-shadow-[0_0.8px_0.4px_rgb(0_0_0/0.05)] lg:text-[32.29px]"
        >
          {codename}
        </h1>
        <p className="flex items-center gap-[6.46px] pt-[3.23px] text-[12.92px] leading-[19.38px] text-[rgb(203_213_225/0.7)]">
          Difficulty: <span className="font-bold text-white">{difficulty}</span>
          <span aria-hidden className="px-[4.84px] text-[rgb(203_213_225/0.4)]">
            •
          </span>
          Status: <span className="font-bold text-accent">{STATUS_LABEL[status]}</span>
        </p>
      </header>

      <div className="flex w-full flex-col gap-[29.06px] p-5 lg:h-[702px] lg:p-[32.29px]">
        <Section id="case-file-briefing" title="Briefing">
          <div className="flex flex-col gap-[12.92px] font-roboto text-[12.92px] leading-[22.6px]">
            {briefing.map((paragraph, i) => (
              <p key={i} className={i === briefing.length - 1 ? "text-[#cbd5e1]" : "text-white"}>
                {renderHighlights(paragraph)}
              </p>
            ))}
          </div>
        </Section>

        <Section id="case-file-known" title="Known information">
          <dl className="flex flex-col gap-[12.92px] sm:flex-row">
            <InfoCard
              icon="/icons/case-file/wallet.svg"
              label="Initial wallet"
              value={knownInformation.initialWallet}
            />
            <InfoCard
              icon="/icons/case-file/amount.svg"
              label="Missing amount"
              value={knownInformation.missingAmount}
            />
            <InfoCard
              icon="/icons/case-file/time.svg"
              label="Approximate time"
              value={knownInformation.approximateTime}
            />
          </dl>
        </Section>

        <Section id="case-file-objectives" title="Your objectives">
          <ol className="flex flex-col gap-[9.69px]">
            {objectives.map((objective, i) => (
              <li
                key={i}
                className="flex items-center gap-[12.92px] rounded-[9.69px] border-[0.8px] border-white/7 bg-[rgb(4_18_58/0.45)] px-[16.95px] py-[13.72px] font-roboto text-[14.53px] leading-[22.6px] tracking-[-0.36px]"
              >
                <span
                  aria-hidden
                  className="grid size-[25.83px] shrink-0 place-items-center rounded-full border-[0.8px] border-accent/40 bg-accent/15 font-display text-[11.3px] leading-[16.15px] font-bold text-accent shadow-[0_0_8.07px_rgb(252_163_17/0.15)]"
                >
                  {i + 1}
                </span>
                {objective}
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Link
        href={beginHref}
        className="flex h-[57.32px] w-[calc(100%-40px)] max-w-[569.96px] shrink-0 items-center justify-center gap-[8.07px] rounded-[25.83px] bg-accent p-[8.07px] font-display text-[16.15px] leading-[1.62] font-black text-[#020512] uppercase transition-[filter] hover:brightness-110"
      >
        Begin investigation
        <Image
          src="/icons/arrow-line.svg"
          alt=""
          width={20}
          height={20}
          className="size-[19.38px] -scale-y-100 -rotate-90"
        />
      </Link>
    </article>
  );
}
