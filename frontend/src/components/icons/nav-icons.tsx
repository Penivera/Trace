import type { SVGProps } from "react";

/*
 * Sidebar icons, path data copied from the Figma file (Trace Game Design,
 * side nav). Colours use `currentColor` so the active item can tint them.
 * Each keeps its Figma box size; positions inside 22px boxes reproduce the
 * Figma layer insets.
 */

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function HomeIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden {...props}>
      <path
        {...stroke}
        strokeWidth={2.01667}
        transform="translate(1.742 1.742)"
        d="M1.00841 6.96667L9.25841 1.00833L17.5084 6.96667V16.5917C17.5084 17.3511 16.8928 17.9667 16.1334 17.9667H12.0084C11.5025 17.9667 11.0917 17.5559 11.0917 17.05V13.3833C11.0917 12.8774 10.681 12.4667 10.1751 12.4667H8.34174C7.83582 12.4667 7.42507 12.8774 7.42507 13.3833V17.05C7.42507 17.5559 7.01433 17.9667 6.50841 17.9667H2.38341C1.62402 17.9667 1.00841 17.3511 1.00841 16.5917V6.96667Z"
      />
    </svg>
  );
}

export function CasesIcon(props: IconProps) {
  return (
    <svg width="28.963" height="34" viewBox="0 0 28.963 34" aria-hidden {...props}>
      <g {...stroke} strokeWidth={2.30864}>
        <path d="M3.5382 8.84698C3.5382 7.57281 4.57266 6.53834 5.84684 6.53834H10.4641L12.7728 8.84698H22.0073C23.2815 8.84698 24.316 9.88145 24.316 11.1556V21.5445C24.316 22.8187 23.2815 23.8532 22.0073 23.8532H5.84684C4.57266 23.8532 3.5382 22.8187 3.5382 21.5445V8.84698Z" />
        <path d="M9.65426 18.4166V21.1666" />
        <path d="M14.4816 15.5834V21.577" />
      </g>
    </svg>
  );
}

export function InvestigationIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" overflow="hidden" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M18.1507 7.15792H1.71474V5H18.1507V7.15792ZM13.0555 13.6317H2.78308L3.39943 10.3948H16.466L16.8769 12.5527C17.637 12.5959 18.3664 12.7577 19.0649 13.049L18.1507 8.23688H1.71474L0.6875 13.6317V15.7896H1.71474V22.2634H10.4463C10.1073 21.4002 9.9327 20.4831 9.9327 19.566V20.1054H3.76923V15.7896H9.9327V19.566C9.9327 17.7749 10.5901 15.973 11.8845 14.6027C12.2543 14.2251 12.6446 13.9014 13.0555 13.6317ZM23.6875 25.5002L22.2596 27L19.0546 23.6876C18.3458 24.1515 17.5035 24.4213 16.6098 24.4213C14.0417 24.4213 11.9872 22.2634 11.9872 19.566C11.9872 16.8686 14.0417 14.7106 16.6098 14.7106C19.1779 14.7106 21.2324 16.8686 21.2324 19.566C21.2324 20.5154 20.9756 21.411 20.5236 22.1555L23.6875 25.5002ZM19.1779 19.566C19.1779 18.8506 18.9073 18.1645 18.4257 17.6586C17.9441 17.1528 17.2909 16.8686 16.6098 16.8686C15.9287 16.8686 15.2755 17.1528 14.7939 17.6586C14.3122 18.1645 14.0417 18.8506 14.0417 19.566C14.0417 20.2814 14.3122 20.9675 14.7939 21.4733C15.2755 21.9792 15.9287 22.2634 16.6098 22.2634C17.2909 22.2634 17.9441 21.9792 18.4257 21.4733C18.9073 20.9675 19.1779 20.2814 19.1779 19.566Z"
      />
    </svg>
  );
}

export function EvidenceIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden {...props}>
      <g {...stroke} strokeWidth={1.83333}>
        <path
          transform="translate(2.75 2.75)"
          d="M2.75 0.916667H12.8333C13.8452 0.916667 14.6667 1.73816 14.6667 2.75V13.75C14.6667 14.7618 13.8452 15.5833 12.8333 15.5833H2.75C1.73816 15.5833 0.916667 14.7618 0.916667 13.75V2.75C0.916667 1.73816 1.73816 0.916667 2.75 0.916667Z"
        />
        <path d="M3.667 7.333H6.417M3.667 11H6.417M3.667 14.667H6.417" />
        <path
          transform="translate(10.083 10.083)"
          d="M0.916667 4.58333L4.58333 0.916667L6.41667 2.75L2.75 6.41667H0.916667V4.58333"
        />
      </g>
    </svg>
  );
}

export function AcademyIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden {...props}>
      <g {...stroke} strokeWidth={1.83333}>
        <path
          transform="translate(0.917 3.667)"
          d="M19.25 5.5L10.0833 0.916667L0.916667 5.5L10.0833 10.0833L19.25 5.5Z"
        />
        <path
          transform="translate(4.583 10.542)"
          d="M0.916667 0.916667V4.125C0.916667 5.95833 3.39167 7.33333 6.41667 7.33333C9.44167 7.33333 11.9167 5.95833 11.9167 4.125V0.916667"
        />
        <path d="M20.167 9.167V14.667" />
      </g>
    </svg>
  );
}
