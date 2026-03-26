/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId,teacher_id,day,hour]` on the table `lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,class_id,day,hour]` on the table `lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "lesson_class_id_day_hour_key";

-- DropIndex
DROP INDEX "lesson_teacher_id_day_hour_key";

-- AlterTable
ALTER TABLE "classroom" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_scheduleId_idx" ON "lesson"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_scheduleId_teacher_id_day_hour_key" ON "lesson"("scheduleId", "teacher_id", "day", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_scheduleId_class_id_day_hour_key" ON "lesson"("scheduleId", "class_id", "day", "hour");

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
