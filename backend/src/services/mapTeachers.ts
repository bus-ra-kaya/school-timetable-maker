import type { TeacherData } from "../types";
import { branchMap } from "../data/subjects";

export const mapTeachers = (data: TeacherData) => {
  return {
    name: data.name,
    hours: 0,
    branch: branchMap[data.branch]

  };
}
