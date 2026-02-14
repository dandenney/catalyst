import type {
  Assessment,
  ContentItem,
  ContentType,
  Course,
  LearningPath,
  Project,
} from "@/types/content";

import { AssessmentCard } from "./assessment-card";
import { CourseCard } from "./course-card";
import { LearningPathCard } from "./learning-path-card";
import { ProjectCard } from "./project-card";

export function renderContentCard(
  contentType: ContentType,
  item: ContentItem,
) {
  switch (contentType) {
    case "courses":
      return <CourseCard course={item as Course} />;
    case "projects":
      return <ProjectCard project={item as Project} />;
    case "assessments":
      return <AssessmentCard assessment={item as Assessment} />;
    case "learning_paths":
      return <LearningPathCard learningPath={item as LearningPath} />;
  }
}
