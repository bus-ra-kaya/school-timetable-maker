import type { Subject } from "../types";
import { Branches } from "../../generated/prisma/enums";

const allSubjects: Subject[] =[
  { grade: 'elementary', name: "Türkçe", hours: 10 },
  { grade: 'elementary', name: "Matematik", hours: 10 },
  { grade: 'elementary', name: "İngilizce", hours: 8 },
  { grade: 'elementary', name: "Beden Eğitimi", hours: 2 },
  { grade: 'elementary', name: "Resim", hours: 2 },
  { grade: 'elementary', name: "Müzik", hours: 2 },
  { grade: 'elementary', name: "Hayat Bilgisi", hours: 4 },
  { grade: 'elementary', name: "Satranç", hours: 2 },

  { grade: 'middle/high', name: "Türkçe", hours: 10 },
  { grade: 'middle/high', name: "Matematik", hours: 10 },
  { grade: 'middle/high', name: "İngilizce", hours: 8 },
  { grade: 'middle/high', name: "Beden Eğitimi", hours: 2 },
  { grade: 'middle/high', name: "Resim", hours: 2 },
  { grade: 'middle/high', name: "Müzik", hours: 2 },
  { grade: 'middle/high', name: "Fen Bilgisi", hours: 4 },
  { grade: 'middle/high', name: "Satranç", hours: 2 },
];

const CAN_TEACH_ALL_GRADES = new Set([ "Resim","Müzik","Beden Eğitimi","Satranç"]);

const seen = new Set<string>();
export const multiGradeSubjects = allSubjects
.filter(s => CAN_TEACH_ALL_GRADES.has(s.name) && !seen.has(s.name) && seen.add(s.name));
export const gradeSpecificSubjects = allSubjects.filter(s => !CAN_TEACH_ALL_GRADES.has(s.name));

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