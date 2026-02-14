import { ClipboardCheck } from "lucide-react";

import type { Assessment } from "@/types/content";

const TYPE_COLORS: Record<string, string> = {
  Quiz: "border-emerald-500/30 text-emerald-400",
  "Code Challenge": "border-amber-500/30 text-amber-400",
  "Hands-on": "border-violet-500/30 text-violet-400",
  "Project-based": "border-cyan-500/30 text-cyan-400",
  Practical: "border-rose-500/30 text-rose-400",
  Interactive: "border-sky-500/30 text-sky-400",
  "Case Study": "border-orange-500/30 text-orange-400",
  "Design Review": "border-pink-500/30 text-pink-400",
  Comprehensive: "border-indigo-500/30 text-indigo-400",
};

interface AssessmentCardProps {
  assessment: Assessment;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const typeColor =
    TYPE_COLORS[assessment.type] ?? "border-[#1E293B] text-[#94A3B8]";

  return (
    <div className="group/card flex h-full min-h-[180px] flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F1629] transition-all duration-200 hover:border-[#3B82F6]/30">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
            {assessment.level}
          </span>
          <ClipboardCheck className="size-4 text-[#94A3B8]" />
        </div>

        <h3 className="text-base font-medium tracking-tight text-[#F1F5F9]">
          {assessment.title}
        </h3>

        <span
          className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeColor}`}
        >
          {assessment.type}
        </span>
      </div>
    </div>
  );
}
