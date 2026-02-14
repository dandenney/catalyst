import { Clock, GitBranch } from "lucide-react";

import type { Course } from "@/types/content";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group/card flex h-full min-h-[180px] flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F1629] transition-all duration-200 hover:border-[#3B82F6]/30">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
          {course.level}
        </span>

        <h3 className="text-base font-medium tracking-tight text-[#F1F5F9]">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {course.duration_hours} hrs
          </span>
          {course.prerequisites.length > 0 && (
            <span className="flex items-center gap-1.5">
              <GitBranch className="size-3.5" />
              {course.prerequisites.length} prereq
              {course.prerequisites.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {course.skills.map((skill) => (
            <span
              key={skill}
              className="rounded border border-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
