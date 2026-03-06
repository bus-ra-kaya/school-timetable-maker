-- CreateEnum
CREATE TYPE "Branches" AS ENUM ('TURKCE', 'MATEMATIK', 'INGILIZCE', 'BEDEN_EGITIMI', 'RESIM', 'MUZIK', 'HAYAT_BILGISI', 'FEN_BILGISI', 'SATRANC');

-- CreateEnum
CREATE TYPE "Grades" AS ENUM ('ELEMENTARY', 'MIDDLE_HIGH');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateTable
CREATE TABLE "teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "branch" "Branches" NOT NULL,
    "grade" "Grades",

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson" (
    "id" TEXT NOT NULL,
    "branch" "Branches" NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "day" "Days" NOT NULL,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" "Grades" NOT NULL,

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teacher_branch_idx" ON "teacher"("branch");

-- CreateIndex
CREATE INDEX "lesson_teacher_id_idx" ON "lesson"("teacher_id");

-- CreateIndex
CREATE INDEX "lesson_class_id_idx" ON "lesson"("class_id");

-- CreateIndex
CREATE INDEX "lesson_day_hour_idx" ON "lesson"("day", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_teacher_id_day_hour_key" ON "lesson"("teacher_id", "day", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_class_id_day_hour_key" ON "lesson"("class_id", "day", "hour");

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
