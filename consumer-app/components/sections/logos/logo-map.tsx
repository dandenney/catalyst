import { type ReactNode } from "react";

const LOGO_SIZE = 40;

function FigmaLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 38 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
        fill="#94A3B8"
      />
      <path
        d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
        fill="#64748B"
      />
      <path
        d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
        fill="#CBD5E1"
      />
      <path
        d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
        fill="#94A3B8"
      />
      <path
        d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
        fill="#64748B"
      />
    </svg>
  );
}

function ReactLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="-11.5 -10.23 23 20.46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle r="2.05" fill="#94A3B8" />
      <g stroke="#94A3B8" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function TypeScriptLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="128" height="128" rx="8" fill="#94A3B8" />
      <path
        d="M82.8 95.2c2.4 3.7 6 6.5 11.8 6.5 5 0 8.2-2.5 8.2-5.9 0-4.1-3.3-5.6-8.8-8l-3-1.3c-8.7-3.7-14.5-8.4-14.5-18.2 0-9.1 6.9-16 17.7-16 7.7 0 13.2 2.7 17.2 9.6l-9.4 6c-2.1-3.7-4.3-5.1-7.8-5.1-3.5 0-5.8 2.3-5.8 5.1 0 3.6 2.3 5 7.5 7.2l3 1.3c10.3 4.4 16.1 8.9 16.1 19 0 10.9-8.5 16.8-20 16.8-11.2 0-18.4-5.3-21.9-12.3l9.7-5.7z"
        fill="#0A0E1A"
      />
      <path
        d="M50 63.5h11.5v38.9h-11.5v-38.9zM27.6 52.7h45.3v10.8H27.6V52.7z"
        fill="#0A0E1A"
      />
    </svg>
  );
}

function ShadcnLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        stroke="#94A3B8"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        stroke="#94A3B8"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TailwindLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 54 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25.004 7.263 26.472 8.754 28.097 10.404C30.744 13.09 33.808 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.496 8.937 41.028 7.446 39.403 5.796C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.504 23.464 12.972 24.954 14.597 26.604C17.244 29.29 20.308 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C28.996 25.137 27.528 23.646 25.903 21.996C23.256 19.31 20.192 16.2 13.5 16.2Z"
        fill="#94A3B8"
      />
    </svg>
  );
}

function NextjsLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="90" cy="90" r="87" stroke="#94A3B8" strokeWidth="6" />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
        fill="#94A3B8"
      />
      <rect x="115" y="54" width="12" height="72" fill="#94A3B8" />
    </svg>
  );
}

function VercelLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 76 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#94A3B8" />
    </svg>
  );
}

function NodejsLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 256 289"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M128 288.464C124.208 288.464 120.637 287.508 117.287 285.597L81.869 264.602C76.686 261.734 79.289 260.779 80.912 260.268C88.476 257.844 89.877 257.289 97.886 252.773C98.619 252.329 99.576 252.551 100.31 253.062L127.778 269.647C128.733 270.159 130.134 270.159 130.867 269.647L234.966 209.893C235.921 209.381 236.433 208.425 236.433 207.247V87.739C236.433 86.561 235.921 85.605 234.966 85.093L130.867 25.561C129.912 25.049 128.511 25.049 127.778 25.561L23.679 85.093C22.724 85.605 22.212 86.783 22.212 87.739V207.247C22.212 208.203 22.724 209.381 23.679 209.893L52.103 226.478C67.494 234.29 77.353 224.876 77.353 215.462V97.153C77.353 95.753 78.531 94.353 80.154 94.353H92.034C93.435 94.353 94.835 95.531 94.835 97.153V215.462C94.835 236.936 83.267 249.461 62.832 249.461C56.382 249.461 51.199 249.461 36.252 242.118L8.784 226.478C2.334 222.685 -1.458 215.684 -1.458 208.203V88.695C-1.458 81.214 2.334 74.212 8.784 70.42L112.883 10.666C119.111 7.095 127.334 7.095 133.562 10.666L237.661 70.42C244.111 74.212 247.903 81.214 247.903 88.695V208.203C247.903 215.684 244.111 222.685 237.661 226.478L133.562 286.232C130.423 287.508 126.63 288.464 128 288.464Z"
        fill="#94A3B8"
      />
    </svg>
  );
}

function ViteLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 410 404"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.6 197.916 389.025L8.45692 59.5246C3.93061 52.3812 10.2939 43.5765 18.5004 45.2827L204.229 82.6634C205.282 82.8756 206.362 82.8695 207.413 82.6456L390.084 45.3079C398.245 43.5398 404.708 52.2134 399.641 59.5246Z"
        fill="#64748B"
      />
      <path
        d="M292.965 1.57281L156.801 28.2552C153.886 28.8393 151.709 31.3329 151.559 34.3038L142.032 209.209C141.836 213.079 145.369 216.089 149.145 215.288L188.216 206.891C192.39 206.002 196.141 209.536 195.357 213.741L183.631 276.386C182.8 280.842 187.045 284.477 191.304 283.018L212.545 275.892C216.809 274.431 221.056 278.072 220.217 282.531L202.398 377.218C201.17 383.751 209.89 387.289 213.321 381.545L215.47 377.926L341.607 142.307C343.824 138.008 340.076 133.128 335.397 134.229L295.179 143.615C291.022 144.584 287.41 140.821 288.551 136.718L313.403 44.3711C314.539 40.2818 310.952 36.5238 306.805 37.4654L292.965 1.57281Z"
        fill="#94A3B8"
      />
    </svg>
  );
}

function PrismaLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 159 194"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.57588 120.728L63.4161 3.05416C67.1836 -4.27174 78.0615 -3.44526 80.6486 4.48936L156.353 118.384C159.076 126.669 153.718 135.421 145.088 136.637L19.7621 154.305C9.98117 155.683 2.1689 146.637 5.11174 137.223L2.57588 120.728ZM81.1135 30.7725C81.9803 28.0975 85.9476 28.0034 86.9456 30.6336L136.985 118.108C137.905 120.555 136.137 123.147 133.549 123.512L28.8261 138.275C25.9723 138.677 23.856 135.803 24.8915 133.109L81.1135 30.7725Z"
        fill="#94A3B8"
      />
    </svg>
  );
}

export interface LogoEntry {
  key: string;
  label: string;
  icon: ReactNode;
}

export const LOGO_MAP: Record<string, ReactNode> = {
  figma: <FigmaLogo />,
  react: <ReactLogo />,
  typescript: <TypeScriptLogo />,
  shadcn: <ShadcnLogo />,
  tailwind: <TailwindLogo />,
  nextjs: <NextjsLogo />,
  vercel: <VercelLogo />,
  nodejs: <NodejsLogo />,
  vite: <ViteLogo />,
  prisma: <PrismaLogo />,
};

export const ALL_LOGOS: LogoEntry[] = [
  { key: "figma", label: "Figma", icon: <FigmaLogo /> },
  { key: "react", label: "React", icon: <ReactLogo /> },
  { key: "typescript", label: "TypeScript", icon: <TypeScriptLogo /> },
  { key: "shadcn", label: "Shadcn/ui", icon: <ShadcnLogo /> },
  { key: "tailwind", label: "Tailwind", icon: <TailwindLogo /> },
  { key: "nextjs", label: "Next.js", icon: <NextjsLogo /> },
  { key: "vercel", label: "Vercel", icon: <VercelLogo /> },
  { key: "nodejs", label: "Node.js", icon: <NodejsLogo /> },
  { key: "vite", label: "Vite", icon: <ViteLogo /> },
  { key: "prisma", label: "Prisma", icon: <PrismaLogo /> },
];
