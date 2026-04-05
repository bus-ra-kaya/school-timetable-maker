import type { ClassData } from "../types";
import { Grades } from "../../generated/prisma/enums";

export const mapClasses = (data: ClassData) => {
  return {
    name: `${data.year} - ${data.class}`,
    grade: data.year >= 1 && data.year <= 4 ? Grades.ELEMENTARY : Grades.MIDDLE_HIGH,
  };
}
