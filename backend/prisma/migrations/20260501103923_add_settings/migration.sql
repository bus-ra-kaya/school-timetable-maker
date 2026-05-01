-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "maxHoursPerTeacher" INTEGER NOT NULL DEFAULT 24,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
