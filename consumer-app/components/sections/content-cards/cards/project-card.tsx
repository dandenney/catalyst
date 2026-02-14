import { FolderCode } from "lucide-react";

import type { Project } from "@/types/content";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group/card flex h-full min-h-[180px] flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F1629] transition-all duration-200 hover:border-[#3B82F6]/30">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
            {project.level}
          </span>
          <FolderCode className="size-4 text-[#94A3B8]" />
        </div>

        <h3 className="text-base font-medium tracking-tight text-[#F1F5F9]">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
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
