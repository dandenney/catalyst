import type { LearningPath } from "@/types/content";

export const learningPaths: LearningPath[] = [
  {
    id: "T401",
    title: "AI Engineer Track",
    level: "Intermediate to Advanced",
    courses: ["C102", "C105", "C107", "C108", "C111", "C112"],
    projects: ["P203", "P204", "P207", "P220"],
    assessments: ["A304", "A305", "A307", "A320"],
  },
  {
    id: "T402",
    title: "Data Scientist Track",
    level: "Beginner to Advanced",
    courses: ["C102", "C103", "C105", "C106", "C113", "C114"],
    projects: ["P202", "P206", "P214", "P217"],
    assessments: ["A303", "A310", "A314", "A320"],
  },
  {
    id: "T403",
    title: "Generative AI Specialist Track",
    level: "Intermediate to Advanced",
    courses: ["C101", "C110", "C108", "C111", "C116"],
    projects: ["P204", "P208", "P212", "P218"],
    assessments: ["A308", "A313", "A315", "A320"],
  },
];
