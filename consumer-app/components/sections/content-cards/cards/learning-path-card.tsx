import { BookOpen, ClipboardCheck, FolderCode, Route } from "lucide-react";

import type { LearningPath } from "@/types/content";

interface LearningPathCardProps {
  learningPath: LearningPath;
}

export function LearningPathCard({ learningPath }: LearningPathCardProps) {
  return (
    <div className="group/card flex h-full min-h-[180px] flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F1629] transition-all duration-200 hover:border-[#3B82F6]/30">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
            {learningPath.level}
          </span>
          <Route className="size-4 text-[#94A3B8]" />
        </div>

        <h3 className="text-base font-medium tracking-tight text-[#F1F5F9]">
          {learningPath.title}
        </h3>

        <div className="h-px w-full bg-gradient-to-r from-[#3B82F6]/40 to-transparent" />

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <BookOpen className="size-3.5 text-[#94A3B8]" />
            <span className="text-sm font-medium text-[#F1F5F9]">
              {learningPath.courses.length}
            </span>
            <span className="text-xs text-[#94A3B8]">Courses</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FolderCode className="size-3.5 text-[#94A3B8]" />
            <span className="text-sm font-medium text-[#F1F5F9]">
              {learningPath.projects.length}
            </span>
            <span className="text-xs text-[#94A3B8]">Projects</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ClipboardCheck className="size-3.5 text-[#94A3B8]" />
            <span className="text-sm font-medium text-[#F1F5F9]">
              {learningPath.assessments.length}
            </span>
            <span className="text-xs text-[#94A3B8]">Assessments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
