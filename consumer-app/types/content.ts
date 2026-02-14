export type ContentType =
  | "courses"
  | "projects"
  | "assessments"
  | "learning_paths";

export interface Course {
  id: string;
  title: string;
  level: string;
  duration_hours: number;
  skills: string[];
  prerequisites: string[];
}

export interface Project {
  id: string;
  title: string;
  level: string;
  skills: string[];
}

export interface Assessment {
  id: string;
  title: string;
  type: string;
  level: string;
}

export interface LearningPath {
  id: string;
  title: string;
  level: string;
  courses: string[];
  projects: string[];
  assessments: string[];
}

export type ContentItem = Course | Project | Assessment | LearningPath;

export interface ContentTypeMap {
  courses: Course;
  projects: Project;
  assessments: Assessment;
  learning_paths: LearningPath;
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  courses: "Courses",
  projects: "Projects",
  assessments: "Assessments",
  learning_paths: "Learning Paths",
};
