import type { Subject } from "../types";
import { Branches } from "../../generated/prisma/enums";

export const allSubjects: Subject[] =[
  { grade: 'elementary', name: "Türkçe", hours: 10, doubleDaily: true },
  { grade: 'elementary', name: "Matematik", hours: 10, doubleDaily: true},
  { grade: 'elementary', name: "İngilizce", hours: 8, doubleDaily: true },
  { grade: 'elementary', name: "Hayat Bilgisi", hours: 4, doubleDaily: true },
  { grade: 'elementary', name: "Beden Eğitimi", hours: 2, doubleDaily: false },
  { grade: 'elementary', name: "Resim", hours: 2, doubleDaily: false },
  { grade: 'elementary', name: "Müzik", hours: 2, doubleDaily: false },
  { grade: 'elementary', name: "Satranç", hours: 2, doubleDaily: false },

  { grade: 'middle/high', name: "Türkçe", hours: 10, doubleDaily: true },
  { grade: 'middle/high', name: "Matematik", hours: 10, doubleDaily: true },
  { grade: 'middle/high', name: "İngilizce", hours: 8, doubleDaily: true },
  { grade: 'middle/high', name: "Fen Bilgisi", hours: 4, doubleDaily: true },
  { grade: 'middle/high', name: "Beden Eğitimi", hours: 2, doubleDaily: false },
  { grade: 'middle/high', name: "Resim", hours: 2, doubleDaily: false },
  { grade: 'middle/high', name: "Müzik", hours: 2, doubleDaily: false },
  { grade: 'middle/high', name: "Satranç", hours: 2, doubleDaily: false },
];

export const branchMap: Record<string, Branches> = {
  'Türkçe':        Branches.TURKCE,
  'Matematik':     Branches.MATEMATIK,
  'İngilizce':     Branches.INGILIZCE,
  'Beden Eğitimi': Branches.BEDEN_EGITIMI,
  'Resim':         Branches.RESIM,
  'Müzik':         Branches.MUZIK,
  'Hayat Bilgisi': Branches.HAYAT_BILGISI,
  'Fen Bilgisi':   Branches.FEN_BILGISI,
  'Satranç':       Branches.SATRANC,
};


const CAN_TEACH_ALL_GRADES = new Set([ "Resim","Müzik","Beden Eğitimi","Satranç"]);

export const ELEMENTARY_GRADES = [1,2,3,4];
export const MIDDLE_HIGH_GRADES = [5,6,7,8,9,10,11,12];

export const GRADE_COUNT = 12;
export const BRANCH_COUNT = 3;

export const MAX_HOURS_PER_TEACHER = 24;

const seen = new Set<string>();
export const multiGradeSubjects = allSubjects
.filter(s => CAN_TEACH_ALL_GRADES.has(s.name) && !seen.has(s.name) && seen.add(s.name));
export const gradeSpecificSubjects = allSubjects.filter(s => !CAN_TEACH_ALL_GRADES.has(s.name));